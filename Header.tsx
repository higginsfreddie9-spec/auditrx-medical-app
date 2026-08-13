const HOME_FAQS = [
  {
    question: "How do I dispute a medical bill?",
    answer:
      "Request an itemized statement from your provider, compare it line by line against your insurance EOB, and send a written dispute letter listing any charges that don't match. AuditRx AI automates the comparison and drafts the letter for you.",
  },
  {
    question: "What's the difference between a medical bill and an EOB?",
    answer:
      "Your bill comes from your provider and states what you currently owe. Your EOB comes from your insurer and shows what was billed, approved, denied, and calculated as your responsibility. The two should match — when they don't, that's a discrepancy.",
  },
  {
    question: "Is it worth disputing a medical bill for a small amount?",
    answer:
      "Yes — errors on one line often indicate the same error elsewhere on the bill, and providers are required to correct confirmed mistakes regardless of size. A five-minute audit costs nothing to run.",
  },
  {
    question: "Does AuditRx AI file the dispute for me?",
    answer:
      "AuditRx AI generates a formatted dispute letter addressed to your provider's billing department, which you review, personalize, and send yourself — by mail, patient portal, or email — so you stay in control of your account.",
  },
];

export default function HomeFAQ() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="border-b border-hairline">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <p className="eyebrow">Questions</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Disputing a bill, answered plainly
        </h2>

        <div className="mt-8 divide-y divide-hairline border-t border-hairline">
          {HOME_FAQS.map((faq) => (
            <div key={faq.question} className="py-6">
              <h3 className="font-display text-lg font-semibold text-ink">
                {faq.question}
              </h3>
              <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-slate">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
