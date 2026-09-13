import { describe, expect, it } from "vitest";
import { referralCode } from "./referral";

describe("referralCode", () => {
  it("is first-name slug plus 5 hash characters", () => {
    expect(referralCode("Emma", "emma@example.com")).toMatch(/^emma-[a-z0-9]{5}$/);
  });

  it("is stable across email case and whitespace", () => {
    expect(referralCode("Emma", " EMMA@example.com ")).toBe(referralCode("Emma", "emma@example.com"));
  });

  it("differs for different emails", () => {
    expect(referralCode("Emma", "emma@example.com")).not.toBe(referralCode("Emma", "emma2@example.com"));
  });

  it("strips accents, spaces and symbols from the name", () => {
    expect(referralCode("Zoë Ann-Marie!", "z@example.com")).toMatch(/^zoeannmarie-[a-z0-9]{5}$/);
  });

  it("falls back when the name has no usable characters", () => {
    expect(referralCode("李", "l@example.com")).toMatch(/^friend-[a-z0-9]{5}$/);
  });
});
