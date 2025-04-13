"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => router.push("/")}
        className="flex-1"
      >
        Cancel
      </Button>
      <Button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex-1"
      >
        Sign out
      </Button>
    </div>
  );
}
