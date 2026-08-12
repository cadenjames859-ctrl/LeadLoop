"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Label, Input, Textarea, Select, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/leadStatus";
import type { LeadFormState } from "@/lib/actions/leads";

const initialState: LeadFormState = {};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function LeadForm({
  action,
  defaultValues,
  submitLabel = "Add Lead",
  submitPendingLabel = "Saving…",
  cancelHref,
}: {
  action: (prevState: LeadFormState, formData: FormData) => Promise<LeadFormState>;
  defaultValues?: Partial<{
    customerName: string;
    phone: string;
    email: string;
    service: string;
    estimatedValue: string;
    notes: string;
    status: string;
    nextFollowUpAt: string;
  }>;
  submitLabel?: string;
  submitPendingLabel?: string;
  cancelHref: string;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const values = state.values ?? defaultValues ?? {};
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="customerName" required>
            Customer name
          </Label>
          <Input
            id="customerName"
            name="customerName"
            defaultValue={values.customerName}
            placeholder="Jane Doe"
            required
          />
          <FieldError>{fieldErrors.customerName}</FieldError>
        </div>

        <div>
          <Label htmlFor="service" required>
            Service requested
          </Label>
          <Input
            id="service"
            name="service"
            defaultValue={values.service}
            placeholder="Full Detail"
            required
          />
          <FieldError>{fieldErrors.service}</FieldError>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={values.phone}
            placeholder="(555) 123-4567"
          />
          <FieldError>{fieldErrors.phone}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={values.email}
            placeholder="jane@example.com"
          />
          <FieldError>{fieldErrors.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="estimatedValue" required>
            Estimated value ($)
          </Label>
          <Input
            id="estimatedValue"
            name="estimatedValue"
            type="number"
            min="0"
            step="1"
            inputMode="decimal"
            defaultValue={values.estimatedValue ?? "0"}
            placeholder="200"
            required
          />
          <FieldError>{fieldErrors.estimatedValue}</FieldError>
        </div>

        <div>
          <Label htmlFor="status" required>
            Status
          </Label>
          <Select id="status" name="status" defaultValue={values.status ?? "NEW"}>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
          <FieldError>{fieldErrors.status}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="nextFollowUpAt">Next follow-up date</Label>
          <Input
            id="nextFollowUpAt"
            name="nextFollowUpAt"
            type="date"
            defaultValue={values.nextFollowUpAt}
            className="sm:max-w-xs"
          />
          <FieldError>{fieldErrors.nextFollowUpAt}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={values.notes}
            placeholder="Anything worth remembering about this lead…"
            rows={4}
          />
          <FieldError>{fieldErrors.notes}</FieldError>
        </div>
      </div>

      <FieldError>{state.error}</FieldError>

      <div className="flex items-center gap-3 border-t border-line-soft pt-5">
        <SubmitButton label={submitLabel} pendingLabel={submitPendingLabel} />
        <Link
          href={cancelHref}
          className="inline-flex h-12 items-center rounded-[var(--radius-control)] px-5 text-sm font-medium text-ink-soft hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
