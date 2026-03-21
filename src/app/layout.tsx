import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { NavShell } from "@/components/NavShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Berlin Demo Finder",
  description:
    "Interactive map of demonstrations and assemblies in Berlin, scraped from official police listings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <LanguageProvider>
          <QueryProvider>
            <FilterProvider>
              <NavShell />
              {children}
            </FilterProvider>
          </QueryProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
