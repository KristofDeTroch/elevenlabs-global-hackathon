import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import type { CreatePaymentLinkData } from "@/lib/validations/payment-schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

export interface PaymentLinkResult {
  paymentId: string;
  paymentLinkUrl: string;
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
