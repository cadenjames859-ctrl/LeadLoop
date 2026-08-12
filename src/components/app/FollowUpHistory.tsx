import type { FollowUp } from "@/generated/prisma/client";
import { formatDateTime } from "@/lib/utils";
import { IconSparkles, IconClock } from "@/components/ui/icons";

const TYPE_LABEL: Record<string, string> = {
  GENERATED_MESSAGE: "Generated message",
  NOTE: "Note",
  STATUS_CHANGE: "Status update",
};

export function FollowUpHistory({ followUps }: { followUps: FollowUp[] }) {
  if (followUps.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-ink-faint">
        No follow-up activity yet. Generate a message or mark this lead contacted to start a history.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {followUps.map((f) => (
        <li key={f.id} className="flex gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
            {f.type === "GENERATED_MESSAGE" ? (
              <IconSparkles className="h-3.5 w-3.5" />
            ) : (
              <IconClock className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                {TYPE_LABEL[f.type] ?? f.type}
              </span>
              <span className="shrink-0 text-xs text-ink-faint">{formatDateTime(f.createdAt)}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{f.message}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
