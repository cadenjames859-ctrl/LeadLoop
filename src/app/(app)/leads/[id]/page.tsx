import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getLeadForUser } from "@/lib/leads-data";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { LeadStatusBadge } from "@/components/app/LeadStatusBadge";
import { LeadActions } from "@/components/app/LeadActions";
import { GenerateFollowUpButton } from "@/components/app/GenerateFollowUpButton";
import { FollowUpHistory } from "@/components/app/FollowUpHistory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IconPhone, IconMail, IconArrowRight } from "@/components/ui/icons";

export default async function LeadDetailPage({ params }: PageProps<"/leads/[id]">) {
  const { id } = await params;
  const session = await auth();
  const lead = await getLeadForUser(session!.user.id, id);

  if (!lead) notFound();

  return (
    <div>
      <Link
        href="/leads"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <IconArrowRight className="h-3.5 w-3.5 rotate-180" />
        Back to leads
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
              {lead.customerName}
            </h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">{lead.service}</p>
        </div>
      </div>

      <div className="mb-6">
        <LeadActions leadId={lead.id} status={lead.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 text-sm">
              <div className="space-y-2">
                {lead.phone ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <IconPhone className="h-4 w-4 text-ink-faint" />
                    <a href={`tel:${lead.phone}`} className="hover:text-primary">
                      {lead.phone}
                    </a>
                  </div>
                ) : null}
                {lead.email ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <IconMail className="h-4 w-4 text-ink-faint" />
                    <a href={`mailto:${lead.email}`} className="hover:text-primary">
                      {lead.email}
                    </a>
                  </div>
                ) : null}
                {!lead.phone && !lead.email ? (
                  <p className="text-ink-faint">No contact info on file.</p>
                ) : null}
              </div>

              <dl className="grid grid-cols-2 gap-y-3 border-t border-line-soft pt-4">
                <dt className="text-ink-faint">Estimated value</dt>
                <dd className="text-right font-medium text-ink">
                  {formatCurrency(Number(lead.estimatedValue))}
                </dd>
                <dt className="text-ink-faint">Created</dt>
                <dd className="text-right text-ink-soft">{formatDate(lead.createdAt)}</dd>
                <dt className="text-ink-faint">Last contacted</dt>
                <dd className="text-right text-ink-soft">{formatDate(lead.lastContactedAt)}</dd>
                <dt className="text-ink-faint">Next follow-up</dt>
                <dd className="text-right text-ink-soft">{formatDate(lead.nextFollowUpAt)}</dd>
              </dl>

              <div className="border-t border-line-soft pt-4">
                <p className="mb-1.5 text-ink-faint">Notes</p>
                <p className="whitespace-pre-wrap text-ink">
                  {lead.notes || <span className="text-ink-faint">No notes yet.</span>}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up History</CardTitle>
              <GenerateFollowUpButton leadId={lead.id} />
            </CardHeader>
            <CardBody>
              <FollowUpHistory followUps={lead.followUps} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
