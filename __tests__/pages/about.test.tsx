import React, { ReactElement, ReactNode } from "react";
import AboutPage from "@/app/about/page";
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

describe("AboutPage", () => {
  it("returns a main element", () => {
    const element = AboutPage();
    expect(element.type).toBe("main");
  });

  it("contains the page heading", () => {
    const text = extractText(AboutPage());
    expect(text).toContain("About Berlin Demo Finder");
  });

  it("links back to /", () => {
    const text = extractText(AboutPage());
    expect(text).toContain("href=/");
    expect(text).toContain("Back to map");
  });

  it("links to Berlin Police assembly registry", () => {
    const text = extractText(AboutPage());
    expect(text).toContain(
      "href=https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/"
    );
  });

  it("mentions collection frequency", () => {
    const text = extractText(AboutPage());
    expect(text).toContain("twice per week");
  });

  it("shows contact email", () => {
    const text = extractText(AboutPage());
    expect(text).toContain("href=mailto:desmond.blume@gmail.com");
  });

  it("shows copyright", () => {
    const text = extractText(AboutPage());
    expect(text).toContain("2026 Berlin Demo Finder");
  });
});
