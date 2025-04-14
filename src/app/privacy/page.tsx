import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Link from "next/link";
import { Crown } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Recipe Royalty",
  description: "Privacy Policy for Recipe Royalty",
};

export default function PrivacyPage() {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including:
            </p>
            <ul>
              <li>Account information (name, email, password)</li>
              <li>Profile information (bio, profile picture)</li>
              <li>Recipe content and comments</li>
              <li>Usage data and preferences</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about updates and features</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information:
            </p>
            <ul>
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist our operations</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience and collect usage data. You can control cookie settings through your browser.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 13. We do not knowingly collect information from children under 13.
            </p>

            <h2>8. Changes to Privacy Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of any material changes by posting the new policy on this page.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@reciperoyalty.com
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
