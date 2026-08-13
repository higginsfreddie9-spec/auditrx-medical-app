"use client";

import { useEffect, useState } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import type { PaymentProviderName } from "@/lib/payments/types";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  auditId: string;
  potentialSavings: number;
  defaultEmail?: string;
}

const PROVIDER_LABELS: Record<PaymentProviderName, string> = {
  paystack: "Card / M-Pesa (Paystack)",
  flutterwave: "Card / Mobile Money (Flutterwave)",
  stripe: "Card (Stripe)",
};

const CURRENCY_BY_PROVIDER: Partial<Record<PaymentProviderName, string>> = {
  paystack: "KES",
  flutterwave: "KES",
  stripe: "USD",
};

export default function PaymentModal({
  open,
  onClose,
  auditId,
  potentialSavings,
  defaultEmail = "",
}: PaymentModalProps) {
  const [providers, setProviders] = useState<PaymentProviderName[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderName | null>(null);
  const [email, setEmail] = useState(defaultEmail);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/checkout")
      .then((res) => res.json())
      .then((data) => {
        const names: PaymentProviderName[] = (data.providers || []).map(
          (p: { name: PaymentProviderName }) => p.name
        );
        setProviders(names);
        setSelectedProvider(names[0] ?? null);
      })
      .catch(() => setProviders([]));
  }, [open]);

  if (!open) return null;

  const handleCheckout = async () => {
    if (!selectedProvider) {
      setErrorMsg("No payment method is available right now.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Enter a valid email address for your receipt.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          provider: selectedProvider,
          currency: CURRENCY_BY_PROVIDER[selectedProvider] || "USD",
          email,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Checkout failed to start.");
      }

      window.location.href = data.url as string;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="w-full max-w-md rounded-sm border border-hairline bg-paper p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">One-time review fee</p>
            <h2 id="payment-modal-title" className="mt-1 font-display text-2xl font-semibold text-ink">
              Unlock your dispute letter
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-sm p-1 text-slate hover:bg-paper-dim hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 rounded-sm border border-hairline bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-ink">
              Full dispute letter + CPT audit report
            </span>
            <span className="font-display text-lg font-semibold text-ink">$49.00</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-verified">
            <ShieldCheck size={13} />
            Flagged{" "}
            {potentialSavings.toLocaleString("en-US", { style: "currency", currency: "USD" })} in
            disputable charges — often 10&times; the review fee.
          </div>
        </div>

        <label className="mt-4 block">
          <span className="font-mono text-[11px] uppercase tracking-wide text-slate">
            Email for receipt
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-sm border border-hairline bg-white px-3 py-2.5 font-body text-sm text-ink outline-none focus:border-ink"
          />
        </label>

        {providers.length > 1 && (
          <fieldset className="mt-4">
            <legend className="font-mono text-[11px] uppercase tracking-wide text-slate">
              Payment method
            </legend>
            <div className="mt-1.5 space-y-2">
              {providers.map((name) => (
                <label
                  key={name}
                  className={`flex cursor-pointer items-center justify-between rounded-sm border px-3 py-2.5 text-sm ${
                    selectedProvider === name
                      ? "border-ink bg-white"
                      : "border-hairline bg-white/60"
                  }`}
                >
                  <span className="font-body text-ink">{PROVIDER_LABELS[name]}</span>
                  <input
                    type="radio"
                    name="provider"
                    checked={selectedProvider === name}
                    onChange={() => setSelectedProvider(name)}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {providers.length === 0 && (
          <p className="mt-4 font-mono text-xs text-flag">
            No payment method is configured on the server yet.
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={isProcessing || !selectedProvider}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-flag px-5 py-3 font-mono text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-flag-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Redirecting to checkout&hellip;
            </>
          ) : (
            "Continue to payment"
          )}
        </button>

        {errorMsg && <p className="mt-2 text-center font-mono text-xs text-flag">{errorMsg}</p>}

        <p className="mt-3 text-center font-mono text-[11px] text-slate-dim">
          We&apos;ll email your receipt and save this audit to your account under this email.
        </p>
      </div>
    </div>
  );
}
