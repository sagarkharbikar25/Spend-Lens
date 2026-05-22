import type { Metadata } from "next";
import localFont from "next/font/local";
import { getAppUrl, ogImageUrl } from "@/frontend/lib/site";
import "./globals.css";

const appUrl = getAppUrl();

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "SpendLens — AI Spend Audit",
  description:
    "Free audit for startup teams: spot overspend on Cursor, Claude, ChatGPT, and more.",
  openGraph: {
    title: "SpendLens — AI Spend Audit",
    description:
      "Find where your AI tool stack is bleeding money. Instant audit, no login.",
    type: "website",
    siteName: "SpendLens",
    images: [{ url: ogImageUrl(), width: 1200, height: 630, alt: "SpendLens" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — AI Spend Audit",
    description:
      "Find where your AI tool stack is bleeding money. Instant audit, no login.",
    images: [ogImageUrl()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
