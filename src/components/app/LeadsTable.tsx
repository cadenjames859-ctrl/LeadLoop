import Link from "next/link";
import type { Lead } from "@/generated/prisma/client";
import { LeadStatusBadge } from "@/components/app/LeadStatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-ink">No leads match your filters</p>
        <p className="mt-1 text-sm text-ink-faint">Try a different search or add a new lead.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-line bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-line-soft text-xs font-medium uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3 text-right">Est. Value</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Next Follow-Up</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line-soft last:border-0 hover:bg-line-soft/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/leads/${lead.id}`} className="font-medium text-ink hover:text-primary">
                      {lead.customerName}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">
                    <div className="max-w-[180px] truncate">{lead.phone || lead.email || "—"}</div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">
                    <div className="max-w-[160px] truncate">{lead.service}</div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-ink tabular-nums">
                    {formatCurrency(Number(lead.estimatedValue))}
                  </td>
                  <td className="px-5 py-3.5">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">{formatDate(lead.createdAt)}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{formatDate(lead.nextFollowUpAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {leads.map((lead) => (
          <Link
            key={lead.id}
            href={`/leads/${lead.id}`}
            className="block rounded-[var(--radius-card)] border border-line bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{lead.customerName}</p>
                <p className="truncate text-sm text-ink-faint">{lead.service}</p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-ink-soft">{formatDate(lead.nextFollowUpAt) === "—" ? "No follow-up set" : `Follow up ${formatDate(lead.nextFollowUpAt)}`}</span>
              <span className="font-medium text-ink tabular-nums">
                {formatCurrency(Number(lead.estimatedValue))}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
