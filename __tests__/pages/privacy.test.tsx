import React, { ReactElement, ReactNode } from "react";
import PrivacyPage from "@/app/privacy/page";
import en from "@/i18n/dictionaries/en";

jest.mock("@/contexts/LanguageContext", () => ({
  useTranslation: () => ({
    locale: "en",
    setLocale: jest.fn(),
    t: (key: string) => (en as Record<string, string>)[key] ?? key,
  }),
}));

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode; href?: string }>;
    const href = el.props.href ? ` href=${el.props.href}` : "";
    return href + extractText(el.props.children);
  }
  return "";
}

describe("PrivacyPage", () => {
  it("returns a main element", () => {
    const element = PrivacyPage();
    expect(element.type).toBe("main");
  });

  it("contains the page heading", () => {
    const text = extractText(PrivacyPage());
    expect(text).toContain("Privacy");
  });

  it("links back to /", () => {
    const text = extractText(PrivacyPage());
    expect(text).toContain("href=/");
    expect(text).toContain("Back to map");
  });

  it("states no personal data is collected", () => {
    const text = extractText(PrivacyPage());
    expect(text).toContain("does not collect personal information");
  });

  it("mentions Vercel Web Analytics", () => {
    const text = extractText(PrivacyPage());
    expect(text).toContain("Vercel Web Analytics");
  });

  it("states no cookies are used", () => {
    const text = extractText(PrivacyPage());
    expect(text).toContain("does not use cookies");
  });

  it("shows contact email", () => {
    const text = extractText(PrivacyPage());
    expect(text).toContain("href=mailto:desmond.blume@gmail.com");
  });
});
