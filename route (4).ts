@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-paper text-ink font-body antialiased;
  }
  ::selection {
    @apply bg-flag/20 text-ink;
  }
  :focus-visible {
    outline: 2px solid #14213d;
    outline-offset: 2px;
  }
}

@layer components {
  /* A "line item" row styled like a photocopied bill, with a strike-through
     billed amount and a corrected amount, used as the signature visual. */
  .ledger-row {
    @apply grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-hairline/80 py-3 font-mono text-sm;
  }

  .billed-amount {
    @apply text-slate-dim line-through decoration-flag decoration-2;
  }

  .corrected-amount {
    @apply text-verified font-semibold;
  }

  .flag-tag {
    @apply inline-flex items-center gap-1.5 rounded-sm border border-flag/30 bg-flag-bg px-2 py-0.5 text-xs font-mono font-medium uppercase tracking-wide text-flag;
  }

  .verified-tag {
    @apply inline-flex items-center gap-1.5 rounded-sm border border-verified/30 bg-verified-bg px-2 py-0.5 text-xs font-mono font-medium uppercase tracking-wide text-verified;
  }

  .eyebrow {
    @apply font-mono text-xs uppercase tracking-[0.18em] text-slate;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
