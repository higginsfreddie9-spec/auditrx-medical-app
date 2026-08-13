import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink text-paper/80">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <span className="font-display text-lg font-semibold text-paper">
              AuditRx AI
            </span>
            <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-paper/60">
              We compare your itemized bill against your EOB line by line,
              flag CPT code mismatches and overcharges, and draft the dispute
              letter so you don&apos;t have to fight the billing department
              alone.
            </p>
          </div>

          <div>
            <p className="eyebrow text-paper/50">Billing guides</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-paper/70">
              <li>
                <Link href="/resources" className="hover:text-paper">
                  All guides
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/how-to-dispute-a-medical-bill"
                  className="hover:text-paper"
                >
                  How to dispute a medical bill
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/surprise-billing-dispute-letter"
                  className="hover:text-paper"
                >
                  Surprise billing dispute letters
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-paper/50">Legal</p>
            <p className="mt-3 font-body text-sm leading-relaxed text-paper/60">
              AuditRx AI is a document-review tool, not a law firm, and does
              not provide legal, medical, or billing advice. Review any
              generated letter before sending it.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-paper/10 pt-6 font-mono text-xs text-paper/40 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} AuditRx AI. All rights reserved.</span>
          <span>Every bill is a claim. Every claim can be checked.</span>
        </div>
      </div>
    </footer>
  );
}
