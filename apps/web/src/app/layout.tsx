import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "@/lib/trpc/provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kideo - Turn Daily Chores Into Fun Adventures for Kids",
  description:
    "Help your kids learn responsibility through fun tasks, exciting rewards, and achievements. Build great habits together as a family. Free forever plan with age-appropriate task templates for ages 2-18+.",
  keywords: [
    "kids chore app",
    "family task manager",
    "kids rewards system",
    "responsibility tracker",
    "chore chart app",
    "kids allowance",
    "parenting app",
    "family organizer",
  ],
  authors: [{ name: "Kideo" }],
  creator: "Kideo",
  publisher: "Kideo",
  metadataBase: new URL("https://kideo.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kideo.ai",
    title: "Kideo - Turn Daily Chores Into Fun Adventures for Kids",
    description:
      "Help your kids learn responsibility through fun tasks, exciting rewards, and achievements. Build great habits together as a family.",
    siteName: "Kideo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kideo - Fun Responsibility for Kids",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kideo - Turn Daily Chores Into Fun Adventures for Kids",
    description:
      "Build great habits together as a family with tasks, rewards, and achievements.",
    images: ["/og-image.png"],
    creator: "@kideo_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className={inter.className}>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
