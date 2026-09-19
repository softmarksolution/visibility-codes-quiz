import { syncLeadToGhl } from "@/lib/ghl";
import { formatUsPhone } from "@/lib/phone";
import { OPTIN_TAG } from "@/lib/quiz/tags";
import { createRateLimiter } from "@/lib/rateLimit";

export const runtime = "nodejs";

/* The opt-in pop-up used to save name, email and phone to localStorage and
   nothing else, so anyone who opted in and then abandoned the quiz never
   reached the CRM at all — and the phone number was collected and thrown away.
   This route captures that lead the moment the pop-up is submitted.

   OPTIN_TAG is the only tag passed as managed, so this sync can never remove a
   tag the completed quiz set: syncLeadToGhl only deletes managed tags that are
   absent from the payload, and this payload always contains it. */

const limiter = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
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

  const input = body as { name?: unknown; email?: unknown; phone?: unknown };
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ").slice(0, 120) : "";
  const email = typeof input.email === "string" ? input.email.trim().slice(0, 200) : "";
  const phone = typeof input.phone === "string" ? formatUsPhone(input.phone.slice(0, 40)) : "";

  if (!name) return Response.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!EMAIL.test(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  /* The pop-up asks for one "Name". Splitting on the first space keeps GHL's
     first-name merge field usable in emails ("Hi Katrina," not "Hi Katrina
     Kavvalos,") and matches the first name the unlock form asks for later, so
     the two syncs agree rather than overwriting each other. */
  const [firstName = name, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  const result = await syncLeadToGhl(
    {
      firstName,
      ...(lastName ? { lastName } : {}),
      email,
      ...(phone ? { phone } : {}),
      tags: [OPTIN_TAG],
      managedTags: [OPTIN_TAG],
      fields: {},
    },
    { token: process.env.GHL_PRIVATE_TOKEN, locationId: process.env.GHL_LOCATION_ID },
  );

  /* A CRM that is down or unconfigured must never block the quiz: the visitor
     has given their details and is entitled to the questions either way. The
     reason is logged by syncLeadToGhl itself. */
  return Response.json({ ok: true, synced: result.synced });
}
