import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Berlin Demo Finder",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        &larr; Back to map
      </Link>

      <h1 className="text-2xl font-bold mt-6 mb-4">Privacy</h1>

      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-900">No personal data collected</h2>
        <p>
          Berlin Demo Finder does not require user accounts, does not collect
          personal information, and does not use cookies.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Public data only</h2>
        <p>
          All demonstration data displayed on this site comes from the{" "}
          <a
            href="https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Berlin Police assembly registry
          </a>
          , a publicly available government resource.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Analytics</h2>
        <p>
          This site uses{" "}
          <a
            href="https://vercel.com/docs/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Vercel Web Analytics
          </a>
          , which collects anonymous, aggregated usage data. It does not use
          cookies or track individual visitors.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Contact</h2>
        <p>
          Privacy questions? Reach out at{" "}
          <a
            href="mailto:desmond.blume@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            desmond.blume@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
