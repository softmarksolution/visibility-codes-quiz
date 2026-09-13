import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rateLimit";

describe("createRateLimiter", () => {
  it("allows up to the limit per key within the window, then blocks", () => {
    let now = 0;
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => now });
    expect([limiter.check("a"), limiter.check("a"), limiter.check("a")]).toEqual([true, true, true]);
    expect(limiter.check("a")).toBe(false);
    expect(limiter.check("b")).toBe(true);
    now = 1001;
    expect(limiter.check("a")).toBe(true);
  });
});
