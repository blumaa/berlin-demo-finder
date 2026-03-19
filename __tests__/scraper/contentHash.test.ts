import { hashContent } from "@/lib/scraper/contentHash";

describe("hashContent", () => {
  it("returns a consistent SHA-256 hex string", () => {
    const html = "<html><body>Hello</body></html>";
    const hash1 = hashContent(html);
    const hash2 = hashContent(html);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("returns different hashes for different input", () => {
    const hash1 = hashContent("<html>Page A</html>");
    const hash2 = hashContent("<html>Page B</html>");

    expect(hash1).not.toBe(hash2);
  });

  it("handles empty string", () => {
    const hash = hashContent("");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
