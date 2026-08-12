import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/leads-data";
import { StatCard } from "@/components/app/StatCard";
import { LeadListItem } from "@/components/app/LeadListItem";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import {
  IconUsers,
  IconUserPlus,
  IconClock,
  IconCheckCircle,
  IconXCircle,
  IconDollar,
  IconPlus,
} from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { stats, recentLeads, followUpsDueToday } = await getDashboardData(userId);

  const firstName = (session!.user.name ?? "there").split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Here&rsquo;s what&rsquo;s happening with your leads today.
          </p>
        </div>
        <ButtonLink href="/leads/new" size="md">
          <IconPlus className="h-4 w-4" />
          Add Lead
        </ButtonLink>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Leads" value={stats.totalLeads} icon={<IconUsers className="h-5 w-5" />} />
        <StatCard
          label="New Leads"
          value={stats.newLeads}
          icon={<IconUserPlus className="h-5 w-5" />}
          tone="primary"
        />
        <StatCard
          label="Follow-Ups Due"
          value={stats.followUpsDueCount}
          icon={<IconClock className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Booked Leads"
          value={stats.bookedLeads}
          icon={<IconCheckCircle className="h-5 w-5" />}
          tone="primary"
        />
        <StatCard
          label="Lost Leads"
          value={stats.lostLeads}
          icon={<IconXCircle className="h-5 w-5" />}
          tone="danger"
        />
        <StatCard
          label="Est. Potential Revenue"
          value={formatCurrency(stats.estimatedPotentialRevenue)}
          icon={<IconDollar className="h-5 w-5" />}
          tone="primary"
          hint="Active leads only"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Follow-Ups Due Today</CardTitle>
            <ButtonLink href="/follow-ups" variant="ghost" size="sm">
              View all
            </ButtonLink>
          </CardHeader>
          <CardBody className="px-2">
            {followUpsDueToday.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-faint">
                Nothing due today. You&rsquo;re all caught up.
              </p>
            ) : (
              <div className="space-y-0.5">
                {followUpsDueToday.slice(0, 6).map((lead) => (
                  <LeadListItem
                    key={lead.id}
                    lead={lead}
                    dateLabel="Follow up"
                    dateValue={lead.nextFollowUpAt}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <ButtonLink href="/leads" variant="ghost" size="sm">
              View all
            </ButtonLink>
          </CardHeader>
          <CardBody className="px-2">
            {recentLeads.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-ink-faint">
                No leads yet. Add your first one to get started.
              </p>
            ) : (
              <div className="space-y-0.5">
                {recentLeads.map((lead) => (
                  <LeadListItem
                    key={lead.id}
                    lead={lead}
                    dateLabel="Added"
                    dateValue={lead.createdAt}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
