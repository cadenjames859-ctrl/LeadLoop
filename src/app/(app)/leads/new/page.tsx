import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { LeadForm } from "@/components/app/LeadForm";
import { createLeadAction } from "@/lib/actions/leads";

export default function NewLeadPage() {
  return (
    <div>
      <PageHeader title="Add Lead" subtitle="Capture a new inquiry before it slips through the cracks." />
      <Card>
        <CardBody className="pt-5">
          <LeadForm
            action={createLeadAction}
            submitLabel="Add Lead"
            submitPendingLabel="Adding…"
            cancelHref="/leads"
          />
        </CardBody>
      </Card>
    </div>
  );
}
