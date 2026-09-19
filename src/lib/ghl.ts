// Minimal GoHighLevel (LeadConnector v2) client for the quiz submission.

const BASE_URL = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";
const FIELD_CACHE_MS = 10 * 60 * 1000;

/** Text/number fields take a single value; checkbox fields take an array of option labels. */
export type GhlFieldValue = string | number | string[];

export interface GhlLeadPayload {
  firstName: string;
  /** Only the opt-in asks for a surname, and only when the visitor typed one. */
  lastName?: string;
  email: string;
  /** Taken at the opt-in. Omitted rather than sent empty, so a later sync that
      has no phone can never blank the number the opt-in already stored. */
  phone?: string;
  /** Tags for this attempt. */
  tags: string[];
  /** Every tag the quiz can set; used to remove tags left over from an earlier attempt. */
  managedTags: readonly string[];
  /** Custom field values keyed by field key without the "contact." prefix. */
  fields: Record<string, GhlFieldValue | undefined>;
}

export type SyncResult =
  | { synced: true; contactId: string }
  | { synced: false; reason: "not_configured" | "error" };

export interface GhlOptions {
  token: string | undefined;
  locationId: string | undefined;
  fetchImpl?: typeof fetch;
  logger?: Pick<Console, "warn" | "error">;
  retryDelayMs?: number;
}

class GhlError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

let fieldCache: { locationId: string; at: number; ids: Map<string, string> } | undefined;

export function clearFieldCache() {
  fieldCache = undefined;
}

export async function syncLeadToGhl(payload: GhlLeadPayload, opts: GhlOptions): Promise<SyncResult> {
  const { token, locationId } = opts;
  const logger = opts.logger ?? console;
  if (!token || !locationId) {
    logger.warn("[ghl] GHL_PRIVATE_TOKEN or GHL_LOCATION_ID not set; skipping sync");
    return { synced: false, reason: "not_configured" };
  }

  const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
    const doFetch = opts.fetchImpl ?? fetch;
    const attempt = async () => {
      const res = await doFetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Version: API_VERSION,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new GhlError(`${method} ${path} failed with ${res.status}: ${text.slice(0, 300)}`, res.status);
      }
      return (await res.json()) as T;
    };
    try {
      return await attempt();
    } catch (err) {
      const retryable = !(err instanceof GhlError) || err.status >= 500 || err.status === 429;
      if (!retryable) throw err;
      await new Promise((r) => setTimeout(r, opts.retryDelayMs ?? 800));
      return attempt();
    }
  };

  try {
    const fieldIds = await loadFieldIds(locationId, request);
    const missing: string[] = [];
    const customFields: { id: string; field_value: GhlFieldValue }[] = [];
    for (const [key, value] of Object.entries(payload.fields)) {
      if (value === undefined) continue;
      const id = fieldIds.get(key);
      if (id) customFields.push({ id, field_value: value });
      else missing.push(key);
    }
    if (missing.length) {
      logger.warn(`[ghl] custom fields not found in location, skipped: ${missing.join(", ")}`);
    }

    const { contact } = await request<{ contact: { id: string; tags?: string[] } }>("POST", "/contacts/upsert", {
      locationId,
      firstName: payload.firstName,
      ...(payload.lastName ? { lastName: payload.lastName } : {}),
      email: payload.email,
      ...(payload.phone ? { phone: payload.phone } : {}),
      source: "Visibility Codes Quiz",
      customFields,
    });

    // GHL stores tags lowercase.
    const managed = new Set(payload.managedTags.map((t) => t.toLowerCase()));
    const current = new Set(payload.tags.map((t) => t.toLowerCase()));
    const stale = (contact.tags ?? []).filter((t) => managed.has(t.toLowerCase()) && !current.has(t.toLowerCase()));
    if (stale.length) await request("DELETE", `/contacts/${contact.id}/tags`, { tags: stale });
    await request("POST", `/contacts/${contact.id}/tags`, { tags: payload.tags });

    return { synced: true, contactId: contact.id };
  } catch (err) {
    logger.error("[ghl] sync failed", err);
    return { synced: false, reason: "error" };
  }
}

async function loadFieldIds(
  locationId: string,
  request: <T>(method: string, path: string) => Promise<T>,
): Promise<Map<string, string>> {
  if (fieldCache && fieldCache.locationId === locationId && Date.now() - fieldCache.at < FIELD_CACHE_MS) {
    return fieldCache.ids;
  }
  const data = await request<{ customFields?: { id: string; fieldKey?: string }[] }>(
    "GET",
    `/locations/${locationId}/customFields?model=contact`,
  );
  const ids = new Map<string, string>();
  for (const f of data.customFields ?? []) {
    if (f.fieldKey) ids.set(f.fieldKey.replace(/^contact\./, ""), f.id);
  }
  fieldCache = { locationId, at: Date.now(), ids };
  return ids;
}
