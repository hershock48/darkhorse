/**
 * Renders the demo's link card and walks every demo page at 1280 and 390 through the
 * local server in tools/serve.mjs: page errors, console errors, horizontal overflow,
 * broken images, 404s, and for the homepage the total bytes transferred. Screenshots
 * go to --out. Run from the glazedweb repo so playwright-core resolves:
 *   cd C:/Users/hersh/Glazedweb/glazedweb && node C:/Users/hersh/Glazedweb/darkhorse/tools/render-demo.mjs --out <dir>
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const LIB = pathToFileURL("C:/Users/hersh/Glazedweb/glazedweb/glaze/scripts/lib/browser.mjs").href;
const { loadChromium, launchOpts, arg } = await import(LIB);
const { start } = await import(pathToFileURL("C:/Users/hersh/Glazedweb/darkhorse/tools/serve.mjs").href);

const ROOT = "C:/Users/hersh/Glazedweb/darkhorse";
const OUT = arg("out", path.join(ROOT, "tools/out-demo"));
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4177, BASE = `http://127.0.0.1:${PORT}`;
const server = await start(PORT);
const chromium = await loadChromium();
const browser = await chromium.launch({ headless: true, ...launchOpts() });
const summary = { pages: {} };

// 1. The demo card, the client's own.
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/demo/og-card.html`, { waitUntil: "load" });
  await page.waitForTimeout(300);
  const og = path.join(ROOT, "demo/assets/og.jpg");
  await page.screenshot({ path: og, type: "jpeg", quality: 84 });
  await page.screenshot({ path: path.join(OUT, "og-center-630.jpg"), type: "jpeg", quality: 84, clip: { x: 285, y: 0, width: 630, height: 630 } });
  summary.og = { bytes: fs.statSync(og).size };
  await page.close();
}

// 2. Every page, two widths.
const routes = ["/demo", "/demo/menu", "/demo/events", "/demo/mug-club", "/demo/family", "/demo/dark-horse", "/demo/roak", "/demo/brew-detroit", "/demo/altes", "/demo/great-america", "/demo/catering", "/demo/merch", "/demo/contact", "/demo/about"];
for (const [w, h, name] of [[1280, 900, "desk"], [390, 844, "phone"]]) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  // pre-accept the age gate for every page but the first, so the gate itself is screenshotted once
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [], failed = [];
    let bytes = 0, requests = 0;
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 140)); });
    page.on("response", async (r) => { requests++; if (r.status() >= 400) failed.push(r.status() + " " + r.url().replace(BASE, "")); try { const b = await r.body(); bytes += b.length; } catch {} });
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
    const slug = route.replace("/demo", "").replace(/^\//, "") || "home";
    if (route === "/demo") await page.screenshot({ path: path.join(OUT, `${name}-${slug}-gate.png`) });
    // accept the gate
    const yes = await page.$("#gateYes"); if (yes) { await yes.click(); await page.waitForTimeout(150); }
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const stops = route === "/demo" ? [0, 0.14, 0.3, 0.46, 0.62, 0.78, 0.94] : [0, 0.35, 0.7];
    for (let i = 0; i < stops.length; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * stops[i]));
      await page.waitForTimeout(220);
      await page.screenshot({ path: path.join(OUT, `${name}-${slug}-${i}.png`) });
    }
    await page.waitForTimeout(300);
    const m = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth,
      broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src")),
      h1: document.querySelector("h1")?.innerText, title: document.title,
      lcpImg: document.querySelector("img[fetchpriority=high]")?.getAttribute("src") || null,
      heroStatus: document.getElementById("heroStatus")?.innerText || null,
      venueLines: [...document.querySelectorAll("[data-venue] .today")].map((e) => e.innerText),
      eventsShown: document.querySelectorAll("[data-end]").length,
    }));
    summary.pages[`${name}${route}`] = { ...m, errors, failed, requests, kb: Math.round(bytes / 1024), overflow: m.scrollWidth > m.clientWidth };
    await page.close();
  }
  await context.close();
}
await browser.close(); server.close();
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
const bad = Object.entries(summary.pages).filter(([, v]) => v.errors.length || v.failed.length || v.overflow || v.broken.length);
console.log("og", summary.og.bytes, "bytes");
for (const [k, v] of Object.entries(summary.pages)) console.log(k.padEnd(28), String(v.kb).padStart(5) + "KB", String(v.requests).padStart(3) + " req", v.overflow ? "OVERFLOW " + v.scrollWidth : "", v.errors.length ? "ERR " + v.errors.length : "", v.failed.length ? "FAIL " + v.failed.join(",") : "", v.broken.length ? "BROKEN " + v.broken.join(",") : "");
console.log(bad.length ? `\n${bad.length} page renders need attention` : "\nall clean");
console.log("home status:", summary.pages["desk/demo"].heroStatus, "|", summary.pages["desk/demo"].venueLines.join(" | "));
