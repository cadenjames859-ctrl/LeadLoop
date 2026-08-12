import type { LeadStatus } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/Badge";
import { LEAD_STATUS_LABEL, LEAD_STATUS_BADGE_CLASS } from "@/lib/leadStatus";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge className={LEAD_STATUS_BADGE_CLASS[status]}>{LEAD_STATUS_LABEL[status]}</Badge>;
}
