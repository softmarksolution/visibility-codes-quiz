import { syncLeadToGhl } from "@/lib/ghl";
import { createRateLimiter } from "@/lib/rateLimit";
import { processSubmission } from "@/lib/submission";

export const runtime = "nodejs";

const limiter = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!limiter.check(ip)) {
    return Response.json({ ok: false, error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  const result = await processSubmission(body, {
    siteUrl: siteUrl(request),
    sync: (payload) =>
      syncLeadToGhl(payload, { token: process.env.GHL_PRIVATE_TOKEN, locationId: process.env.GHL_LOCATION_ID }),
  });
  return Response.json(result.body, { status: result.status });
}

function siteUrl(request: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}
