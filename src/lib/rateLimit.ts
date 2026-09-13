// In-memory fixed-window limiter. Fine for a single Railway instance.

export function createRateLimiter(opts: { limit: number; windowMs: number; now?: () => number }) {
  const now = opts.now ?? Date.now;
  const hits = new Map<string, { start: number; count: number }>();

  return {
    check(key: string): boolean {
      const t = now();
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (t - v.start > opts.windowMs) hits.delete(k);
      }
      const entry = hits.get(key);
      if (!entry || t - entry.start > opts.windowMs) {
        hits.set(key, { start: t, count: 1 });
        return true;
      }
      entry.count += 1;
      return entry.count <= opts.limit;
    },
  };
}
