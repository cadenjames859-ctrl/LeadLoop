"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { leadSchema } from "@/lib/validation";
import {
  createLeadForUser,
  updateLeadForUser,
  setLeadStatusForUser,
  deleteLeadForUser,
} from "@/lib/leads-data";
import { generateFollowUpMessage } from "@/lib/ai/followUp";
import { prisma } from "@/lib/prisma";
import { ACTIVE_LEAD_STATUSES } from "@/lib/leadStatus";
import { FREE_PLAN_ACTIVE_LEAD_LIMIT } from "@/lib/plan";
import type { LeadStatus } from "@/generated/prisma/enums";

export type GenerateFollowUpResult =
  | { ok: true; message: string; source: "mock" | "ai"; followUpId: string }
  | { ok: false; reason: "not_found" | "upgrade_required"; message: string };

export interface LeadFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
}

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

function parseLeadForm(formData: FormData) {
  const raw = {
    customerName: String(formData.get("customerName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    service: String(formData.get("service") ?? ""),
    estimatedValue: String(formData.get("estimatedValue") ?? "0"),
    notes: String(formData.get("notes") ?? ""),
    status: String(formData.get("status") ?? "NEW"),
    nextFollowUpAt: String(formData.get("nextFollowUpAt") ?? ""),
  };

  const parsed = leadSchema.safeParse(raw);
  return { raw, parsed };
}

export async function createLeadAction(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const userId = await requireUserId();
  const { raw, parsed } = parseLeadForm(formData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors, values: raw };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.plan === "FREE") {
    const activeLeadCount = await prisma.lead.count({
      where: { userId, status: { in: ACTIVE_LEAD_STATUSES } },
    });
    if (activeLeadCount >= FREE_PLAN_ACTIVE_LEAD_LIMIT) {
      return {
        error: `You've reached the Free plan's ${FREE_PLAN_ACTIVE_LEAD_LIMIT}-active-lead limit. Upgrade to Pro in Settings for unlimited leads.`,
        values: raw,
      };
    }
  }

  const lead = await createLeadForUser(userId, parsed.data);
  revalidatePath("/dashboard");
  revalidatePath("/leads");
  redirect(`/leads/${lead.id}`);
}

export async function updateLeadAction(
  leadId: string,
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const userId = await requireUserId();
  const { raw, parsed } = parseLeadForm(formData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors, values: raw };
  }

  const updated = await updateLeadForUser(userId, leadId, parsed.data);
  if (!updated) {
    return { error: "Lead not found." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  redirect(`/leads/${leadId}`);
}

export async function setLeadStatusAction(leadId: string, status: LeadStatus) {
  const userId = await requireUserId();
  const markContacted = status === "CONTACTED";
  const updated = await setLeadStatusForUser(userId, leadId, status, { markContacted });
  if (!updated) {
    throw new Error("Lead not found.");
  }

  if (status === "BOOKED" || status === "LOST") {
    await prisma.followUp.create({
      data: {
        leadId,
        type: "STATUS_CHANGE",
        message: `Status changed to ${status === "BOOKED" ? "Booked" : "Lost"}.`,
        sentAt: new Date(),
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/leads");
  revalidatePath("/follow-ups");
  revalidatePath(`/leads/${leadId}`);
}

export async function markContactedAction(leadId: string) {
  const userId = await requireUserId();
  const existing = await prisma.lead.findFirst({ where: { id: leadId, userId } });
  if (!existing) throw new Error("Lead not found.");

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      lastContactedAt: new Date(),
      status: existing.status === "NEW" ? "CONTACTED" : existing.status,
    },
  });

  await prisma.followUp.create({
    data: {
      leadId,
      type: "STATUS_CHANGE",
      message: "Marked as contacted.",
      sentAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/leads");
  revalidatePath("/follow-ups");
  revalidatePath(`/leads/${leadId}`);
}

export async function deleteLeadAction(leadId: string) {
  const userId = await requireUserId();
  const deleted = await deleteLeadForUser(userId, leadId);
  if (!deleted) {
    throw new Error("Lead not found.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/leads");
  revalidatePath("/follow-ups");
  redirect("/leads");
}

export async function generateFollowUpAction(leadId: string): Promise<GenerateFollowUpResult> {
  const userId = await requireUserId();

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.plan === "FREE") {
    return {
      ok: false,
      reason: "upgrade_required",
      message: "Follow-up message drafts are a Pro feature. Upgrade in Settings to generate them.",
    };
  }

  const lead = await prisma.lead.findFirst({ where: { id: leadId, userId } });
  if (!lead) {
    return { ok: false, reason: "not_found", message: "Lead not found." };
  }

  const { message, source } = await generateFollowUpMessage({
    customerName: lead.customerName,
    service: lead.service,
    estimatedValue: Number(lead.estimatedValue),
    notes: lead.notes,
    status: lead.status,
    lastContactedAt: lead.lastContactedAt,
  });

  const followUp = await prisma.followUp.create({
    data: {
      leadId,
      type: "GENERATED_MESSAGE",
      message,
    },
  });

  revalidatePath(`/leads/${leadId}`);

  return { ok: true, message, source, followUpId: followUp.id };
}
