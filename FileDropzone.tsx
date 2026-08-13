import { AuditResult, DISCREPANCY_LABELS } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export default function DiscrepancyDashboard({ result }: { result: AuditResult }) {
  return (
    <div className="animate-fade-up rounded-sm border border-hairline bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <p className="eyebrow">{result.providerName}</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            Audit results — {result.statementDate}
          </h3>
        </div>
        <span className="flag-tag text-sm">
          <AlertTriangle size={13} />
          {result.discrepancies.length} discrepancies found
        </span>
      </div>

      <div className="mt-2">
        {result.discrepancies.map((d) => (
          <div key={d.id} className="ledger-row items-start">
            <div>
              <p className="font-body text-sm text-ink">{d.description}</p>
              <p className="mt-0.5 text-[11px] text-slate-dim">
                CPT {d.cptCode} · {DISCREPANCY_LABELS[d.type]}
              </p>
              <p className="mt-1.5 max-w-md font-body text-xs leading-relaxed text-slate">
                {d.explanation}
              </p>
            </div>
            <div className="text-right">
              <p className="billed-amount">{money(d.billedAmount)}</p>
              <p className="corrected-amount">{money(d.correctedAmount)}</p>
            </div>
            <span className="flag-tag whitespace-nowrap">
              {DISCREPANCY_LABELS[d.type]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-sm bg-paper-dim px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wide text-slate-dim">
            Billed total
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">
            {money(result.totalBilled)}
          </p>
        </div>
        <div className="rounded-sm bg-paper-dim px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wide text-slate-dim">
            Should be
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">
            {money(result.totalCorrected)}
          </p>
        </div>
        <div className="rounded-sm bg-verified-bg px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wide text-verified">
            You could save
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-verified">
            {money(result.potentialSavings)}
          </p>
        </div>
      </div>
    </div>
  );
}
