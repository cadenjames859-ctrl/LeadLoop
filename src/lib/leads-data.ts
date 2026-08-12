import { prisma } from "@/lib/prisma";
import { ACTIVE_LEAD_STATUSES } from "@/lib/leadStatus";
import { startOfToday, endOfToday } from "@/lib/utils";
import type { LeadStatus } from "@/generated/prisma/enums";
import type { LeadInput } from "@/lib/validation";

export type LeadSortKey =
  | "createdAt_desc"
  | "createdAt_asc"
  | "nextFollowUpAt_asc"
  | "nextFollowUpAt_desc"
  | "estimatedValue_desc"
  | "estimatedValue_asc"
  | "customerName_asc";

export interface LeadListParams {
  search?: string;
  status?: LeadStatus | "ALL";
  sort?: LeadSortKey;
}

function sortToOrderBy(sort: LeadSortKey | undefined) {
  switch (sort) {
    case "createdAt_asc":
      return { createdAt: "asc" as const };
    case "nextFollowUpAt_asc":
      return { nextFollowUpAt: "asc" as const };
    case "nextFollowUpAt_desc":
      return { nextFollowUpAt: "desc" as const };
    case "estimatedValue_desc":
      return { estimatedValue: "desc" as const };
    case "estimatedValue_asc":
      return { estimatedValue: "asc" as const };
    case "customerName_asc":
      return { customerName: "asc" as const };
    case "createdAt_desc":
    default:
      return { createdAt: "desc" as const };
  }
}

export async function listLeadsForUser(userId: string, params: LeadListParams = {}) {
  const { search, status, sort } = params;

  const leads = await prisma.lead.findMany({
    where: {
      userId,
      ...(status && status !== "ALL" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { customerName: { contains: search, mode: "insensitive" } },
              { service: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: sortToOrderBy(sort),
  });

  return leads;
}

export async function getLeadForUser(userId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
    include: {
      followUps: { orderBy: { createdAt: "desc" } },
    },
  });
  return lead;
}

export async function createLeadForUser(userId: string, data: LeadInput) {
  return prisma.lead.create({
    data: {
      userId,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      service: data.service,
      estimatedValue: data.estimatedValue,
      notes: data.notes,
      status: data.status,
      nextFollowUpAt: data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null,
    },
  });
}

export async function updateLeadForUser(
  userId: string,
  leadId: string,
  data: Partial<LeadInput>
) {
  const existing = await prisma.lead.findFirst({ where: { id: leadId, userId } });
  if (!existing) return null;

  return prisma.lead.update({
    where: { id: leadId },
    data: {
      ...(data.customerName !== undefined ? { customerName: data.customerName } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.service !== undefined ? { service: data.service } : {}),
      ...(data.estimatedValue !== undefined ? { estimatedValue: data.estimatedValue } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.nextFollowUpAt !== undefined
        ? { nextFollowUpAt: data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null }
        : {}),
    },
  });
}

export async function setLeadStatusForUser(
  userId: string,
  leadId: string,
  status: LeadStatus,
  opts: { markContacted?: boolean } = {}
) {
  const existing = await prisma.lead.findFirst({ where: { id: leadId, userId } });
  if (!existing) return null;

  return prisma.lead.update({
    where: { id: leadId },
    data: {
      status,
      ...(opts.markContacted ? { lastContactedAt: new Date() } : {}),
    },
  });
}

export async function deleteLeadForUser(userId: string, leadId: string) {
  const existing = await prisma.lead.findFirst({ where: { id: leadId, userId } });
  if (!existing) return null;

  await prisma.lead.delete({ where: { id: leadId } });
  return existing;
}

export async function getDashboardData(userId: string) {
  const [totalLeads, newLeads, bookedLeads, lostLeads, activeLeadsForRevenue, recentLeads] =
    await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ where: { userId, status: "NEW" } }),
      prisma.lead.count({ where: { userId, status: "BOOKED" } }),
      prisma.lead.count({ where: { userId, status: "LOST" } }),
      prisma.lead.findMany({
        where: { userId, status: { in: ACTIVE_LEAD_STATUSES } },
        select: { estimatedValue: true },
      }),
      prisma.lead.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const followUpsDue = await prisma.lead.findMany({
    where: {
      userId,
      status: { notIn: ["BOOKED", "LOST"] },
      nextFollowUpAt: { lte: endOfToday() },
    },
    orderBy: { nextFollowUpAt: "asc" },
  });

  const estimatedPotentialRevenue = activeLeadsForRevenue.reduce(
    (sum, lead) => sum + Number(lead.estimatedValue),
    0
  );

  return {
    stats: {
      totalLeads,
      newLeads,
      followUpsDueCount: followUpsDue.length,
      bookedLeads,
      lostLeads,
      estimatedPotentialRevenue,
    },
    recentLeads,
    followUpsDueToday: followUpsDue,
  };
}

export async function getFollowUpBuckets(userId: string) {
  const leads = await prisma.lead.findMany({
    where: {
      userId,
      status: { notIn: ["BOOKED", "LOST"] },
      nextFollowUpAt: { not: null },
    },
    orderBy: { nextFollowUpAt: "asc" },
  });

  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  const overdue = leads.filter((l) => l.nextFollowUpAt! < todayStart);
  const dueToday = leads.filter(
    (l) => l.nextFollowUpAt! >= todayStart && l.nextFollowUpAt! <= todayEnd
  );
  const upcoming = leads.filter((l) => l.nextFollowUpAt! > todayEnd);

  return { overdue, dueToday, upcoming };
}
