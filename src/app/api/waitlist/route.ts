import { syncLeadToGhl } from "@/lib/ghl";
import { createRateLimiter } from "@/lib/rateLimit";

export const runtime = "nodejs";

/* The single tag this route owns. It is also the only tag passed as managed, so
   syncLeadToGhl can never remove a tag the quiz set — it only deletes managed
   tags that are absent from this payload, and this payload always contains it.
   NAME NOT YET CONFIRMED BY THE CLIENT. */
const WAITLIST_TAG = "masterclass-priority-waitlist";

const limiter = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!limiter.check(ip)) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  const input = body as { firstName?: unknown; email?: unknown };
  const firstName = typeof input.firstName === "string" ? input.firstName.trim().slice(0, 80) : "";
  const email = typeof input.email === "string" ? input.email.trim().slice(0, 200) : "";

  if (!firstName) return Response.json({ ok: false, error: "Please enter your first name." }, { status: 400 });
  if (!EMAIL.test(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const result = await syncLeadToGhl(
    {
      firstName,
      email,
      tags: [WAITLIST_TAG],
      managedTags: [WAITLIST_TAG],
      fields: {},
    },
    { token: process.env.GHL_PRIVATE_TOKEN, locationId: process.env.GHL_LOCATION_ID },
  );

  /* A missing CRM token must not look like a failed join to the visitor: the
     address is still valid and the page still confirms. The reason is logged by
     syncLeadToGhl itself. */
  return Response.json({ ok: true, synced: result.synced });
}
