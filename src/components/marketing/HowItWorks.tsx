const STEPS = [
  {
    step: "01",
    title: "Capture the lead",
    body: "Log every inquiry the moment it comes in — name, service, estimated value, and any notes — before it gets buried in a text thread.",
  },
  {
    step: "02",
    title: "Set a follow-up date",
    body: "Tell LeadLoop when to remind you. No more guessing who you were supposed to call back this week.",
  },
  {
    step: "03",
    title: "Check your dashboard",
    body: "LeadLoop sorts every lead by what's due today, overdue, or coming up next — so one glance tells you exactly who to reach out to.",
  },
  {
    step: "04",
    title: "Turn it into a booking",
    body: "Draft a personalized follow-up message in one click, copy it, and send it yourself however you normally reach customers. Mark the lead Booked when it closes.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line-soft bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Four steps between an inquiry and a booked job.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.step} className="relative">
              <span className="font-display text-3xl font-medium text-primary/25">{s.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
