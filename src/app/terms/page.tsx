import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Link from "next/link";
import { Crown } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Recipe Royalty",
  description: "Terms of Service for Recipe Royalty",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-lg font-medium">Recipe Royalty</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Recipe Royalty, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>

            <h2>2. User Account</h2>
            <p>
              To use certain features of the platform, you must register for an account. You agree to provide accurate information and keep it updated.
            </p>

            <h2>3. Content Guidelines</h2>
            <p>
              Users are responsible for the content they post. Content must be original or properly credited. Inappropriate or offensive content is not allowed.
            </p>

            <h2>4. Recipe Sharing</h2>
            <p>
              By sharing recipes on Recipe Royalty, you grant us a non-exclusive license to display and promote your content on our platform.
            </p>

            <h2>5. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              to understand how we collect and use your information.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              All content and materials available on Recipe Royalty, unless user-generated, are the property of Recipe Royalty and are protected by copyright laws.
            </p>

            <h2>7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at support@reciperoyalty.com
            </p>

            <div className="mt-8 text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
