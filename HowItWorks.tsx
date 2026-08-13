import Link from "next/link";
import { FileSearch, User } from "lucide-react";
import { getSession } from "@/lib/auth/session";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink bg-ink text-paper">
            <FileSearch size={16} strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            AuditRx <span className="text-flag">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#audit-tool"
            className="font-body text-sm text-slate transition-colors hover:text-ink"
          >
            Run an audit
          </Link>
          <Link
            href="/#how-it-works"
            className="font-body text-sm text-slate transition-colors hover:text-ink"
          >
            How it works
          </Link>
          <Link
            href="/resources"
            className="font-body text-sm text-slate transition-colors hover:text-ink"
          >
            Billing guides
          </Link>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="flex items-center gap-1.5 font-body text-sm text-slate transition-colors hover:text-ink"
          >
            <User size={14} />
            {session ? "Dashboard" : "Sign in"}
          </Link>
        </nav>

        <Link
          href="/#audit-tool"
          className="rounded-sm border border-ink bg-ink px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide text-paper transition-colors hover:bg-ink-light"
        >
          Audit my bill
        </Link>
      </div>
    </header>
  );
}
