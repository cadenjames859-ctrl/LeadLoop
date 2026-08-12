/**
 * PLACEHOLDER — swap in real testimonials/logos once you have customers.
 * Intentionally styled as a template (dashed borders, bracketed copy) so
 * it reads as "fill me in" rather than as a fabricated review.
 */
export function SocialProof() {
  return (
    <section className="border-t border-line-soft bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Trusted by small businesses
          </p>
          <p className="mt-3 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            [ Add a &ldquo;trusted by N businesses&rdquo; stat or logo row here ]
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[var(--radius-card)] border border-dashed border-line bg-paper p-6"
            >
              <div className="flex gap-0.5 text-amber-strong" aria-hidden>
                {"★★★★★"}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-faint italic">
                &ldquo;[Placeholder — drop in a real customer quote about how LeadLoop helped
                their business.]&rdquo;
              </p>
              <p className="mt-4 text-sm font-medium text-ink-faint">
                [Customer name], [Business name]
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
