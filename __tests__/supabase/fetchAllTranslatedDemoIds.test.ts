import { fetchAllTranslatedDemoIds } from "@/lib/supabase/fetchAllTranslatedDemoIds";

function createMockSupabase(pages: { demo_id: string }[][]) {
  let callIndex = 0;

  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    range: jest.fn().mockImplementation(() => {
      const page = pages[callIndex] ?? [];
      callIndex++;
      return Promise.resolve({ data: page, error: null });
    }),
  };

  return {
    from: jest.fn().mockReturnValue(mockQuery),
    _mockQuery: mockQuery,
  };
}

describe("fetchAllTranslatedDemoIds", () => {
  it("returns empty set when no translations exist", async () => {
    const supabase = createMockSupabase([[]]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fetchAllTranslatedDemoIds(supabase as any);
    expect(result.size).toBe(0);
  });

  it("returns all IDs from a single page", async () => {
    const supabase = createMockSupabase([
      [{ demo_id: "a" }, { demo_id: "b" }, { demo_id: "c" }],
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fetchAllTranslatedDemoIds(supabase as any);
    expect(result).toEqual(new Set(["a", "b", "c"]));
  });

  it("paginates and deduplicates across multiple pages", async () => {
    // Simulate PAGE_SIZE=1000: first page full, second page partial
    const page1 = Array.from({ length: 1000 }, (_, i) => ({
      demo_id: `id-${i % 500}`, // duplicates from multiple locales
    }));
    const page2 = [{ demo_id: "id-500" }, { demo_id: "id-501" }];

    const supabase = createMockSupabase([page1, page2]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fetchAllTranslatedDemoIds(supabase as any);

    // 500 unique from page1 + 2 unique from page2
    expect(result.size).toBe(502);
    expect(result.has("id-0")).toBe(true);
    expect(result.has("id-499")).toBe(true);
    expect(result.has("id-500")).toBe(true);
    expect(result.has("id-501")).toBe(true);
  });

  it("handles more than 10k translation rows without truncation", async () => {
    // With 2000 demos × 11 locales = 22,000 rows
    // paginateQuery maxRows=10,000 would truncate at ~909 unique demos
    // This test verifies all unique demo IDs are returned
    const totalDemos = 2000;
    const localesPerDemo = 11;
    const pageSize = 1000;
    const totalRows = totalDemos * localesPerDemo; // 22,000

    // Build pages of 1000 rows each
    const pages: { demo_id: string }[][] = [];
    let rowIndex = 0;
    while (rowIndex < totalRows) {
      const page: { demo_id: string }[] = [];
      for (let j = 0; j < pageSize && rowIndex < totalRows; j++, rowIndex++) {
        const demoIndex = Math.floor(rowIndex / localesPerDemo);
        page.push({ demo_id: `demo-${demoIndex}` });
      }
      pages.push(page);
    }
    // Empty page to signal end of pagination
    pages.push([]);

    const supabase = createMockSupabase(pages);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fetchAllTranslatedDemoIds(supabase as any);

    expect(result.size).toBe(totalDemos);
    expect(result.has("demo-0")).toBe(true);
    expect(result.has(`demo-${totalDemos - 1}`)).toBe(true);
  });

  it("throws on supabase error", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      range: jest.fn().mockResolvedValue({
        data: null,
        error: { message: "connection failed" },
      }),
    };
    const supabase = { from: jest.fn().mockReturnValue(mockQuery) };

    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetchAllTranslatedDemoIds(supabase as any)
    ).rejects.toThrow("connection failed");
  });
});
