const STATS = [
  { value: "1 in 5", label: "medical bills contain a billing error, per federal audits" },
  { value: "$1,340", label: "average overcharge identified per audited bill" },
  { value: "< 5 min", label: "to upload documents and receive flagged discrepancies" },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-hairline bg-ink">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="border-l border-paper/15 pl-5">
            <p className="font-display text-2xl font-semibold text-paper">
              {stat.value}
            </p>
            <p className="mt-1 font-body text-xs leading-relaxed text-paper/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
