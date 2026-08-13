import { NextRequest, NextResponse } from "next/server";
import { flutterwaveProvider, reverifyFlutterwaveTransaction } from "@/lib/payments/flutterwave";
import { fulfillOrder, markOrderFailed } from "@/lib/payments";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const result = await flutterwaveProvider.verifyWebhook(rawBody, req.headers);

  if (!result.valid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (result.eventType === "payment.succeeded" && result.providerRef) {
    // result.providerRef is our tx_ref (== order.id). The webhook payload
    // also carries Flutterwave's own numeric transaction id, which is what
    // their re-verification endpoint requires.
    const event = result.raw as { data?: { id?: number | string; amount?: number; currency?: string } };
    const flwTransactionId = event.data?.id;

    if (!flwTransactionId) {
      console.error("Flutterwave webhook missing transaction id — cannot re-verify.");
      return NextResponse.json({ received: true }); // ack, but don't fulfill
    }

    const verification = await reverifyFlutterwaveTransaction(String(flwTransactionId));

    if (!verification.ok) {
      console.error(`Flutterwave re-verification failed for tx ${flwTransactionId}`);
      return NextResponse.json({ received: true });
    }

    // Confirm the re-verified amount matches what we expected to charge —
    // guards against a tampered or mismatched webhook amount.
    const order = await prisma.order.findUnique({ where: { providerRef: result.providerRef } });
    if (
      order &&
      verification.amount !== undefined &&
      Math.round(verification.amount * 100) !== order.amountCents
    ) {
      console.error(
        `Flutterwave amount mismatch for order ${order.id}: expected ${order.amountCents}, got ${verification.amount}`
      );
      return NextResponse.json({ received: true });
    }

    await fulfillOrder(result.providerRef, "flutterwave");
  }

  if (result.eventType === "payment.failed" && result.providerRef) {
    await markOrderFailed(result.providerRef);
  }

  return NextResponse.json({ received: true });
}
