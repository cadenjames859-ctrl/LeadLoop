import { auth } from "@/lib/auth";
import { getFollowUpBuckets } from "@/lib/leads-data";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { LeadListItem } from "@/components/app/LeadListItem";
import { Badge } from "@/components/ui/Badge";

export default async function FollowUpsPage() {
  const session = await auth();
  const { overdue, dueToday, upcoming } = await getFollowUpBuckets(session!.user.id);

  return (
    <div>
      <PageHeader
        title="Follow-Ups"
        subtitle="Every lead waiting on a next touch, organized by urgency."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
            <Badge className="bg-danger-tint text-danger ring-danger/20">{overdue.length}</Badge>
          </CardHeader>
          <CardBody className="px-2">
            {overdue.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-faint">Nothing overdue. Nice work.</p>
            ) : (
              <div className="space-y-0.5">
                {overdue.map((lead) => (
                  <LeadListItem key={lead.id} lead={lead} dateLabel="Was due" dateValue={lead.nextFollowUpAt} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Due Today</CardTitle>
            <Badge className="bg-amber-tint text-amber-strong ring-amber-strong/20">{dueToday.length}</Badge>
          </CardHeader>
          <CardBody className="px-2">
            {dueToday.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-faint">Nothing due today.</p>
            ) : (
              <div className="space-y-0.5">
                {dueToday.map((lead) => (
                  <LeadListItem key={lead.id} lead={lead} dateLabel="Due" dateValue={lead.nextFollowUpAt} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <Badge className="bg-primary-tint text-primary ring-primary/20">{upcoming.length}</Badge>
          </CardHeader>
          <CardBody className="px-2">
            {upcoming.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-faint">No upcoming follow-ups scheduled.</p>
            ) : (
              <div className="space-y-0.5">
                {upcoming.map((lead) => (
                  <LeadListItem key={lead.id} lead={lead} dateLabel="Due" dateValue={lead.nextFollowUpAt} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
