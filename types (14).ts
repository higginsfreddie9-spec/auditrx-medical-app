import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BLOG_POSTS, getAllSlugs, getBlogPost } from "@/lib/blog-data";

const SITE_URL = "https://auditrx.ai";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: `/resources/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      url: `/resources/${post.slug}`,
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
    author: {
      "@type": "Organization",
      name: "AuditRx AI",
    },
    publisher: {
      "@type": "Organization",
      name: "AuditRx AI",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/resources/${post.slug}`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Billing guides",
        item: `${SITE_URL}/resources`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/resources/${post.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Link
        href="/resources"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-slate hover:text-ink"
      >
        <ArrowLeft size={13} /> All billing guides
      </Link>

      <p className="eyebrow mt-6">{post.category}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 font-body text-lg leading-relaxed text-slate">
        {post.dek}
      </p>
      <p className="mt-3 font-mono text-[11px] text-slate-dim">
        Updated{" "}
        {new Date(post.updatedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        · {post.readingTimeMinutes} min read
      </p>

      <div className="mt-10 space-y-9 border-t border-hairline pt-10">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold text-ink">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {section.body.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-[15px] leading-relaxed text-slate"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-sm border border-hairline bg-paper-dim p-6">
        <p className="eyebrow">Frequently asked</p>
        <div className="mt-4 space-y-5">
          {post.faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-display text-base font-semibold text-ink">
                {faq.question}
              </h3>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-slate">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start gap-3 rounded-sm border border-ink bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">
            Skip the manual comparison
          </p>
          <p className="mt-1 max-w-sm font-body text-sm text-paper/70">
            Upload your bill and EOB and let AuditRx AI find the discrepancies
            for you.
          </p>
        </div>
        <Link
          href="/#audit-tool"
          className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-flag px-5 py-3 font-mono text-xs font-medium uppercase tracking-wide text-white hover:bg-flag-light"
        >
          Run a free audit <ArrowRight size={14} />
        </Link>
      </div>

      {otherPosts.length > 0 && (
        <div className="mt-14">
          <p className="eyebrow">Related guides</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/resources/${p.slug}`}
                className="group rounded-sm border border-hairline bg-white p-4 hover:border-ink"
              >
                <p className="font-display text-sm font-semibold text-ink group-hover:text-flag">
                  {p.title}
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-dim">
                  {p.readingTimeMinutes} min read
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
