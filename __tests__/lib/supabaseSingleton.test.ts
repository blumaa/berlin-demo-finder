import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({ from: jest.fn() })),
}));

const mockedCreateClient = createClient as jest.Mock;

describe("Supabase singleton clients", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    mockedCreateClient.mockClear();
  });

  it("createServerClient returns the same instance on multiple calls", async () => {
    const { createServerClient } = await import("@/lib/supabase/server");
    const a = createServerClient();
    const b = createServerClient();
    expect(a).toBe(b);
  });

  it("createAdminClient returns the same instance on multiple calls", async () => {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const a = createAdminClient();
    const b = createAdminClient();
    expect(a).toBe(b);
  });

  it("createClient returns the same instance on multiple calls", async () => {
    const { createClient: createBrowserClient } = await import(
      "@/lib/supabase/client"
    );
    const a = createBrowserClient();
    const b = createBrowserClient();
    expect(a).toBe(b);
  });
});
