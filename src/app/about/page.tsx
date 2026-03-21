"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

const POLICE_URL =
  "https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/";
const CONTACT_EMAIL = "desmond.blume@gmail.com";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        &larr; {t("nav.backToMap")}
      </Link>

      <h1 className="text-2xl font-bold mt-6 mb-4">{t("about.title")}</h1>

      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        <p>{t("about.description")}</p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">{t("about.dataSourceTitle")}</h2>
        <p>
          {t("about.dataSourceText").split("{link}")[0]}
          <a
            href={POLICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {t("about.dataSourceLink")}
          </a>
          {t("about.dataSourceText").split("{link}")[1]}
        </p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">{t("about.frequencyTitle")}</h2>
        <p>{t("about.frequencyText")}</p>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">{t("about.contactTitle")}</h2>
        <p>
          {t("about.contactText").split("{email}")[0]}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {CONTACT_EMAIL}
          </a>
          {t("about.contactText").split("{email}")[1]}
        </p>
      </div>

      <p className="mt-10 text-xs text-gray-400">{t("about.copyright")}</p>
    </main>
  );
}
