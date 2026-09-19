import { describe, expect, it } from "vitest";
import { formatUsPhone } from "./phone";

describe("formatUsPhone", () => {
  it("formats a ten-digit US number", () => {
    expect(formatUsPhone("3474280292")).toBe("+1 (347) 428-0292");
  });

  it("formats an eleven-digit number that already carries the 1", () => {
    expect(formatUsPhone("13474280292")).toBe("+1 (347) 428-0292");
    expect(formatUsPhone("+1 347-428-0292")).toBe("+1 (347) 428-0292");
  });

  it("ignores punctuation and spacing in the input", () => {
    expect(formatUsPhone(" (347) 428.0292 ")).toBe("+1 (347) 428-0292");
  });

  it("leaves an explicit non-US country code untouched", () => {
    expect(formatUsPhone("+61 412 345 678")).toBe("+61 412 345 678");
    expect(formatUsPhone("+44 20 7946 0958")).toBe("+44 20 7946 0958");
  });

  /* The reason this helper is not simply "ten digits means NANP": this audience
     is Australian, and an Australian mobile written locally is ten digits too. */
  it("leaves an Australian mobile alone even though it is ten digits", () => {
    expect(formatUsPhone("0412345678")).toBe("0412345678");
    expect(formatUsPhone("0412 345 678")).toBe("0412 345 678");
  });

  it("leaves partial or malformed input alone", () => {
    expect(formatUsPhone("347428")).toBe("347428");
    expect(formatUsPhone("")).toBe("");
    expect(formatUsPhone("not a phone")).toBe("not a phone");
  });

  it("does not treat an invalid area or exchange code as NANP", () => {
    expect(formatUsPhone("1112223333")).toBe("1112223333");
    expect(formatUsPhone("3471280292")).toBe("3471280292");
  });
});
