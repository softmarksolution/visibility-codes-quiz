import { createHash } from "node:crypto";

/** Public share code, e.g. "emma-3k9fz". Stable per email so retakes keep the same link. */
export function referralCode(firstName: string, email: string): string {
  const slug =
    firstName
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20) || "friend";
  const hash = createHash("sha256").update(email.trim().toLowerCase()).digest();
  const suffix = hash.readUInt32BE(0).toString(36).padStart(5, "0").slice(-5);
  return `${slug}-${suffix}`;
}

const REF_RE = /^[a-z0-9-]{3,40}$/;

/** Returns the incoming ?ref= value if it looks like one of our codes, else undefined. */
export function sanitizeRef(ref: unknown): string | undefined {
  if (typeof ref !== "string") return undefined;
  const value = ref.trim().toLowerCase();
  return REF_RE.test(value) ? value : undefined;
}
