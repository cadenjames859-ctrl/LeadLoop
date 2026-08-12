const STATS = [
  { label: "Total Leads", value: "24" },
  { label: "Follow-Ups Due", value: "3" },
  { label: "Booked", value: "9" },
  { label: "Est. Revenue", value: "$4,850" },
];

const ROWS = [
  { name: "Alex Turner", service: "Kitchen backsplash quote", value: "$1,200", status: "Follow Up", tone: "amber" },
  { name: "Priya Nair", service: "Recurring lawn care", value: "$180", status: "Interested", tone: "gold" },
  { name: "Marcus Webb", service: "Deck staining", value: "$650", status: "Booked", tone: "green" },
];

const TONE_CLASS: Record<string, string> = {
  amber: "bg-amber-tint text-amber-strong ring-amber-strong/20",
  gold: "bg-[#fdf3d6] text-[#8a6a12] ring-[#8a6a12]/20",
  green: "bg-primary-tint text-primary ring-primary/20",
};

export function DashboardPreview() {
  return (
    <section className="border-t border-line-soft bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Your dashboard</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            See your whole pipeline at a glance.
          </h2>
          <p className="mt-4 text-ink-soft">
            A preview of what you&rsquo;ll see the moment you log in — illustrative data shown below.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-[1.25rem] border border-line bg-paper p-3 shadow-sm sm:p-5">
          <div className="rounded-[1rem] border border-line bg-white p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-[var(--radius-control)] bg-line-soft/70 p-3.5 sm:p-4">
                  <p className="text-xs text-ink-faint">{s.label}</p>
                  <p className="mt-1 font-display text-xl font-medium text-ink sm:text-2xl">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-1 border-t border-line-soft pt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
                Follow-ups due
              </p>
              {ROWS.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] px-2 py-2.5 sm:px-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{r.name}</p>
                    <p className="truncate text-xs text-ink-faint">{r.service}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium text-ink">{r.value}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASS[r.tone]}`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
