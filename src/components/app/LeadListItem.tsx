import Link from "next/link";
import { LeadStatusBadge } from "@/components/app/LeadStatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Lead } from "@/generated/prisma/client";

export function LeadListItem({
  lead,
  dateLabel = "Next follow-up",
  dateValue,
}: {
  lead: Pick<Lead, "id" | "customerName" | "service" | "estimatedValue" | "status">;
  dateLabel?: string;
  dateValue?: Date | string | null;
}) {
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] px-3 py-3 transition-colors hover:bg-line-soft"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{lead.customerName}</p>
        <p className="truncate text-xs text-ink-faint">{lead.service}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {dateValue !== undefined ? (
          <div className="hidden text-right sm:block">
            <p className="text-xs text-ink-faint">{dateLabel}</p>
            <p className="text-xs font-medium text-ink-soft">{formatDate(dateValue)}</p>
          </div>
        ) : null}
        <p className="w-16 shrink-0 text-right text-sm font-medium text-ink tabular-nums">
          {formatCurrency(Number(lead.estimatedValue))}
        </p>
        <LeadStatusBadge status={lead.status} />
      </div>
    </Link>
  );
}
