import { NextResponse } from "next/server";
import { createPaymentLink } from "@/lib/server/payments-service";
import { createPaymentLinkSchema } from "@/lib/validations/payment-schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createPaymentLinkSchema.parse(body);

    const result = await createPaymentLink(validatedData);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating payment link:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 500 }
    );
  }
}
