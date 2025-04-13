import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication Error | Recipe Royalty",
  description: "There was an error during authentication",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error || "Default Error";

  const errors: { [key: string]: string } = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred during authentication.",
  };

  const errorMessage = errors[error] || errors.Default;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-destructive">
            Authentication Error
          </h1>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/signin">
            Try Again
          </Link>
        </Button>
      </div>
    </div>
  );
}
