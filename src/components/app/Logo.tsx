import { IconLoop } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
        <IconLoop className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="font-display text-lg font-medium tracking-tight text-ink">
        LeadLoop
      </span>
    </span>
  );
}
