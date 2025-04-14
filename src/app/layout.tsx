import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Recipe Royalty - Social Cooking Platform",
  description: "A social platform built around the love of cooking — discover, share, and connect with fellow food lovers.",
  keywords: ["cooking", "recipes", "social", "food", "community", "meal planning"],
  authors: [{ name: "Recipe Royalty Team" }],
  openGraph: {
    title: "Recipe Royalty - Social Cooking Platform",
    description: "A social platform built around the love of cooking — discover, share, and connect with fellow food lovers.",
    type: "website",
    locale: "en_US",
    siteName: "Recipe Royalty",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
