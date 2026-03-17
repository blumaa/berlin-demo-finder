import { POST } from "@/app/api/scrape/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/scraper/scrapeAndStore", () => ({
  scrapeAndStore: jest.fn().mockResolvedValue({
    total: 5,
    geocoded: 3,
    errors: [],
  }),
}));

describe("POST /api/scrape", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, CRON_SECRET: "test-secret" };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("returns 401 without authorization header", async () => {
    const req = new NextRequest("http://localhost/api/scrape", {
      method: "POST",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 with wrong secret", async () => {
    const req = new NextRequest("http://localhost/api/scrape", {
      method: "POST",
      headers: { Authorization: "Bearer wrong-secret" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("calls scrapeAndStore on valid POST with correct secret", async () => {
    const req = new NextRequest("http://localhost/api/scrape", {
      method: "POST",
      headers: { Authorization: "Bearer test-secret" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.total).toBe(5);
  });
});
