import {
  IconUsers,
  IconClock,
  IconSparkles,
  IconLayoutDashboard,
  IconSearch,
  IconCheckCircle,
} from "@/components/ui/icons";
import { Badge } from "@/components/ui/Badge";

const FEATURES = [
  {
    icon: IconUsers,
    title: "One place for every lead",
    body: "Customer name, contact info, service requested, estimated value, and notes — all in a single organized record.",
  },
  {
    icon: IconClock,
    title: "Follow-ups that don't get lost",
    body: "Set a next follow-up date per lead and see exactly who's due today, overdue, or coming up this week.",
  },
  {
    icon: IconSparkles,
    title: "Ready-to-send follow-up drafts",
    body: "Draft a personalized message from the customer's name, service, and history in one click. You review it and choose when to send it — nothing goes out on its own.",
    tier: "pro" as const,
  },
  {
    icon: IconLayoutDashboard,
    title: "A dashboard that means something",
    body: "Real numbers pulled straight from your data: total leads, follow-ups due, booked jobs, and estimated pipeline value.",
  },
  {
    icon: IconSearch,
    title: "Find anyone in seconds",
    body: "Search, filter by status, and sort your lead list so the right customer is never more than a few clicks away.",
  },
  {
    icon: IconCheckCircle,
    title: "Built for how you actually work",
    body: "Mark leads Contacted, Booked, or Lost as things happen — your pipeline always reflects reality.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Features</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Everything you need to stop losing leads. Nothing you don&rsquo;t.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                {f.tier === "pro" ? (
                  <Badge className="bg-amber-tint text-amber-strong ring-amber-strong/20">Pro</Badge>
                ) : null}
              </div>
              <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
