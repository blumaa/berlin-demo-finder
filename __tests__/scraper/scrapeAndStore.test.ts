import { scrapeAndStore } from "@/lib/scraper/scrapeAndStore";
import * as fetchHtmlModule from "@/lib/scraper/fetchHtml";
import { hashContent } from "@/lib/scraper/contentHash";
import { readFileSync } from "fs";
import { join } from "path";

const fixture = readFileSync(
  join(__dirname, "../fixtures/demos-page.html"),
  "utf-8"
);

// Mock dependencies
jest.mock("@/lib/scraper/fetchHtml");

const mockUpsert = jest.fn().mockResolvedValue({ error: null });

// Mock for scrape_metadata
const mockMetadataUpsert = jest.fn().mockResolvedValue({ error: null });
let metadataHashValue: string | null = null;

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === "demos") {
        return {
          upsert: mockUpsert,
        };
      }
      if (table === "scrape_metadata") {
        return {
          upsert: mockMetadataUpsert,
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: metadataHashValue
                  ? { value: metadataHashValue }
                  : null,
                error: null,
              }),
            }),
          }),
        };
      }
      return { upsert: mockUpsert };
    },
  }),
}));

describe("scrapeAndStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    metadataHashValue = null;
    (fetchHtmlModule.fetchHtml as jest.Mock).mockResolvedValue(fixture);
  });

  it("fetches, parses, and bulk upserts demos", async () => {
    const result = await scrapeAndStore();
    expect(result.total).toBe(5);
    expect(result.errors).toHaveLength(0);
    expect(result.skipped).toBe(false);
    expect(mockUpsert).toHaveBeenCalledTimes(1);
  });

  it("throws on zero-row scrape result", async () => {
    (fetchHtmlModule.fetchHtml as jest.Mock).mockResolvedValue(
      "<html><body>Empty</body></html>"
    );
    await expect(scrapeAndStore()).rejects.toThrow("0 rows");
  });

  it("skips when content hash matches", async () => {
    metadataHashValue = hashContent(fixture);

    const result = await scrapeAndStore();
    expect(result.skipped).toBe(true);
    expect(result.total).toBe(0);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("stores content hash after successful upsert", async () => {
    await scrapeAndStore();
    expect(mockMetadataUpsert).toHaveBeenCalledTimes(1);
    expect(mockMetadataUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ key: "last_html_hash" }),
      { onConflict: "key" }
    );
  });

  it("reports upsert errors without throwing", async () => {
    mockUpsert.mockResolvedValueOnce({
      error: { message: "upsert failed" },
    });
    const result = await scrapeAndStore();
    expect(result.errors).toContainEqual(
      expect.stringContaining("upsert")
    );
  });
});
