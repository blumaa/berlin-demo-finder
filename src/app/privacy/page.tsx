"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

const POLICE_URL =
  "https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/";
const ANALYTICS_URL = "https://vercel.com/docs/analytics";
const CONTACT_EMAIL = "desmond.blume@gmail.com";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        &larr; {t("nav.backToMap")}
      </Link>

      <h1 className="text-2xl font-bold mt-6 mb-4">{t("privacy.title")}</h1>

      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-900">{t("privacy.noDataTitle")}</h2>
        <p>{t("privacy.noDataText")}</p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">{t("privacy.publicDataTitle")}</h2>
        <p>
          {t("privacy.publicDataText").split("{link}")[0]}
          <a
            href={POLICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {t("privacy.publicDataLink")}
          </a>
          {t("privacy.publicDataText").split("{link}")[1]}
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">{t("privacy.analyticsTitle")}</h2>
        <p>
          {t("privacy.analyticsText").split("{link}")[0]}
          <a
            href={ANALYTICS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {t("privacy.analyticsLink")}
          </a>
          {t("privacy.analyticsText").split("{link}")[1]}
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">{t("privacy.contactTitle")}</h2>
        <p>
          {t("privacy.contactText").split("{email}")[0]}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {CONTACT_EMAIL}
          </a>
          {t("privacy.contactText").split("{email}")[1]}
        </p>
      </div>
    </main>
  );
}
