"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input, Select } from "@/components/ui/Field";
import { IconSearch } from "@/components/ui/icons";
import { LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/leadStatus";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "createdAt_desc", label: "Newest first" },
  { value: "createdAt_asc", label: "Oldest first" },
  { value: "nextFollowUpAt_asc", label: "Follow-up: soonest" },
  { value: "nextFollowUpAt_desc", label: "Follow-up: latest" },
  { value: "estimatedValue_desc", label: "Highest value" },
  { value: "estimatedValue_asc", label: "Lowest value" },
  { value: "customerName_asc", label: "Customer name (A–Z)" },
];

export function LeadsFilterBar({
  initialSearch,
  initialStatus,
  initialSort,
}: {
  initialSearch: string;
  initialStatus: string;
  initialSort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const isFirstRun = useRef(true);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const handle = setTimeout(() => {
      updateParams({ search });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, service, phone, email…"
          className="pl-9"
          aria-label="Search leads"
        />
      </div>
      <Select
        value={initialStatus}
        onChange={(e) => updateParams({ status: e.target.value })}
        aria-label="Filter by status"
        className="sm:w-44"
      >
        <option value="ALL">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {LEAD_STATUS_LABEL[s]}
          </option>
        ))}
      </Select>
      <Select
        value={initialSort}
        onChange={(e) => updateParams({ sort: e.target.value })}
        aria-label="Sort leads"
        className="sm:w-52"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
