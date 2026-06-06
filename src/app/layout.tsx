import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "SpecPilot AI | Premium PRD Generator",
  description: "Transform your app ideas into complete visual Product Requirements Documents with AI-guided discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`antialiased ${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-background font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}