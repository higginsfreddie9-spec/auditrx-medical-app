import { NextRequest, NextResponse } from "next/server";
import { paystackProvider } from "@/lib/payments/paystack";
import { fulfillOrder, markOrderFailed } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const result = await paystackProvider.verifyWebhook(rawBody, req.headers);

  if (!result.valid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (result.eventType === "payment.succeeded" && result.providerRef) {
    await fulfillOrder(result.providerRef, "paystack");
  }

  if (result.eventType === "payment.failed" && result.providerRef) {
    await markOrderFailed(result.providerRef);
  }

  // Paystack expects a 200 with no particular body to acknowledge receipt.
  return NextResponse.json({ received: true });
}
