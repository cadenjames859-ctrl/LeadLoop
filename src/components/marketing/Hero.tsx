import { ButtonLink } from "@/components/ui/Button";
import { LoopDiagram } from "@/components/marketing/LoopDiagram";
import { IconArrowRight } from "@/components/ui/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-28">
        <div className="animate-fade-up">
          <p className="inline-flex items-center rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Built for small service businesses
          </p>
          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Never lose a potential customer again.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            LeadLoop helps small businesses organize leads, remember follow-ups, and turn
            more inquiries into paying customers — no more sticky notes, no more trying to
            remember who you were supposed to call back.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg">
              Get started free
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              See how it works
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-ink-faint">No credit card required. Set up in under 2 minutes.</p>
        </div>

        <div
          className="animate-fade-up rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_20px_50px_-25px_rgba(15,84,73,0.35)] sm:p-8"
          style={{ animationDelay: "120ms" }}
        >
          <LoopDiagram />
        </div>
      </div>
    </section>
  );
}
