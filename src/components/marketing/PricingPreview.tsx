import { ButtonLink } from "@/components/ui/Button";
import { IconCheckCircle } from "@/components/ui/icons";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    tagline: "For solo owners getting organized",
    features: [
      "Up to 50 active leads",
      "Basic follow-up reminders",
      "Lead notes & status tracking",
      "1 user",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    tagline: "For businesses ready to close more, faster",
    features: [
      "Unlimited leads",
      "Follow-up reminders",
      "Smart follow-up message drafts",
      "Priority support",
      "SMS & booking (coming soon)",
    ],
    highlighted: true,
  },
];

export function PricingPreview() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Simple pricing, no surprises.
          </h2>
          <p className="mt-4 text-ink-soft">Start free. Upgrade when you outgrow it.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[var(--radius-card)] border p-7 ${
                plan.highlighted
                  ? "border-primary bg-primary-dim text-white shadow-lg"
                  : "border-line bg-white text-ink"
              }`}
            >
              <p
                className={`text-sm font-semibold ${plan.highlighted ? "text-white/80" : "text-ink-soft"}`}
              >
                {plan.name}
              </p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-medium">{plan.price}</span>
                {plan.period ? (
                  <span className={plan.highlighted ? "text-white/70" : "text-ink-faint"}>
                    {plan.period}
                  </span>
                ) : null}
              </p>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/80" : "text-ink-soft"}`}>
                {plan.tagline}
              </p>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <IconCheckCircle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-white" : "text-primary"}`}
                    />
                    <span className={plan.highlighted ? "text-white/90" : "text-ink-soft"}>{f}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/signup"
                variant={plan.highlighted ? "secondary" : "primary"}
                className={`mt-7 w-full ${plan.highlighted ? "!bg-white !text-primary-dim hover:!bg-white/90" : ""}`}
              >
                Get started
              </ButtonLink>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-lg text-center text-xs text-ink-faint">
          &ldquo;Active leads&rdquo; means anything not yet marked Booked or Lost — closed-out
          leads don&rsquo;t count against your limit.
        </p>
      </div>
    </section>
  );
}
