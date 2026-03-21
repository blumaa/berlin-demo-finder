import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Berlin Demo Finder",
};

export default function AboutPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        &larr; Back to map
      </Link>

      <h1 className="text-2xl font-bold mt-6 mb-4">About Berlin Demo Finder</h1>

      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        <p>
          Berlin Demo Finder is an interactive map that shows upcoming public
          assemblies and demonstrations in Berlin. It helps residents and
          visitors quickly see what&apos;s happening and where.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Data source</h2>
        <p>
          All data comes from the{" "}
          <a
            href="https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Berlin Police assembly registry
          </a>
          , a publicly available government resource listing registered
          assemblies in Berlin.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Collection frequency</h2>
        <p>
          The data is automatically collected twice per week. Listings are
          geocoded and categorized before being displayed on the map.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Contact</h2>
        <p>
          Questions or feedback? Reach out at{" "}
          <a
            href="mailto:desmond.blume@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            desmond.blume@gmail.com
          </a>
        </p>
      </div>

      <p className="mt-10 text-xs text-gray-400">&copy; 2026 Berlin Demo Finder</p>
    </main>
  );
}
