import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const leadStatusValues = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "BOOKED",
  "LOST",
] as const;

export const leadSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required").max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  email: z
    .union([z.literal(""), z.string().trim().email("Enter a valid email address")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  service: z.string().trim().min(1, "Service is required").max(160),
  estimatedValue: z.coerce
    .number({ message: "Estimated value must be a number" })
    .min(0, "Estimated value cannot be negative")
    .max(10_000_000, "Estimated value is too large"),
  notes: z
    .string()
    .trim()
    .max(4000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  status: z.enum(leadStatusValues).default("NEW"),
  nextFollowUpAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});

export type LeadInput = z.infer<typeof leadSchema>;
