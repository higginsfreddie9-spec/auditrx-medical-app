import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function ResourcesTeaser() {
  const featured = BLOG_POSTS.slice(0, 3);

  return (
    <section className="border-b border-hairline bg-paper-dim/60">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Billing guides</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Learn the process before you need it
            </h2>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink hover:text-flag"
          >
            All guides <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/${post.slug}`}
              className="group flex flex-col rounded-sm border border-hairline bg-white p-5 hover:border-ink"
            >
              <p className="eyebrow text-slate-dim">{post.category}</p>
              <h3 className="mt-2 font-display text-base font-semibold text-ink group-hover:text-flag">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-slate">
                {post.dek}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-slate-dim">
                {post.readingTimeMinutes} min read
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
