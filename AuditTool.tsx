import { UploadCloud, ScanSearch, MailCheck } from "lucide-react";

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload both documents",
    body: "Drop in your itemized medical bill and your insurer's Explanation of Benefits (EOB). Both PDFs and photos work.",
  },
  {
    icon: ScanSearch,
    title: "AI cross-checks every line",
    body: "We extract each CPT code and charge, then match it against what your insurer actually approved, denied, or paid.",
  },
  {
    icon: MailCheck,
    title: "Get a ready-to-send letter",
    body: "Review flagged overcharges and download a formatted dispute letter addressed to your provider's billing department.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Three steps between you and a corrected bill
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative border-t border-ink pt-5">
                <span className="font-mono text-xs text-slate-dim">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <Icon size={22} className="mt-3 text-flag" />
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-slate">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
