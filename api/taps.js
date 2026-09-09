// GET /api/taps: the taproom board, live from Untappd, cached at the edge for five minutes.
// Vercel serves this beside the static pages; site.js swaps the baked snapshot for it.
import { fetchTaps } from "../demo/taps.mjs";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex");
  try {
    const taps = await fetchTaps({ timeoutMs: 9000 });
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(200).end(JSON.stringify(taps));
  } catch (e) {
    res.setHeader("Cache-Control", "public, s-maxage=60");
    res.status(502).end(JSON.stringify({ error: String(e && e.message || e) }));
  }
}
