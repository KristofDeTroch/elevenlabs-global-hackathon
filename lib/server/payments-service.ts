import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import type { CreatePaymentLinkData } from "@/lib/validations/payment-schema";
import { Decimal } from "@prisma/client/runtime/client";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {});

export interface PaymentLinkResult {
  paymentId: string;
  paymentLinkUrl: string;
}

export interface TranscriptMessage {
  role: string;
  message: string;
}

export interface ExtractedPaymentInfo {
  amount: string | null;
  customerEmail: string | null;
  customerName: string | null;
}

const paymentExtractionSchema = z.object({
  amount: z
    .string()
    .nullable()
    .describe(
      "The payment amount mentioned in the conversation, as a string number (e.g., '500.00' for $500). Return null if no amount is mentioned."
    ),
  customerEmail: z
    .string()
    .email()
    .nullable()
    .describe(
      "The customer's email address if mentioned in the conversation. Return null if not mentioned."
    ),
  customerName: z
    .string()
    .nullable()
    .describe(
      "The customer's full name if mentioned in the conversation. Return null if not mentioned."
    ),
});

/**
 * Extract payment information from a conversation transcript using AI.
 * Uses Anthropic Claude to extract structured payment data from natural language.
 */
export async function extractPaymentInfoFromTranscript(
  transcript: TranscriptMessage[]
): Promise<ExtractedPaymentInfo> {
  try {
    // Convert transcript array to a readable conversation format
    const conversationText = transcript
      .map(
        (msg) =>
          `${msg.role === "agent" ? "Agent" : "Customer"}: ${msg.message}`
      )
      .join("\n\n");

    const prompt = `Analyze the following conversation transcript and extract payment information if mentioned.

Extract:
1. Payment amount - any dollar amount or payment figure mentioned (convert to numeric string format, e.g., "500.00" for $500)
2. Customer email - any email address mentioned by the customer
3. Customer name - the customer's full name if mentioned

If any information is not mentioned in the conversation, return null for that field.

Conversation transcript:
${conversationText}`;

    const { object } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022", {
        apiKey: process.env.ANTHROPIC_API_KEY,
      }),
      schema: paymentExtractionSchema,
      prompt,
    });

    return {
      amount: object.amount,
      customerEmail: object.customerEmail,
      customerName: object.customerName,
    };
  } catch (error) {
    console.error("Error extracting payment info from transcript:", error);
    // Return nulls on error to allow fallback in webhook handler
    return {
      amount: null,
      customerEmail: null,
      customerName: null,
    };
  }
}

/**
 * Create a Stripe payment link for a one-time payment and store it in the database.
 */
export async function createPaymentLink(
  data: CreatePaymentLinkData
): Promise<PaymentLinkResult> {
  try {
    // Validate case exists
    const caseData = await prisma.case.findUnique({
      where: { id: data.caseId },
    });

    if (!caseData) {
      throw new Error("Case not found");
    }

    const amount = new Decimal(data.amount);
    const amountInCents = Math.round(Number(amount) * 100);

    // Create or retrieve Stripe customer with minimal info
    let customer: Stripe.Customer;
    const existingCustomers = await stripe.customers.list({
      email: data.customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: data.customerEmail,
        name: data.customerName,
      });
    }

    // Create Stripe Checkout Session for one-time payment
    // This provides a payment link URL and better webhook tracking
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Payment for Case ${
                caseData.externalReference || caseData.id
              }`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/payments/cancel`,
      metadata: {
        caseId: data.caseId,
      },
    });

    // Store payment record in database
    const payment = await prisma.payment.create({
      data: {
        caseId: data.caseId,
        amount,
        status: "PENDING",
        method: "STRIPE",
        stripeCustomerId: customer.id,
        stripeCheckoutSessionId: session.id,
        paymentLinkUrl: session.url,
        scheduledDate: new Date(), // Set to now for immediate payments
      },
    });

    return {
      paymentId: payment.id,
      paymentLinkUrl: session.url || "",
    };
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
}

/**
 * Handle Stripe webhook events and update payment status accordingly.
 */
export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Find payment by checkout session ID (primary) or customer ID (fallback)
        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { stripeCheckoutSessionId: session.id },
              {
                AND: [
                  { stripeCustomerId: session.customer as string },
                  { stripeCheckoutSessionId: null },
                ],
              },
            ],
          },
          include: {
            case: true,
          },
        });

        if (payment && session.payment_status === "paid") {
          // Update payment status to CLEARED
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "CLEARED",
              processedDate: new Date(),
              reference: session.payment_intent as string,
              stripeCheckoutSessionId: session.id,
            },
          });

          // Update case balance
          const paymentAmount = payment.amount;
          const newBalance = payment.case.currentBalance.minus(paymentAmount);

          await prisma.case.update({
            where: { id: payment.caseId },
            data: {
              currentBalance: newBalance.greaterThanOrEqualTo(0)
                ? newBalance
                : new Decimal(0),
              status:
                newBalance.equals(0) || newBalance.lessThanOrEqualTo(0)
                  ? "PAID_IN_FULL"
                  : payment.case.status,
            },
          });
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { stripeCheckoutSessionId: session.id },
              {
                AND: [
                  { stripeCustomerId: session.customer as string },
                  { stripeCheckoutSessionId: null },
                ],
              },
            ],
          },
          include: {
            case: true,
          },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "CLEARED",
              processedDate: new Date(),
              reference: session.payment_intent as string,
              stripeCheckoutSessionId: session.id,
            },
          });

          // Update case balance
          const paymentAmount = payment.amount;
          const newBalance = payment.case.currentBalance.minus(paymentAmount);

          await prisma.case.update({
            where: { id: payment.caseId },
            data: {
              currentBalance: newBalance.greaterThanOrEqualTo(0)
                ? newBalance
                : new Decimal(0),
              status:
                newBalance.equals(0) || newBalance.lessThanOrEqualTo(0)
                  ? "PAID_IN_FULL"
                  : payment.case.status,
            },
          });
        }
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { stripeCheckoutSessionId: session.id },
              {
                AND: [
                  { stripeCustomerId: session.customer as string },
                  { stripeCheckoutSessionId: null },
                ],
              },
            ],
          },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "REJECTED",
              processedDate: new Date(),
              stripeCheckoutSessionId: session.id,
            },
          });
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { stripeCheckoutSessionId: session.id },
              {
                AND: [
                  { stripeCustomerId: session.customer as string },
                  { stripeCheckoutSessionId: null },
                ],
              },
            ],
          },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "CANCELLED",
              stripeCheckoutSessionId: session.id,
            },
          });
        }
        break;
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    throw error;
  }
}
