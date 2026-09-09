/**
 * The taproom board, read from Untappd for Business.
 *
 * Their board (business.untappd.com/app/boards/64669) is server-rendered with the whole
 * board as JSON inside a data-react-props attribute. This reads that page, parses the
 * JSON, and returns the pours in the shape data.mjs uses, so the build can bake the
 * latest board and /api/taps can serve it live. Used by build.mjs, api/taps.js and
 * tools/serve.mjs.
 *
 * On the real build this is the Untappd for Business API with the client's own token,
 * which returns the same fields without parsing a page. Reading the public board is the
 * demo's path; it is their board and their data.
 */
const BOARD = "https://business.untappd.com/app/boards/64669";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36";
const BRAND = [[/dark horse/i, "Dark Horse"], [/roak/i, "ROAK"], [/altes/i, "Altes"], [/brew detroit/i, "Brew Detroit"], [/great america/i, "Great America"]];

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const brandOf = (b) => (BRAND.find(([re]) => re.test(b || "")) || [, b || ""])[1];
const price = (p) => { const n = Number(p); return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`; };

export async function fetchTaps({ timeoutMs = 8000 } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(BOARD, { headers: { "user-agent": UA, accept: "text/html" }, signal: ctl.signal });
    if (!res.ok) throw new Error(`board ${res.status}`);
    const html = await res.text();
    const at = html.indexOf('data-react-props="');
    if (at < 0) throw new Error("board markup changed: no data-react-props");
    const start = at + 'data-react-props="'.length;
    const end = html.indexOf('"', start);
    const board = JSON.parse(decode(html.slice(start, end))).board;
    const menu = (board.menus || [])[0];
    if (!menu) throw new Error("board has no menus");
    const pours = [];
    for (const sec of menu.sections || []) for (const it of sec.items || []) {
      if (it.hidden) continue;
      pours.push({
        brand: brandOf(it.brewery),
        name: it.name,
        style: it.short_style || it.style || "",
        abv: it.abv ? `${String(it.abv).replace(/\.0$/, "")}%` : "",
        ibu: it.ibu && Number(it.ibu) ? String(Math.round(Number(it.ibu))) : "",
        tap: it.tap_number || null,
        section: sec.name,
        label: it.label_image_thumb || null,
        prices: (it.containers || []).map((c) => `${(c.name || "").replace(/ Draft$/, "")} ${price(c.price)}`),
      });
    }
    return { name: board.name, menu: menu.name, updatedAt: menu.updated_at, fetchedAt: new Date().toISOString(), pours };
  } finally { clearTimeout(t); }
}

export const asOfLabel = (iso) => new Intl.DateTimeFormat("en-US", { timeZone: "America/Detroit", month: "long", day: "numeric", year: "numeric" }).format(new Date(iso));
