import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearFieldCache, syncLeadToGhl, type GhlLeadPayload, type GhlOptions } from "./ghl";

const payload: GhlLeadPayload = {
  firstName: "Emma",
  email: "emma@example.com",
  tags: ["ROLE_AUTHOR", "VISIBILITY_QUIZ_COMPLETED"],
  managedTags: ["ROLE_COACH", "ROLE_AUTHOR", "VISIBILITY_QUIZ_COMPLETED"],
  fields: { visibility_score: 62, visibility_level: "Building Recognition", referred_by: "sam-abcde" },
};

interface Call {
  method: string;
  path: string;
  body: unknown;
  headers: Headers;
}

function fakeGhl(opts: { upsertStatus?: number[]; fieldKeys?: string[]; contactTags?: string[] } = {}) {
  const calls: Call[] = [];
  let upserts = 0;
  const fetchImpl = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    const method = init?.method ?? "GET";
    calls.push({
      method,
      path: url.pathname,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      headers: new Headers(init?.headers),
    });
    if (url.pathname === "/locations/loc123/customFields") {
      const keys = opts.fieldKeys ?? ["visibility_score", "visibility_level", "referred_by"];
      return Response.json({ customFields: keys.map((k, i) => ({ id: `f${i}`, name: k, fieldKey: `contact.${k}` })) });
    }
    if (url.pathname === "/contacts/upsert") {
      const status = opts.upsertStatus?.[upserts++] ?? 200;
      if (status !== 200) return new Response("error", { status });
      return Response.json({ new: false, contact: { id: "c1", tags: opts.contactTags ?? ["role_coach", "vip_customer"] } });
    }
    if (url.pathname === "/contacts/c1/tags") return Response.json({ tags: [] });
    return new Response("not found", { status: 404 });
  });
  return { calls, fetchImpl };
}

function options(fetchImpl: typeof fetch, overrides: Partial<GhlOptions> = {}): GhlOptions {
  return {
    token: "tok",
    locationId: "loc123",
    fetchImpl,
    logger: { warn: vi.fn(), error: vi.fn() },
    retryDelayMs: 0,
    ...overrides,
  };
}

beforeEach(() => clearFieldCache());

describe("syncLeadToGhl", () => {
  it("skips when credentials are missing", async () => {
    const { fetchImpl } = fakeGhl();
    const result = await syncLeadToGhl(payload, options(fetchImpl, { token: undefined }));
    expect(result).toEqual({ synced: false, reason: "not_configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("upserts the contact with mapped custom field ids and auth headers", async () => {
    const { calls, fetchImpl } = fakeGhl();
    const result = await syncLeadToGhl(payload, options(fetchImpl));
    expect(result).toEqual({ synced: true, contactId: "c1" });

    const upsert = calls.find((c) => c.path === "/contacts/upsert")!;
    expect(upsert.method).toBe("POST");
    expect(upsert.headers.get("authorization")).toBe("Bearer tok");
    expect(upsert.headers.get("version")).toBe("2021-07-28");
    expect(upsert.body).toMatchObject({
      locationId: "loc123",
      firstName: "Emma",
      email: "emma@example.com",
      customFields: [
        { id: "f0", field_value: 62 },
        { id: "f1", field_value: "Building Recognition" },
        { id: "f2", field_value: "sam-abcde" },
      ],
    });
  });

  it("removes stale quiz tags (only ours) before adding the new ones", async () => {
    const { calls, fetchImpl } = fakeGhl();
    await syncLeadToGhl(payload, options(fetchImpl));
    const tagCalls = calls.filter((c) => c.path === "/contacts/c1/tags");
    expect(tagCalls.map((c) => c.method)).toEqual(["DELETE", "POST"]);
    expect(tagCalls[0]!.body).toEqual({ tags: ["role_coach"] });
    expect(tagCalls[1]!.body).toEqual({ tags: payload.tags });
  });

  it("skips the delete call when there are no stale tags", async () => {
    const { calls, fetchImpl } = fakeGhl({ contactTags: ["role_author"] });
    await syncLeadToGhl(payload, options(fetchImpl));
    expect(calls.filter((c) => c.method === "DELETE")).toHaveLength(0);
  });

  it("warns about missing custom fields but still syncs the rest", async () => {
    const { calls, fetchImpl } = fakeGhl({ fieldKeys: ["visibility_score"] });
    const opts = options(fetchImpl);
    const result = await syncLeadToGhl(payload, opts);
    expect(result.synced).toBe(true);
    expect(opts.logger!.warn).toHaveBeenCalledWith(expect.stringContaining("visibility_level"));
    const upsert = calls.find((c) => c.path === "/contacts/upsert")!;
    expect((upsert.body as { customFields: unknown[] }).customFields).toEqual([{ id: "f0", field_value: 62 }]);
  });

  it("retries a server error once", async () => {
    const { calls, fetchImpl } = fakeGhl({ upsertStatus: [500, 200] });
    const result = await syncLeadToGhl(payload, options(fetchImpl));
    expect(result.synced).toBe(true);
    expect(calls.filter((c) => c.path === "/contacts/upsert")).toHaveLength(2);
  });

  it("does not retry a client error, and never throws", async () => {
    const { calls, fetchImpl } = fakeGhl({ upsertStatus: [400] });
    const opts = options(fetchImpl);
    const result = await syncLeadToGhl(payload, opts);
    expect(result).toEqual({ synced: false, reason: "error" });
    expect(calls.filter((c) => c.path === "/contacts/upsert")).toHaveLength(1);
    expect(opts.logger!.error).toHaveBeenCalled();
  });

  it("gives up after a second server error", async () => {
    const { fetchImpl } = fakeGhl({ upsertStatus: [503, 503] });
    const result = await syncLeadToGhl(payload, options(fetchImpl));
    expect(result).toEqual({ synced: false, reason: "error" });
  });

  it("caches the custom field lookup", async () => {
    const { calls, fetchImpl } = fakeGhl();
    await syncLeadToGhl(payload, options(fetchImpl));
    await syncLeadToGhl(payload, options(fetchImpl));
    expect(calls.filter((c) => c.path.endsWith("/customFields"))).toHaveLength(1);
  });
});
