import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell";
import { Demo } from "@/lib/types";
import { paginateQuery } from "@/lib/supabase/paginateQuery";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Berlin Demo Finder",
  description:
    "Interactive map of demonstrations and assemblies in Berlin, scraped from official police listings.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let allDemos: Demo[] = [];
  let lastUpdated = "";

  try {
    const supabase = createServerClient();
    allDemos = await paginateQuery<Demo>((from, to) =>
      supabase
        .from("demos")
        .select("*")
        .order("date", { ascending: true })
        .order("time_from", { ascending: true })
        .range(from, to)
    );
    lastUpdated = allDemos.reduce((latest, d) => {
      return d.scraped_at > latest ? d.scraped_at : latest;
    }, "");
  } catch {
    // Supabase unavailable (e.g. CI build with placeholder env vars)
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AppShell allDemos={allDemos} lastUpdated={lastUpdated} />
        {/* children kept for Next.js routing — pages return null */}
        <div className="hidden">{children}</div>
      </body>
    </html>
  );
}
