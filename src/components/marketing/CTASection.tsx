import { ButtonLink } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/icons";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] bg-primary-dim px-8 py-14 text-center sm:px-16 sm:py-16">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Stop losing leads to a full inbox.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Set up LeadLoop in a couple minutes and never wonder who you were supposed to
            follow up with again.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink
              href="/signup"
              size="lg"
              className="!bg-white !text-primary-dim hover:!bg-white/90"
            >
              Get started free
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
