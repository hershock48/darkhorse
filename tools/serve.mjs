/**
 * Local static server that mirrors vercel.json: / is the proposal, cleanUrls resolve
 * /demo/menu to demo/menu.html, /demo to demo/index.html. No dependencies.
 *   node tools/serve.mjs            (port 4177)
 * Used by tools/render-demo.mjs in-process; also handy for a look in a real browser.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".ics": "text/calendar; charset=utf-8", ".json": "application/json" };

export function resolve(urlPath) {
  let u = decodeURIComponent(urlPath.split("?")[0]);
  if (u === "/") return path.join(ROOT, "pitch/darkhorse/index.html");
  const candidates = [u, u + ".html", u + "/index.html"].map((c) => path.join(ROOT, c));
  for (const c of candidates) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  return null;
}

export function start(port = 4177) {
  return new Promise((ok) => {
    const server = http.createServer((req, res) => {
      const f = resolve(req.url);
      if (!f) { res.writeHead(404, { "content-type": "text/plain" }); return res.end("404 " + req.url); }
      res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream", "x-robots-tag": "noindex, nofollow" });
      fs.createReadStream(f).pipe(res);
    });
    server.listen(port, "127.0.0.1", () => ok(server));
  });
}

if (process.argv[1] && /serve\.mjs$/.test(process.argv[1])) {
  const s = await start(4177);
  console.log("serving", ROOT, "on http://127.0.0.1:4177  (Ctrl+C to stop)");
  process.on("SIGINT", () => { s.close(); process.exit(0); });
}
