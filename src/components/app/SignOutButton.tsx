"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { IconLogOut } from "@/components/ui/icons";

export function SignOutButton() {
  return (
    <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
      <IconLogOut className="h-4 w-4" />
      Log out
    </Button>
  );
}
