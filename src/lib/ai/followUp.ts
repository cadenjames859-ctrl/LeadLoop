/**
 * Follow-up message generation — integration point.
 *
 * This module is the single place LeadLoop asks for an AI-generated
 * follow-up message. When AI_API_KEY is configured, generateFollowUpMessage
 * should be wired to call a real provider (OpenAI, Anthropic, etc.) here —
 * nowhere else in the app needs to change. Until then it falls back to a
 * clearly-labeled, deterministic mock generator so the feature is fully
 * functional in demo/dev environments.
 */

import type { LeadStatus } from "@/generated/prisma/enums";
import { LEAD_STATUS_LABEL } from "@/lib/leadStatus";

export interface FollowUpContext {
  customerName: string;
  service: string;
  estimatedValue: number;
  notes?: string | null;
  status: LeadStatus;
  lastContactedAt?: Date | null;
}

export interface GeneratedFollowUp {
  message: string;
  source: "mock" | "ai";
}

export async function generateFollowUpMessage(
  context: FollowUpContext
): Promise<GeneratedFollowUp> {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey) {
    // Real-provider integration point.
    // Example (uncomment and adapt once you have a provider):
    //
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4o-mini",
    //     messages: [
    //       { role: "system", content: "You write short, friendly SMS-style follow-up messages for a small service business." },
    //       { role: "user", content: buildPrompt(context) },
    //     ],
    //   }),
    // });
    // const data = await response.json();
    // return { message: data.choices[0].message.content.trim(), source: "ai" };
    //
    // Falling through to the mock generator keeps this endpoint working
    // even if a key is present but the integration hasn't been wired yet.
  }

  return { message: buildMockMessage(context), source: "mock" };
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

function buildMockMessage(context: FollowUpContext): string {
  const name = firstName(context.customerName);
  const price =
    context.estimatedValue > 0
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(context.estimatedValue)
      : null;

  switch (context.status) {
    case "NEW":
      return `Hi ${name}! Thanks for reaching out about ${context.service}. I'd love to help get this taken care of${
        price ? ` — estimated around ${price}` : ""
      }. What day works best for you this week?`;

    case "CONTACTED":
      return `Hey ${name}, just following up on the ${context.service} we spoke about. Want me to go ahead and get you on the schedule?`;

    case "INTERESTED":
      return `Hi ${name}! Still excited to help with your ${context.service}${
        price ? ` (about ${price})` : ""
      }. I have some openings this week if you'd like to lock in a time.`;

    case "FOLLOW_UP": {
      const notesPart = context.notes
        ? ` I remember you mentioned: "${truncate(context.notes, 80)}."`
        : "";
      return `Hey ${name}! Just checking in about the ${context.service} we talked about.${notesPart} I still have some availability this week if you'd like to get scheduled.`;
    }

    case "BOOKED":
      return `Hi ${name}, looking forward to your ${context.service} appointment! Let me know if anything changes on your end before then.`;

    case "LOST":
      return `Hi ${name}, no worries if the timing wasn't right for the ${context.service}. If anything changes down the road, I'm happy to help — just reach out!`;

    default:
      return `Hi ${name}! Just checking in about ${context.service}. Let me know if you'd like to get scheduled.`;
  }
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

// Kept for when a real provider is wired in — builds the natural-language
// prompt from the same context object the mock generator uses.
export function buildPrompt(context: FollowUpContext): string {
  return [
    `Customer: ${context.customerName}`,
    `Service: ${context.service}`,
    context.estimatedValue > 0 ? `Estimated price: $${context.estimatedValue}` : null,
    `Lead status: ${LEAD_STATUS_LABEL[context.status]}`,
    context.lastContactedAt
      ? `Last contacted: ${context.lastContactedAt.toDateString()}`
      : "Not yet contacted",
    context.notes ? `Notes: ${context.notes}` : null,
    "",
    "Write a short, warm, casual SMS-style follow-up message from the business owner to this customer, referencing the service and encouraging them to book. Keep it under 300 characters.",
  ]
    .filter(Boolean)
    .join("\n");
}
