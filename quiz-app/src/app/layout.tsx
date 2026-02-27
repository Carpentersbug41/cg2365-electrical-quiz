import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import AuthEnforcer from "@/components/auth/AuthEnforcer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Health & Safety 2365 Electrical Quiz",
  description: "Test your knowledge with 50 comprehensive multiple-choice questions covering health and safety for the 2365 electrical qualification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <DarkModeToggle />
          <Suspense fallback={null}>
            <AuthEnforcer>{children}</AuthEnforcer>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
