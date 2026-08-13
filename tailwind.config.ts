"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanSearch, FileStack, ListChecks, PenLine, CheckCircle2, ArrowRight } from "lucide-react";
import FileDropzone from "./FileDropzone";
import DiscrepancyDashboard from "./DiscrepancyDashboard";
import { runMockAudit, buildDisputeLetter } from "@/lib/mock-audit";
import { AuditResult, AuditStage } from "@/lib/types";

const STAGE_META: { key: AuditStage; label: string; icon: typeof ScanSearch }[] = [
  { key: "uploading", label: "Uploading documents", icon: FileStack },
  { key: "extracting", label: "Extracting line items & CPT codes", icon: ScanSearch },
  { key: "cross-checking", label: "Cross-checking bill against EOB", icon: ListChecks },
  { key: "drafting", label: "Drafting dispute letter", icon: PenLine },
];

export default function AuditTool() {
  const router = useRouter();
  const [billFile, setBillFile] = useState<File | null>(null);
  const [eobFile, setEobFile] = useState<File | null>(null);
  const [stage, setStage] = useState<AuditStage>("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const canRunAudit = billFile && eobFile && stage === "idle";

  const runAudit = async () => {
    if (!billFile || !eobFile) return;

    for (const step of STAGE_META) {
      setStage(step.key);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 850));
    }

    const auditResult = await runMockAudit(billFile.name, eobFile.name);
    const letter = buildDisputeLetter(auditResult);
    setResult(auditResult);
    setStage("done");

    // Persist immediately so the paywall on the next page is backed by a
    // real database record rather than component state that disappears on
    // refresh.
    setIsSaving(true);
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: auditResult, letter }),
      });
      const data = await res.json();
      if (!res.ok || !data?.id) throw new Error(data?.error || "Failed to save audit.");
      setAuditId(data.id);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save audit.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setBillFile(null);
    setEobFile(null);
    setStage("idle");
    setResult(null);
    setAuditId(null);
    setSaveError(null);
  };

  return (
    <section id="audit-tool" className="border-b border-hairline bg-paper-dim/60">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Step 1 of 2</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Upload your bill and EOB
          </h2>
          <p className="mt-3 font-body text-base leading-relaxed text-slate">
            We compare the two documents automatically — you don&apos;t need to
            know your CPT codes or read the fine print yourself.
          </p>
        </div>

        {stage === "idle" && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <FileDropzone
              label="Itemized medical bill"
              hint="Drop your provider's itemized statement here"
              file={billFile}
              onFileSelected={setBillFile}
              accent="flag"
            />
            <FileDropzone
              label="Insurance EOB"
              hint="Drop your Explanation of Benefits here"
              file={eobFile}
              onFileSelected={setEobFile}
              accent="verified"
            />
          </div>
        )}

        {stage === "idle" && (
          <button
            onClick={runAudit}
            disabled={!canRunAudit}
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 font-mono text-sm font-medium uppercase tracking-wide text-paper transition-colors hover:bg-ink-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ScanSearch size={16} />
            Run free audit
          </button>
        )}

        {stage !== "idle" && stage !== "done" && (
          <ProcessingPanel stage={stage} />
        )}

        {stage === "done" && result && (
          <div className="mt-8">
            <DiscrepancyDashboard result={result} />

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => auditId && router.push(`/audits/${auditId}`)}
                disabled={!auditId || isSaving}
                className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 font-mono text-sm font-medium uppercase tracking-wide text-paper transition-colors hover:bg-ink-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving audit…" : "View dispute letter"}
                {!isSaving && <ArrowRight size={15} />}
              </button>
              {saveError && (
                <span className="font-mono text-xs text-flag">{saveError}</span>
              )}
            </div>
          </div>
        )}

        {stage === "done" && (
          <button
            onClick={handleReset}
            className="mt-6 font-mono text-xs uppercase tracking-wide text-slate underline decoration-hairline underline-offset-4 hover:text-ink"
          >
            Start a new audit
          </button>
        )}
      </div>
    </section>
  );
}

function ProcessingPanel({ stage }: { stage: AuditStage }) {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => clearInterval(id);
  }, []);

  const activeIndex = STAGE_META.findIndex((s) => s.key === stage);

  return (
    <div className="mt-8 max-w-md rounded-sm border border-hairline bg-white p-6">
      <p className="eyebrow">Processing{dots}</p>
      <ul className="mt-4 space-y-3">
        {STAGE_META.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isActive = idx === activeIndex;
          const Icon = step.icon;
          return (
            <li key={step.key} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                  isDone
                    ? "border-verified bg-verified text-white"
                    : isActive
                    ? "border-ink bg-ink text-white"
                    : "border-hairline text-slate-dim"
                }`}
              >
                {isDone ? <CheckCircle2 size={14} /> : <Icon size={13} />}
              </span>
              <span
                className={`font-body text-sm ${
                  isDone || isActive ? "text-ink" : "text-slate-dim"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
