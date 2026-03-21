import { paginateQuery } from "@/lib/supabase/paginateQuery";

describe("paginateQuery", () => {
  it("returns empty array when first page is empty", async () => {
    const queryFn = jest.fn().mockResolvedValue({ data: [], error: null });
    const result = await paginateQuery(queryFn);
    expect(result).toEqual([]);
    expect(queryFn).toHaveBeenCalledTimes(1);
    expect(queryFn).toHaveBeenCalledWith(0, 999);
  });

  it("returns empty array when data is null", async () => {
    const queryFn = jest.fn().mockResolvedValue({ data: null, error: null });
    const result = await paginateQuery(queryFn);
    expect(result).toEqual([]);
  });

  it("returns single page of results", async () => {
    const items = [{ id: "1" }, { id: "2" }];
    const queryFn = jest.fn().mockResolvedValue({ data: items, error: null });
    const result = await paginateQuery(queryFn);
    expect(result).toEqual(items);
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("paginates across multiple pages", async () => {
    const page1 = Array.from({ length: 1000 }, (_, i) => ({ id: `${i}` }));
    const page2 = [{ id: "1000" }, { id: "1001" }];

    const queryFn = jest
      .fn()
      .mockResolvedValueOnce({ data: page1, error: null })
      .mockResolvedValueOnce({ data: page2, error: null });

    const result = await paginateQuery(queryFn);
    expect(result).toHaveLength(1002);
    expect(queryFn).toHaveBeenCalledTimes(2);
    expect(queryFn).toHaveBeenCalledWith(0, 999);
    expect(queryFn).toHaveBeenCalledWith(1000, 1999);
  });

  it("uses custom page size", async () => {
    const page1 = Array.from({ length: 50 }, (_, i) => ({ id: `${i}` }));
    const page2 = [{ id: "50" }];

    const queryFn = jest
      .fn()
      .mockResolvedValueOnce({ data: page1, error: null })
      .mockResolvedValueOnce({ data: page2, error: null });

    const result = await paginateQuery(queryFn, 50);
    expect(result).toHaveLength(51);
    expect(queryFn).toHaveBeenCalledWith(0, 49);
    expect(queryFn).toHaveBeenCalledWith(50, 99);
  });

  it("stops at maxRows limit", async () => {
    const page1 = Array.from({ length: 1000 }, (_, i) => ({ id: `${i}` }));
    const page2 = Array.from({ length: 1000 }, (_, i) => ({ id: `${1000 + i}` }));
    const page3 = Array.from({ length: 1000 }, (_, i) => ({ id: `${2000 + i}` }));

    const queryFn = jest
      .fn()
      .mockResolvedValueOnce({ data: page1, error: null })
      .mockResolvedValueOnce({ data: page2, error: null })
      .mockResolvedValueOnce({ data: page3, error: null });

    const result = await paginateQuery(queryFn, 1000, 1500);
    expect(result).toHaveLength(1500);
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it("uses default maxRows of 10000", async () => {
    const pages = Array.from({ length: 11 }, () =>
      Array.from({ length: 1000 }, (_, i) => ({ id: `${i}` }))
    );

    const queryFn = jest.fn();
    pages.forEach((page) => {
      queryFn.mockResolvedValueOnce({ data: page, error: null });
    });

    const result = await paginateQuery(queryFn);
    expect(result).toHaveLength(10000);
    expect(queryFn).toHaveBeenCalledTimes(10);
  });

  it("throws on error", async () => {
    const queryFn = jest
      .fn()
      .mockResolvedValue({ data: null, error: { message: "DB error" } });

    await expect(paginateQuery(queryFn)).rejects.toThrow("DB error");
  });
});
