import { auth } from "@/lib/auth";
import { listLeadsForUser, type LeadSortKey } from "@/lib/leads-data";
import { PageHeader } from "@/components/app/PageHeader";
import { LeadsFilterBar } from "@/components/app/LeadsFilterBar";
import { LeadsTable } from "@/components/app/LeadsTable";
import { ButtonLink } from "@/components/ui/Button";
import { IconPlus } from "@/components/ui/icons";
import type { LeadStatus } from "@/generated/prisma/enums";

export default async function LeadsPage({ searchParams }: PageProps<"/leads">) {
  const sp = await searchParams;
  const session = await auth();

  const search = typeof sp.search === "string" ? sp.search : "";
  const status = typeof sp.status === "string" ? sp.status : "ALL";
  const sort = typeof sp.sort === "string" ? sp.sort : "createdAt_desc";

  const leads = await listLeadsForUser(session!.user.id, {
    search: search || undefined,
    status: status as LeadStatus | "ALL",
    sort: sort as LeadSortKey,
  });

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={`${leads.length} lead${leads.length === 1 ? "" : "s"}`}
        actions={
          <ButtonLink href="/leads/new">
            <IconPlus className="h-4 w-4" />
            Add Lead
          </ButtonLink>
        }
      />
      <div className="mb-5">
        <LeadsFilterBar initialSearch={search} initialStatus={status} initialSort={sort} />
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
