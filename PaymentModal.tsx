"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import DiscrepancyDashboard from "./DiscrepancyDashboard";
import DisputeLetterPreview from "./DisputeLetterPreview";
import PaymentModal from "./PaymentModal";
import type { AuditResult } from "@/lib/types";

interface AuditDetailClientProps {
  auditId: string;
  initialResult: AuditResult;
  initialLetter: string | null;
  initialUnlocked: boolean;
  defaultEmail?: string;
}

export default function AuditDetailClient({
  auditId,
  initialResult,
  initialLetter,
  initialUnlocked,
  defaultEmail,
}: AuditDetailClientProps) {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const [letter, setLetter] = useState(initialLetter);
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(paymentStatus === "success" && !initialUnlocked);

  // Webhooks usually land within a second or two, but the browser gets
  // redirected back immediately — so if we land here with ?payment=success
  // and aren't unlocked yet, poll briefly rather than telling the user
  // their payment failed when it's actually just still processing.
  useEffect(() => {
    if (!isConfirming) return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      const res = await fetch(`/api/audits/${auditId}`);
      const data = await res.json();

      if (data.isUnlocked) {
        setIsUnlocked(true);
        setLetter(data.letterText);
        setIsConfirming(false);
        clearInterval(interval);
      } else if (attempts >= 10) {
        // ~20 seconds elapsed with no confirmation — stop polling and let
        // the user retry manually rather than spinning forever.
        setIsConfirming(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isConfirming, auditId]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <p className="eyebrow">Audit result</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
        {initialResult.providerName}
      </h1>

      {isConfirming && (
        <div className="mt-4 flex items-center gap-2 rounded-sm border border-hairline bg-white px-4 py-3 font-mono text-xs text-slate">
          <Loader2 size={14} className="animate-spin" />
          Confirming your payment&hellip; this usually takes a few seconds.
        </div>
      )}

      {paymentStatus === "cancelled" && !isUnlocked && (
        <p className="mt-4 font-mono text-xs text-flag">
          Checkout was cancelled — no charge was made.
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DiscrepancyDashboard result={initialResult} />
        <DisputeLetterPreview
          letter={letter || ""}
          unlocked={isUnlocked}
          onUnlockRequest={() => setIsPaymentOpen(true)}
        />
      </div>

      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        auditId={auditId}
        potentialSavings={initialResult.potentialSavings}
        defaultEmail={defaultEmail}
      />
    </div>
  );
}
