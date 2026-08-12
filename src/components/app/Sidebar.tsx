"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/app/Logo";
import { cn, initials } from "@/lib/utils";
import {
  IconLayoutDashboard,
  IconUsers,
  IconClock,
  IconSettings,
  IconLogOut,
  IconMenu,
  IconX,
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/leads", label: "Leads", icon: IconUsers },
  { href: "/follow-ups", label: "Follow-Ups", icon: IconClock },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const ItemIcon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-tint text-primary"
                : "text-ink-soft hover:bg-line-soft hover:text-ink"
            )}
          >
            <ItemIcon className="h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserFooter({ name, email }: { name: string; email: string }) {
  return (
    <div className="border-t border-line-soft p-3">
      <div className="flex items-center gap-3 rounded-[var(--radius-control)] px-2 py-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-sm font-semibold text-primary">
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{name}</p>
          <p className="truncate text-xs text-ink-faint">{email}</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-1 flex w-full items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
      >
        <IconLogOut className="h-[18px] w-[18px]" />
        Log out
      </button>
    </div>
  );
}

export function Sidebar({ user }: { user: { name: string; email: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 md:hidden">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 text-ink-soft hover:bg-line-soft"
        >
          <IconMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-line-soft px-4">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-2 text-ink-soft hover:bg-line-soft"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
              <NavLinks onNavigate={() => setOpen(false)} />
              <UserFooter name={user.name} email={user.email} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:border-r md:border-line md:bg-white">
        <div className="flex h-16 items-center px-5">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto pb-4">
          <NavLinks />
          <UserFooter name={user.name} email={user.email} />
        </div>
      </aside>
    </>
  );
}
