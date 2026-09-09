/**
 * Trims the transparent margins off every can shot so equal boxes render equal cans.
 * The source PNGs on their site carry different padding, which is why six cans in a
 * row came out six different sizes. Runs in Chromium through tools/serve.mjs (a
 * file:// canvas is tainted and cannot export), reads each AVIF, finds the alpha
 * bounding box, crops with a 2% margin, scales to 540px tall, and writes lossy WebP
 * with alpha next to it. The AVIF is removed; build.mjs points cans at .webp.
 *
 *   cd C:/Users/hersh/Glazedweb/glazedweb && node C:/Users/hersh/Glazedweb/darkhorse/tools/trim-cans.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { loadChromium, launchOpts } = await import(pathToFileURL("C:/Users/hersh/Glazedweb/glazedweb/glaze/scripts/lib/browser.mjs").href);
const { start } = await import(pathToFileURL("C:/Users/hersh/Glazedweb/darkhorse/tools/serve.mjs").href);

const A = "C:/Users/hersh/Glazedweb/darkhorse/demo/assets";
const files = fs.readdirSync(A).filter((f) => /^(strip-|dh-|roak-|bd-|altes-|ga-).*\.avif$/.test(f));
const server = await start(4178);
const chromium = await loadChromium();
const browser = await chromium.launch({ headless: true, ...launchOpts() });
const page = await browser.newPage();
await page.goto("http://127.0.0.1:4178/demo/", { waitUntil: "load" });

const results = [];
for (const f of files) {
  const dataUrl = await page.evaluate(async (name) => {
    const blob = await (await fetch("/demo/assets/" + name)).blob();
    const bmp = await createImageBitmap(blob);
    const c = document.createElement("canvas"); c.width = bmp.width; c.height = bmp.height;
    const g = c.getContext("2d"); g.drawImage(bmp, 0, 0);
    const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
    let minX = width, minY = height, maxX = -1, maxY = -1;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    }
    if (maxX < 0) return null;
    const pad = Math.round((maxY - minY) * 0.02);
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad); maxX = Math.min(width - 1, maxX + pad); maxY = Math.min(height - 1, maxY + pad);
    const w = maxX - minX + 1, h = maxY - minY + 1, H = 540, W = Math.round(w * H / h);
    const o = document.createElement("canvas"); o.width = W; o.height = H;
    const og = o.getContext("2d"); og.imageSmoothingQuality = "high"; og.drawImage(bmp, minX, minY, w, h, 0, 0, W, H);
    return { url: o.toDataURL("image/webp", 0.84), from: [bmp.width, bmp.height], box: [w, h], out: [W, H] };
  }, f);
  if (!dataUrl) { results.push(f + " EMPTY"); continue; }
  const out = path.join(A, f.replace(/\.avif$/, ".webp"));
  fs.writeFileSync(out, Buffer.from(dataUrl.url.split(",")[1], "base64"));
  fs.unlinkSync(path.join(A, f));
  results.push(`${f.padEnd(28)} ${dataUrl.from.join("x")} -> box ${dataUrl.box.join("x")} -> ${dataUrl.out.join("x")}  ${Math.round(fs.statSync(out).size / 1024)}KB`);
}
await browser.close(); server.close();
console.log(results.join("\n"));
console.log(`trimmed ${files.length} cans`);
