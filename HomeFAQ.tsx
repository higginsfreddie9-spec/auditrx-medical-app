"use client";

import { Lock, Download, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface DisputeLetterPreviewProps {
  letter: string;
  unlocked: boolean;
  onUnlockRequest: () => void;
}

export default function DisputeLetterPreview({
  letter,
  unlocked,
  onUnlockRequest,
}: DisputeLetterPreviewProps) {
  const [copied, setCopied] = useState(false);
  const previewLines = letter
    ? letter.split("\n").slice(0, 6).join("\n")
    : "Dear Billing Department,\n\nI am formally disputing charges on my account\nafter comparing my itemized statement against\nmy insurance EOB. I identified discrepancies\ntotaling [amount] in charges that do not match...";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dispute-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-up rounded-sm border border-hairline bg-white p-6">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <p className="eyebrow">Generated document</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            Your dispute letter
          </h3>
        </div>
        {unlocked ? (
          <span className="verified-tag">
            <CheckCircle2 size={13} /> Unlocked
          </span>
        ) : (
          <span className="flag-tag">
            <Lock size={12} /> Locked
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <pre
          className={`whitespace-pre-wrap rounded-sm bg-paper-dim p-5 font-mono text-[13px] leading-relaxed text-ink ${
            unlocked ? "" : "max-h-64 overflow-hidden"
          }`}
        >
          {unlocked ? letter : previewLines}
        </pre>

        {!unlocked && (
          <div className="absolute inset-x-0 bottom-0 flex h-40 flex-col items-center justify-end gap-3 bg-gradient-to-t from-white via-white/95 to-transparent pb-2">
            <p className="max-w-xs text-center font-body text-sm text-slate">
              The full letter — formatted, citation-ready, and personalized to
              your account — unlocks with a one-time review fee.
            </p>
            <button
              onClick={onUnlockRequest}
              className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wide text-paper transition-colors hover:bg-ink-light"
            >
              <Lock size={13} />
              Unlock full letter — $49
            </button>
          </div>
        )}
      </div>

      {unlocked && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-sm border border-ink px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <Download size={13} /> Download .txt
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-sm border border-hairline px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-colors hover:border-ink"
          >
            <Copy size={13} /> {copied ? "Copied!" : "Copy text"}
          </button>
        </div>
      )}
    </div>
  );
}
