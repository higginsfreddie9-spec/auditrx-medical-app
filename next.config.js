import { NextRequest, NextResponse } from "next/server";
import { stripeProvider } from "@/lib/payments/stripe";
import { fulfillOrder, markOrderFailed } from "@/lib/payments";

// Signature verification needs the exact raw bytes Stripe signed — must run
// on the Node runtime (not Edge) so we can read the body as raw text before
// any JSON parsing happens.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const result = await stripeProvider.verifyWebhook(rawBody, req.headers);

  if (!result.valid) {
    // Never process an unverified webhook — this is the #1 way payment
    // systems get exploited (a forged "payment succeeded" call).
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (result.eventType === "payment.succeeded" && result.providerRef) {
    await fulfillOrder(result.providerRef, "stripe");
  }

  if (result.eventType === "payment.failed" && result.providerRef) {
    await markOrderFailed(result.providerRef);
  }

  // Always 200 once verified, even for event types we don't act on —
  // Stripe retries aggressively on non-2xx responses.
  return NextResponse.json({ received: true });
}
