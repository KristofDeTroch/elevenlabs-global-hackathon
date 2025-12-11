import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { handleStripeWebhook } from "@/lib/server/payments-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {});

export async function POST(req: Request) {
  try {
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get raw body for signature verification
    const body = await req.text();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Error verifying webhook signature:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the webhook event
    await handleStripeWebhook(event);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);

    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
