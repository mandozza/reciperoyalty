"use client";

import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Request | Recipe Royalty",
  description: "Check your email to sign in",
};

export default function VerifyRequestPage() {
  const router = useRouter();

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            A sign in link has been sent to your email address.
          </p>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          If you don&apos;t see it, check your spam folder. The link will expire in 24 hours.
        </p>

        <Button
          variant="outline"
          onClick={() => router.push("/auth/signin")}
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}
