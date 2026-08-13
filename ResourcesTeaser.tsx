"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-hairline bg-white p-8 text-center">
        <CheckCircle2 size={28} className="text-verified" />
        <p className="font-display text-lg font-semibold text-ink">Check your email</p>
        <p className="max-w-xs font-body text-sm text-slate">
          We sent a sign-in link to <span className="text-ink">{email}</span>. It expires in 15
          minutes.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-sm border border-hairline bg-white p-8"
    >
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-wide text-slate">Email</span>
        <div className="mt-1.5 flex items-center gap-2 rounded-sm border border-hairline px-3 py-2.5 focus-within:border-ink">
          <Mail size={15} className="text-slate-dim" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent font-body text-sm text-ink outline-none"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3 font-mono text-xs font-medium uppercase tracking-wide text-paper transition-colors hover:bg-ink-light disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Sending link&hellip;
          </>
        ) : (
          "Send sign-in link"
        )}
      </button>

      {errorMsg && <p className="font-mono text-xs text-flag">{errorMsg}</p>}

      <p className="font-mono text-[11px] text-slate-dim">
        No password needed. If you've paid for an audit before, use the same email to see it here.
      </p>
    </form>
  );
}
