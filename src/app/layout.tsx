import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/components/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ModalProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
