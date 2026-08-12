import { IconChevronDown } from "@/components/ui/icons";

const FAQS = [
  {
    q: "Who is LeadLoop for?",
    a: "Small, local service businesses — detailers, contractors, landscapers, cleaners, and similar trades — that get inbound inquiries by phone, text, or a contact form and need a simple way to track them through to a booked job.",
  },
  {
    q: "Do I need to connect an AI provider to use follow-up messages?",
    a: "No. LeadLoop generates follow-up messages out of the box using built-in demo logic based on the customer's name, service, and lead status. Connecting a real AI provider later is a drop-in configuration change.",
  },
  {
    q: "Does LeadLoop send texts or emails automatically?",
    a: "Not yet. LeadLoop drafts the message for you and lets you copy it — you choose when and how to send it. Automatic sending is on the roadmap.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Every lead is scoped to your account — other LeadLoop users can never see or query your leads.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, there's no contract. Start on the free plan and upgrade only when you need more room.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-line-soft bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-line-soft">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-ink marker:content-none">
                {item.q}
                <IconChevronDown className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
