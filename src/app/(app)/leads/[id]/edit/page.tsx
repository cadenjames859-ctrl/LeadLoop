import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLeadForUser } from "@/lib/leads-data";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { LeadForm } from "@/components/app/LeadForm";
import { updateLeadAction } from "@/lib/actions/leads";
import { toDateInputValue } from "@/lib/utils";

export default async function EditLeadPage({ params }: PageProps<"/leads/[id]/edit">) {
  const { id } = await params;
  const session = await auth();
  const lead = await getLeadForUser(session!.user.id, id);

  if (!lead) notFound();

  const boundAction = updateLeadAction.bind(null, lead.id);

  return (
    <div>
      <PageHeader title="Edit Lead" subtitle={`Update details for ${lead.customerName}.`} />
      <Card>
        <CardBody className="pt-5">
          <LeadForm
            action={boundAction}
            defaultValues={{
              customerName: lead.customerName,
              phone: lead.phone ?? "",
              email: lead.email ?? "",
              service: lead.service,
              estimatedValue: String(Number(lead.estimatedValue)),
              notes: lead.notes ?? "",
              status: lead.status,
              nextFollowUpAt: toDateInputValue(lead.nextFollowUpAt),
            }}
            submitLabel="Save Changes"
            submitPendingLabel="Saving…"
            cancelHref={`/leads/${lead.id}`}
          />
        </CardBody>
      </Card>
    </div>
  );
}
