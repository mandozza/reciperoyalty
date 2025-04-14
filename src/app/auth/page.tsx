import { Metadata } from "next";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign In - Recipe Royalty",
  description: "Sign in to your Recipe Royalty account",
};

export default function AuthPage() {
  return (
    <div className={cn("container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0", inter.className)}>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-zinc-900/60" />
        </div>
        <div className="relative z-20 flex items-center gap-2">
          <Crown className="h-6 w-6" />
          <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
            Recipe Royalty
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-normal">
              &ldquo;Recipe Royalty has transformed how I share my recipes with the world. The community is amazing!&rdquo;
            </p>
            <footer className="text-sm font-normal text-white/80">Sofia Chen, Professional Chef</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Welcome back</CardTitle>
              </div>
              <CardDescription>
                Enter your email to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserAuthForm />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
