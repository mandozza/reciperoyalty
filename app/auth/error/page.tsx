"use client";

import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication Error | Recipe Royalty",
  description: "There was an error during authentication",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An error occurred during authentication.";

  switch (error) {
    case "Configuration":
      errorMessage = "There is a problem with the server configuration.";
      break;
    case "AccessDenied":
      errorMessage = "Access was denied to this resource.";
      break;
    case "Verification":
      errorMessage = "The verification token has expired or has already been used.";
      break;
    case "OAuthSignin":
      errorMessage = "Error in constructing an authorization URL.";
      break;
    case "OAuthCallback":
      errorMessage = "Error in handling the response from an OAuth provider.";
      break;
    case "OAuthCreateAccount":
      errorMessage = "Could not create OAuth provider user in the database.";
      break;
    case "EmailCreateAccount":
      errorMessage = "Could not create email provider user in the database.";
      break;
    case "Callback":
      errorMessage = "Error in the OAuth callback handler route.";
      break;
    case "OAuthAccountNotLinked":
      errorMessage = "Email on the account conflicts with another existing account.";
      break;
    case "EmailSignin":
      errorMessage = "Check your email address.";
      break;
    case "CredentialsSignin":
      errorMessage = "Sign in failed. Check the details you provided are correct.";
      break;
    case "SessionRequired":
      errorMessage = "Please sign in to access this page.";
      break;
    default:
      errorMessage = "An unknown error occurred. Please try again.";
  }

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

        <Button
          variant="outline"
          onClick={() => window.location.href = "/auth/signin"}
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}
