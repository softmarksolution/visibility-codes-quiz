/**
 * Phone formatting for the one place we store a number: the opt-in lead sent to
 * GoHighLevel.
 *
 * US/Canada (NANP) numbers are normalised to `+1 (XXX) XXX-XXXX` so the CRM
 * holds one shape rather than whatever each visitor typed. Everything else is
 * left exactly as given — this audience is largely Australian, and an
 * Australian mobile is also ten digits, so coercing every ten-digit number to
 * NANP would silently rewrite real numbers into unreachable ones. The guard is
 * the area code: NANP area codes never begin with 0 or 1, while Australian
 * numbers written locally always start with a 0.
 */

/** Strips a NANP number to its ten national digits, or returns null. */
function nanpDigits(raw: string): string | null {
  // An explicit non-US country code is somebody else's number; leave it alone.
  if (/^\+(?!1\b)/.test(raw.trim())) return null;
  const digits = raw.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (national.length !== 10) return null;
  // Area code and exchange code both run 2-9 in the NANP.
  if (!/^[2-9]\d\d[2-9]/.test(national)) return null;
  return national;
}

/**
 * `+1 (347) 428-0292` for a complete NANP number; the input untouched (only
 * trimmed) for anything else, including partial input and international numbers.
 */
export function formatUsPhone(raw: string): string {
  const national = nanpDigits(raw);
  if (!national) return raw.trim();
  return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
}
