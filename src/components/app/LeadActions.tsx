"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { IconCheckCircle, IconXCircle, IconEdit, IconTrash, IconClock } from "@/components/ui/icons";
import { setLeadStatusAction, markContactedAction, deleteLeadAction } from "@/lib/actions/leads";
import type { LeadStatus } from "@/generated/prisma/enums";

export function LeadActions({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(action: string, fn: () => Promise<void>) {
    setError(null);
    setPendingAction(action);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setPendingAction(null);
      }
    });
  }

  function handleDelete() {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    setError(null);
    setPendingAction("delete");
    startTransition(async () => {
      try {
        await deleteLeadAction(leadId);
      } catch {
        setError("Could not delete this lead. Please try again.");
        setPendingAction(null);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <ButtonLink href={`/leads/${leadId}/edit`} variant="secondary" size="sm">
          <IconEdit className="h-4 w-4" />
          Edit Lead
        </ButtonLink>

        {status !== "BOOKED" && status !== "LOST" ? (
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => run("contacted", () => markContactedAction(leadId))}
          >
            <IconClock className="h-4 w-4" />
            {pendingAction === "contacted" ? "Marking…" : "Mark Contacted"}
          </Button>
        ) : null}

        {status !== "BOOKED" ? (
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => run("booked", () => setLeadStatusAction(leadId, "BOOKED" as LeadStatus))}
          >
            <IconCheckCircle className="h-4 w-4" />
            {pendingAction === "booked" ? "Updating…" : "Mark Booked"}
          </Button>
        ) : null}

        {status !== "LOST" ? (
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => run("lost", () => setLeadStatusAction(leadId, "LOST" as LeadStatus))}
          >
            <IconXCircle className="h-4 w-4" />
            {pendingAction === "lost" ? "Updating…" : "Mark Lost"}
          </Button>
        ) : null}

        <Button
          variant="danger-ghost"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
        >
          <IconTrash className="h-4 w-4" />
          {pendingAction === "delete" ? "Deleting…" : "Delete Lead"}
        </Button>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
