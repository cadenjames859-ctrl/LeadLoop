import type { LeadStatus } from "@/generated/prisma/enums";

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "BOOKED",
  "LOST",
];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  FOLLOW_UP: "Follow Up",
  BOOKED: "Booked",
  LOST: "Lost",
};

export const LEAD_STATUS_BADGE_CLASS: Record<LeadStatus, string> = {
  NEW: "bg-sky-50 text-sky-700 ring-sky-600/20",
  CONTACTED: "bg-violet-50 text-violet-700 ring-violet-600/20",
  INTERESTED: "bg-amber-50 text-amber-700 ring-amber-600/20",
  FOLLOW_UP: "bg-orange-50 text-orange-700 ring-orange-600/20",
  BOOKED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  LOST: "bg-slate-100 text-slate-500 ring-slate-500/20",
};

export const ACTIVE_LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
];
