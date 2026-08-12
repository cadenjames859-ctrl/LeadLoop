import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "default" | "primary" | "amber" | "danger";
  hint?: string;
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-line-soft text-ink-soft",
    primary: "bg-primary-tint text-primary",
    amber: "bg-amber-tint text-amber-strong",
    danger: "bg-danger-tint text-danger",
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-soft">{label}</p>
          <p className="mt-2 font-display text-3xl font-medium text-ink tabular-nums">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-ink-faint">{hint}</p> : null}
        </div>
        {icon ? (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", toneClasses[tone])}>
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
