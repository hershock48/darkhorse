/**
 * Builds the Dark Horse demo: fourteen static pages and one .ics per event, from data.mjs.
 *
 *   node demo/build.mjs
 *
 * Why a generator and not hand-written pages: the weekday under every event is DERIVED
 * from its ISO date here, the hours print from one table, and a price lives in one place.
 * Their current site shows "Saturday" shows on a Monday because a human typed both.
 * The output HTML is committed, so the pages stay hand-editable in a pinch.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site, venues, events, tapSnapshot, menu, breakfast, brands, catering, mugClub, story } from "./data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const B = site.base, A = `${B}/assets`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Asset extensions follow how each was pulled (see the download notes in the README):
// cans, marks, posters and the logo are AVIF with alpha; the one PNG-sourced photo is JPEG; photos are WebP.
const ext = (n) => /^(strip-|dh-|roak-|bd-|altes-|ga-|brand-|ev-|logo$)/.test(n) ? "avif" : n === "brew-detroit-glass" ? "jpg" : "webp";
const src = (n) => `${A}/${n}.${ext(n)}`;
const money = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
const TZ = "America/Detroit";
const dayFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
const when = (e) => {
  const s = new Date(e.start), en = new Date(e.end);
  const t = (d) => timeFmt.format(d).replace(":00", "");
  return { day: dayFmt.format(s), time: `${t(s)} to ${t(en)}` };
};
const built = new Date();

const nav = [["Menu", "/menu"], ["Events", "/events"], ["Beer", "/family"], ["Mug Club", "/mug-club"], ["Catering", "/catering"], ["Merch", "/merch"], ["Contact", "/contact"]];

function shell({ path: p, title, desc, body, schema, current, image }) {
  const url = `${site.origin}${B}${p === "/" ? "" : p}`;
  const links = (cls) => nav.map(([t, h]) => `<a href="${B}${h}"${current === h ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="noindex,nofollow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.origin}${A}/${image || "og"}.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${site.name}, Marshall, Michigan">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0a0a0a">
<link rel="icon" href="${A}/icon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${A}/icon-180.png">
<link rel="stylesheet" href="${B}/site.css">
${schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ""}
</head><body>
<a class="btn sm" href="#main" style="position:absolute;left:-9999px;top:8px" onfocus="this.style.left='12px'" onblur="this.style.left='-9999px'">Skip to content</a>
<header class="top"><div class="wrap">
  <a class="logo" href="${B}/"><img src="${src("logo")}" alt="" width="46" height="46"><b>Dark Horse<span>Brewing Co. · Marshall</span></b></a>
  <nav class="main" aria-label="Main">${links()}<a class="btn sm" href="${site.order}" rel="noopener">Order carryout</a></nav>
  <details class="mnav"><summary aria-label="Menu">Menu</summary><div class="sheet">${links()}<a class="btn" href="${site.order}" rel="noopener">Order carryout</a><a class="btn ghost" href="tel:+1${site.phone.replace(/\D/g, "")}">Call ${site.phone}</a></div></details>
</div></header>
<main id="main">
${body}
</main>
<footer class="foot"><div class="wrap">
  <div class="grid g4">
    <div><b>Find us</b>${site.address.street}<br>${site.address.city}, ${site.address.state} ${site.address.zip}<br><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${site.address.street} ${site.address.city} ${site.address.state} ${site.address.zip}`)}" rel="noopener">Directions</a></div>
    <div><b>Talk to us</b><a href="tel:+1${site.phone.replace(/\D/g, "")}">${site.phone}</a><br>Beer to go and Commons orders: ext. 2<br><a href="mailto:${site.email}">${site.email}</a></div>
    <div><b>Hours</b>${venues.map((v) => `<span style="display:block;margin-bottom:6px"><span style="color:var(--ink2)">${v.name}.</span> ${v.line}</span>`).join("")}</div>
    <div><b>Follow</b><a href="${site.instagram}" rel="noopener">Instagram</a><br><a href="${site.facebook}" rel="noopener">Facebook</a><br><a href="${site.untappd}" rel="noopener">Untappd</a></div>
  </div>
  <div class="legal"><span>© ${built.getFullYear()} ${site.legal}. 511 S. Kalamazoo Ave., Marshall, Michigan.</span><span class="credit">Demo build. <a href="https://glazedweb.com" rel="noopener">Double Dipped by Glazed Web</a>.</span></div>
</div></footer>
<script>${JSON.stringify(venues)}</script>
<script src="${B}/site.js" defer></script>
</body></html>`;
}
// The hours table rides along as a JSON script so site.js reads the same table the footer prints.
const hoursScript = () => `<script type="application/json" id="hours">${JSON.stringify(venues)}</script>`;

const priceCell = (it) => it.variants
  ? `<span class="p">${it.variants.map(([l, p]) => `${money(p)}<small>${esc(l)}</small>`).join("")}</span>`
  : it.price ? `<span class="p">${money(it.price)}</span>` : `<span class="p"></span>`;
const itemHTML = (it) => `<div class="item"><span class="n">${esc(it.name)}${(it.tags || []).map((t) => ` <span class="tag gf">${t}</span>`).join("")}</span>${priceCell(it)}${it.desc ? `<span class="d">${esc(it.desc)}</span>` : ""}</div>`;
const pageHero = (k, h, lead) => `<section class="page-hero"><div class="wrap"><div class="k">${k}</div><h1>${h}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}</div></section>`;
const venueCards = () => `<div class="grid g3">${venues.map((v) => `<div class="card venue" data-venue="${v.key}"><div class="k">${v.name}</div><span class="chip closed"><span class="dot"></span>Hours</span><div class="today">${esc(v.line.split(".")[0])}</div><div class="line">${esc(v.line)}</div>${v.orderNote ? `<div class="note">${esc(v.orderNote)}</div>` : ""}</div>`).join("")}</div>`;
const eventCard = (e, big) => { const w = when(e); return `<article class="ev card" data-end="${e.end}"><img src="${src(e.poster)}" alt="" width="120" height="120" loading="lazy"><div><div class="when"><time datetime="${e.start}">${w.day}</time> · ${w.time}</div><h3>${esc(e.title)}</h3><div class="where">${esc(e.where)}</div>${big ? `<p>${esc(e.blurb)}</p>` : ""}<div class="row">${e.price ? `<span class="tag">Tickets ${money(e.price)}</span>` : `<span class="tag">Free, no ticket needed</span>`}<a class="small" href="${B}/events/${e.slug}.ics">Add to calendar</a></div></div></article>`; };
const upcoming = events.filter((e) => new Date(e.end) > built).sort((a, b) => a.start.localeCompare(b.start));

const baseSchema = {
  "@context": "https://schema.org", "@type": ["Brewery", "Restaurant"], name: site.name, url: `${site.origin}${B}/`, telephone: "+1-" + site.phone,
  image: `${site.origin}${A}/hero-general-store.webp`, servesCuisine: "American", priceRange: "$$", foundingDate: String(site.founded),
  address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.state, postalCode: site.address.zip, addressCountry: "US" },
  hasMenu: `${site.origin}${B}/menu`, sameAs: [site.instagram, site.facebook, site.untappd],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "11:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "11:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "11:00", closes: "21:00" },
  ],
};

const pages = [];

/* ---------------- home ---------------- */
pages.push({ path: "/", title: "Dark Horse Brewing Co. · Brewery, taproom and beer garden in Marshall, Michigan", desc: "Independent since 1997. Wood-fired pizza, breakfast Thursday to Sunday, live music in the Beer Garten, and a 4,800-mug Mug Club. 511 S. Kalamazoo Ave., Marshall.", current: "/", schema: baseSchema, body: `
<section class="hero" style="padding:0;border:0">
  <img class="bg" src="${A}/hero-general-store.webp" srcset="${A}/hero-general-store-800.webp 800w, ${A}/hero-general-store.webp 1800w" sizes="100vw" alt="The Dark Horse General Store in Marshall, a mint green pickup parked out front" width="1800" height="760" fetchpriority="high">
  <div class="wrap">
    <span class="chip closed status" id="heroStatus"><span class="dot"></span>Taproom hours: Sun 11 to 9, Mon to Thu 11 to 10, Fri and Sat 11 to 11</span>
    <div class="k">Marshall, Michigan · Independent since 1997</div>
    <h1>A new breed.</h1>
    <p class="lead">For nearly 30 years, Dark Horse has been a staple of Michigan craft beer. The grounds have kept growing: a bigger beer lineup, a real kitchen, a market, a general store, and a beer garden with a stage. More than a brewery. A place where everyone is welcome.</p>
    <div class="cta"><a class="btn" href="${B}/menu">See the menu</a><a class="btn ghost" href="${B}/menu#tap">What's on tap</a><a class="btn ghost" href="${B}/events">Live music</a></div>
  </div>
</section>
<section class="band" style="border:0"><img class="bg" src="${A}/green-building.webp" alt="" width="1200" height="520" loading="lazy"><div class="wrap">
  <div class="k">Open right now?</div><h2>Three doors, one answer.</h2>
  ${hoursScript()}${venueCards()}
  <p class="small mute" style="margin-top:14px">Status is computed from the clock in Marshall. Holiday hours would be set once and show up here, in the footer, and on Google.</p>
</div></section>
<section><div class="wrap">
  <div class="grid g2" style="align-items:center;gap:40px">
    <div><div class="k">Pouring now</div><h2>On tap today.</h2><p class="lead">Snapshot of the taproom board, ${tapSnapshot.asOf}. The live site reads the board itself, so this list is never older than the last pour.</p><a class="btn ghost" href="${B}/menu#tap">Full tap list</a></div>
    <div class="taps">${tapSnapshot.pours.slice(0, 4).map((p) => `<div class="tap"><div><b>${esc(p.name)}</b><div class="meta">${esc(p.brand)} · ${esc(p.style)} · ${p.abv}</div></div><div class="prices">${p.prices.join(" · ")}</div></div>`).join("")}</div>
  </div>
</div></section>
<section><div class="wrap">
  <div class="k">The family</div><h2>Five labels, one brewhouse.</h2>
  <p class="lead">Dark Horse, ROAK, Brew Detroit, Altes, and Great America, all brewed in Marshall.</p>
  <div class="marks">${brands.map((b) => `<a href="${B}/${b.slug}" aria-label="${esc(b.name)}"><img src="${src(b.mark)}" alt="${esc(b.name)}" width="180" height="64" loading="lazy"></a>`).join("")}</div>
  <div class="cans">${["strip-crooked-tree", "strip-limonata", "strip-devil-dog", "strip-cerveza-delray", "strip-altes", "strip-ga-lemonade"].map((c) => `<img src="${src(c)}" alt="" width="133" height="200" loading="lazy">`).join("")}</div>
</div></section>
<section><div class="wrap">
  <div class="k">In the Beer Garten</div><h2>Coming up.</h2>
  <div class="grid g3">${upcoming.slice(0, 3).map((e) => eventCard(e)).join("")}</div>
  <p class="empty">Nothing on the calendar right now. Check back soon.</p>
  <p style="margin-top:18px"><a class="btn ghost" href="${B}/events">All events</a></p>
</div></section>
<section class="band" style="border:0"><img class="bg" src="${A}/mug-wall.webp" alt="" width="1600" height="640" loading="lazy"><div class="wrap">
  <div class="k">Mug Club</div><h2>${site.mugClubCount} mugs on the wall.</h2>
  <p class="lead">Handmade, numbered, and hanging in a spot you know by heart. New mugs drop once a year in December and people camp out for them. Renew online in a minute, or get on the December list.</p>
  <div class="cta" style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="${B}/mug-club">Renew my mug</a><a class="btn ghost" href="${B}/mug-club#join">Get on the December list</a></div>
</div></section>
<section><div class="wrap">
  <div class="grid g2" style="gap:40px;align-items:center">
    <img src="${A}/commons.webp" alt="The Dark Horse Commons storefront, taproom and market signs on the wood siding" width="1200" height="520" loading="lazy" style="border-radius:14px">
    <div><div class="k">Commons Market</div><h2>Breakfast, Thursday to Sunday.</h2><p class="lead">Biscuits and gravy, chicken and waffles, plate-sized pancakes, from 7 to 11 AM. Then the market runs until 8 every day.</p><div class="cta" style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn ghost" href="${B}/menu#breakfast">Breakfast menu</a><a class="btn ghost" href="tel:+1${site.phone.replace(/\D/g, "")}">Call ext. 2 to order</a></div></div>
  </div>
</div></section>
<section><div class="wrap">
  <div class="k">@darkhorsebrewco</div><h2>Lately.</h2>
  <div class="ig">${[1, 2, 3, 4, 5, 6].map((i) => `<a href="${site.instagram}" rel="noopener" aria-label="Dark Horse on Instagram"><img src="${A}/ig-${i}.webp" alt="" width="480" height="480" loading="lazy"></a>`).join("")}</div>
  <p class="small mute" style="margin-top:12px">Six photos, not eight video players. The live site pulls the latest six from Instagram once an hour and serves them from here.</p>
</div></section>` });

/* ---------------- menu ---------------- */
const menuSchema = { "@context": "https://schema.org", "@type": "Menu", name: "Dark Horse taproom menu", url: `${site.origin}${B}/menu`, hasMenuSection: menu.map((s) => ({ "@type": "MenuSection", name: s.name, hasMenuItem: s.items.map((it) => ({ "@type": "MenuItem", name: it.name, description: it.desc || undefined, offers: it.price ? { "@type": "Offer", price: String(it.price), priceCurrency: "USD" } : undefined })) })).concat([{ "@type": "MenuSection", name: "Commons breakfast", hasMenuItem: breakfast.map((it) => ({ "@type": "MenuItem", name: it.name, description: it.desc })) }]) };
pages.push({ path: "/menu", title: "Menu · Dark Horse Brewing Co.", desc: "The taproom menu, wood-fired pizza, calzones, sandwiches, and the Commons breakfast, Thursday to Sunday 7 to 11 AM. Plus what's on tap.", current: "/menu", schema: menuSchema, body: `
${pageHero("Taproom · Commons Market", "The menu.", "Kitchen closes an hour before the taproom. Breakfast at the Commons, Thursday to Sunday, 7 to 11 AM. Gluten free options marked; ask your server.")}
<div class="subnav"><div class="wrap">${menu.map((s) => `<a href="#${s.id}">${s.name}</a>`).join("")}<a href="#breakfast">Breakfast</a><a href="#tap">On tap</a></div></div>
<div class="wrap" style="padding-top:8px"><div style="display:flex;gap:12px;flex-wrap:wrap;padding:18px 0"><a class="btn" href="${site.order}" rel="noopener">Order carryout</a><a class="btn ghost" href="tel:+1${site.phone.replace(/\D/g, "")}">Call ${site.phone}</a></div></div>
${menu.map((s) => `<section class="menu-sec" id="${s.id}"><div class="wrap"><h2>${s.name}</h2>${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}<div class="items">${s.items.map(itemHTML).join("")}</div></div></section>`).join("")}
<section class="menu-sec" id="breakfast"><div class="wrap"><div class="k">Commons Market</div><h2>Breakfast.</h2><p class="note">Thursday to Sunday, 7 to 11 AM. Call ${site.phoneExt2} to order ahead.</p><div class="items">${breakfast.map(itemHTML).join("")}</div></div></section>
<section class="menu-sec" id="tap"><div class="wrap"><div class="k">Taproom board</div><h2>On tap.</h2><p class="note">Snapshot of the board on ${tapSnapshot.asOf}. On the live site this is the board, read from Untappd every few minutes, in your type instead of theirs.</p>
<div class="taps">${tapSnapshot.pours.map((p) => `<div class="tap"><div><b>${esc(p.name)}</b><div class="meta">${esc(p.brand)} · ${esc(p.style)} · ${p.abv}</div></div><div class="prices">${p.prices.join(" · ")}</div></div>`).join("")}</div>
<p style="margin-top:16px"><a class="btn ghost" href="${site.untappd}" rel="noopener">Check in on Untappd</a></p></div></section>` });

/* ---------------- events ---------------- */
const eventSchema = { "@context": "https://schema.org", "@graph": upcoming.map((e) => ({ "@type": "Event", name: e.title, startDate: e.start, endDate: e.end, description: e.blurb, image: `${site.origin}${src(e.poster)}`, eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: `Dark Horse Brewing Co., ${e.where}`, address: baseSchema.address }, organizer: { "@type": "Organization", name: site.name, url: `${site.origin}${B}/` }, offers: { "@type": "Offer", price: String(e.price), priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${site.origin}${B}/events` }, isAccessibleForFree: !e.price })) };
pages.push({ path: "/events", title: "Events and live music · Dark Horse Brewing Co.", desc: "Live music Thursdays and Saturdays in the Beer Garten, the Garten Market, Oktoberfest, and the rest of the calendar. Free shows say so.", current: "/events", schema: eventSchema, body: `
${pageHero("Beer Garten", "What's on.", "Live music most Thursdays and Saturdays. The day under each show comes from the date, so it cannot disagree with it. Free shows say free; nobody has to open a checkout to find out.")}
<section style="padding-top:10px"><div class="wrap"><div class="grid g2">${upcoming.map((e) => eventCard(e, true)).join("")}</div><p class="empty">Nothing on the calendar right now. Check back soon.</p>
<div class="demo-note"><b>How this stays right.</b> Past shows drop off on their own. A new show is one form in the workroom: title, date, time, free or ticketed. The weekday, the calendar file, and the Google event listing are all generated from that.</div></div></section>` });

/* ---------------- mug club ---------------- */
pages.push({ path: "/mug-club", title: "Mug Club · Dark Horse Brewing Co.", desc: `More than ${site.mugClubCount} handmade mugs on the taproom wall. Renew online, or get on the list for the December release.`, current: "/mug-club", body: `
<section class="hero" style="min-height:52vh;padding:0;border:0"><img class="bg" src="${A}/mug-wall.webp" alt="Rows of handmade ceramic mugs hanging from the taproom ceiling" width="1600" height="640" fetchpriority="high"><div class="wrap"><div class="k">Mug Club</div><h1>${site.mugClubCount} mugs. Every one has a name.</h1></div></section>
<section><div class="wrap"><div class="grid g2" style="gap:40px">
  <div><p class="lead">${esc(mugClub.intro)}</p><p>${esc(mugClub.release)}</p>
    <h3 style="margin-top:22px">How it works</h3>
    <p class="mute">Your mug is yours. It hangs in its spot in the taproom, and members drink from it every visit. Renew each year to keep it on the wall. New mugs are released once a year in December, and the list below is how you hear about it first.</p>
    <div class="demo-note"><b>Before launch.</b> Annual price and member perks are not published anywhere on the current site, so they are not invented here. Two facts from Dark Horse and they print in this space, on the homepage, and in the renewal receipt.</div>
  </div>
  <div class="card" style="padding:26px">
    <div class="tabs" role="tablist"><button role="tab" aria-controls="renew" aria-selected="true">Renew my mug</button><button role="tab" aria-controls="join" aria-selected="false">December list</button></div>
    <div class="panel" id="renew" role="tabpanel"><h3>Renew</h3><p class="mute small">Takes about a minute. Card on file if you want it, so next year is one tap.</p>
      <form class="f" data-demo="renew" data-out="renew-out"><label class="fl">Name<input name="name" required autocomplete="name"></label><label class="fl">Mug number<input name="member" inputmode="numeric" placeholder="On the bottom of your mug"></label><label class="fl">Email<input name="email" type="email" required autocomplete="email"></label><label class="fl">Phone (for the December text)<input name="phone" type="tel" autocomplete="tel"></label><button class="btn" type="submit">Continue to payment</button></form>
      <div class="confirm" id="renew-out" hidden></div>
    </div>
    <div class="panel" id="join" role="tabpanel" hidden><h3>The December list</h3><p class="mute small">First to hear the release date, the count, and the line rules.</p>
      <form class="f" data-demo="join" data-out="join-out"><label class="fl">Name<input name="name" required autocomplete="name"></label><label class="fl">Email<input name="email" type="email" required autocomplete="email"></label><label class="fl">Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label><button class="btn" type="submit">Put me on the list</button></form>
      <div class="confirm" id="join-out" hidden></div>
    </div>
    <p class="small mute" style="margin-top:16px;margin-bottom:0">Rather talk to a person? Ask at the taproom or email <a href="mailto:${site.email}">${site.email}</a>.</p>
  </div>
</div></div></section>` });

/* ---------------- family and brands ---------------- */
pages.push({ path: "/family", title: "Family of brands · Dark Horse Brewing Co.", desc: "Dark Horse, ROAK, Brew Detroit, Altes, and Great America. Five labels, one brewhouse in Marshall.", current: "/family", body: `
<section class="hero" style="min-height:50vh;padding:0;border:0"><img class="bg" src="${src("brew-detroit-glass")}" alt="A Brew Detroit pint and a ROAK glass on the bar" width="1200" height="900" fetchpriority="high"><div class="wrap"><div class="k">Meet the family</div><h1>Five labels, one brewhouse.</h1></div></section>
<section><div class="wrap"><p class="lead">Dark Horse Brewing Co. produces a family of Michigan beverage brands: the beers of ROAK, Brew Detroit, and Altes, and the Great America line of flavored malt beverages. Each one has its own story and its own shelf.</p>
<div class="grid g3" style="margin-top:22px">${brands.map((b) => `<a class="card" href="${B}/${b.slug}" style="text-decoration:none;display:grid;gap:12px;justify-items:start"><span class="mk"><img src="${src(b.mark)}" alt="" width="180" height="90" loading="lazy"></span><h3>${esc(b.name)}</h3><p class="mute small" style="margin:0">${esc(b.city)}${b.since ? ` · since ${b.since}` : ""} · ${b.beers.length + b.seasonal.length} beers</p></a>`).join("")}</div></div></section>` });

for (const b of brands) {
  const others = brands.filter((x) => x.slug !== b.slug);
  const beerCard = (x) => `<article class="beer"><img src="${src(x.img)}" alt="" width="120" height="170" loading="lazy"><div><h3>${esc(x.name)}</h3><div class="abv">${esc(x.style)} · ${x.abv}${x.when ? ` · ${esc(x.when)}` : ""}</div><p>${esc(x.desc)}</p></div></article>`;
  pages.push({ path: `/${b.slug}`, title: `${b.name} · beers · Dark Horse Brewing Co.`, desc: b.intro.slice(0, 155), current: "/family", body: `
<section class="hero" style="min-height:48vh;padding:0;border:0"><img class="bg" src="${src(b.photo)}" alt="" width="1200" height="800" fetchpriority="high"><div class="wrap"><span class="mk"><img src="${src(b.mark)}" alt="" width="220" height="110"></span><div class="k">${esc(b.city)}${b.since ? ` · since ${b.since}` : ""}</div><h1>${esc(b.name)}</h1></div></section>
<section><div class="wrap"><p class="lead">${esc(b.intro)}</p><p style="margin-top:14px"><a class="btn ghost" href="${B}/menu#tap">What's pouring today</a></p></div></section>
<section><div class="wrap"><div class="k">Year round</div><h2>The lineup.</h2><div class="grid g2" style="gap:28px">${b.beers.map(beerCard).join("")}</div></div></section>
${b.seasonal.length ? `<section><div class="wrap"><div class="k">In season</div><h2>Comes and goes.</h2><div class="grid g2" style="gap:28px">${b.seasonal.map(beerCard).join("")}</div></div></section>` : ""}
<section><div class="wrap"><div class="k">Also in the family</div><div class="marks" style="margin-top:14px">${others.map((o) => `<a href="${B}/${o.slug}" aria-label="${esc(o.name)}"><img src="${src(o.mark)}" alt="${esc(o.name)}" width="180" height="64" loading="lazy"></a>`).join("")}</div></div></section>` });
}

/* ---------------- catering ---------------- */
pages.push({ path: "/catering", title: "Catering · Dark Horse Brewing Co.", desc: "Slider bar, taco bar, burger bar, pasta bar, and snacks, priced per head. Tell us the date and the headcount.", current: "/catering", body: `
${pageHero("Catering", "Feed the whole party.", "Priced per head. Pick a bar, pick the meat, pick two sides. Other options and customizations on request.")}
<section style="padding-top:10px"><div class="wrap"><div class="grid g2" style="gap:40px;align-items:start">
  <div>${catering.sections.map((s) => `<div class="menu-sec" style="padding:26px 0"><h3 style="font-size:1.4rem">${s.name}</h3>${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}${s.items.map(([n, p, d]) => `<div class="item"><span class="n">${esc(n)}</span><span class="p">${esc(p)}</span>${d ? `<span class="d">${esc(d)}</span>` : ""}</div>`).join("")}</div>`).join("")}</div>
  <div class="card" style="position:sticky;top:90px"><h3>Ask about a date</h3><p class="mute small">Goes to the catering inbox with everything filled in.</p>
    <form class="f" data-mailto="${catering.contact}"><input type="hidden" name="subject" value="Catering inquiry"><label class="fl">Name<input name="name" required autocomplete="name"></label><label class="fl">Email<input name="email" type="email" required autocomplete="email"></label><label class="fl">Phone<input name="phone" type="tel" autocomplete="tel"></label><label class="fl">Event date<input name="date" type="date"></label><label class="fl">Headcount<input name="headcount" inputmode="numeric"></label><label class="fl">What are you thinking?<textarea name="details"></textarea></label><button class="btn" type="submit">Send</button></form>
    <p class="small mute" style="margin:14px 0 0">Or email <a href="mailto:${catering.contact}">${catering.contact}</a> directly.</p>
  </div>
</div></div></section>` });

/* ---------------- merch ---------------- */
const store = venues.find((v) => v.key === "store");
pages.push({ path: "/merch", title: "Merch and beer to go · Dark Horse Brewing Co.", desc: "Shirts, hats, glassware, and beer to go from the General Store. Online store ships anywhere.", current: "/merch", body: `
<section class="hero" style="min-height:48vh;padding:0;border:0"><img class="bg" src="${A}/hero-general-store.webp" alt="" width="1800" height="760" fetchpriority="high"><div class="wrap"><div class="k">General Store</div><h1>Wear the horse.</h1></div></section>
<section><div class="wrap"><div class="grid g2" style="gap:40px;align-items:start">
  <div><p class="lead">Shirts, hats, glassware, and the odd thing nobody expected, at the General Store on the grounds, or shipped from the online store.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px"><a class="btn" href="${site.merch}" rel="noopener">Shop online</a><a class="btn ghost" href="tel:+1${site.phone.replace(/\D/g, "")}">Beer to go: ext. 2</a></div>
  <div class="demo-note"><b>On the live site</b> the shirts are shown right here, in your brand, with checkout handed to your print shop until you want it in-house.</div></div>
  <div class="card venue" data-venue="store"><div class="k">${store.name}</div><span class="chip closed"><span class="dot"></span>Hours</span><div class="today">${esc(store.line.split(".")[0])}</div><div class="line">${esc(store.line)}</div><div class="note">Merchandise and beer to go: ${site.phoneExt2}</div>${hoursScript()}</div>
</div></div></section>` });

/* ---------------- contact ---------------- */
const mapsQ = encodeURIComponent(`${site.name} ${site.address.street} ${site.address.city} ${site.address.state} ${site.address.zip}`);
pages.push({ path: "/contact", title: "Contact, hours and directions · Dark Horse Brewing Co.", desc: `${site.address.street}, ${site.address.city}, ${site.address.state}. ${site.phone}. Taproom, Commons Market, and General Store hours, a map, and a form that reaches a person.`, current: "/contact", body: `
${pageHero("Contact", "Come find us.", "Everything you need to get here is on this page, and the phone number is a phone number.")}
<section style="padding-top:10px"><div class="wrap"><div class="grid g2" style="gap:40px;align-items:start">
  <div>
    <div class="card" style="margin-bottom:18px"><div class="k">Address</div><p style="font-size:1.2rem;color:var(--ink2);font-weight:800;margin:6px 0">${site.address.street}<br>${site.address.city}, ${site.address.state} ${site.address.zip}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn sm" href="https://www.google.com/maps/dir/?api=1&destination=${mapsQ}" rel="noopener">Directions</a><a class="btn sm ghost" href="tel:+1${site.phone.replace(/\D/g, "")}">Call ${site.phone}</a><a class="btn sm ghost" href="mailto:${site.email}">Email</a></div><p class="small mute" style="margin:12px 0 0">Beer to go and Commons Market orders: ext. 2.</p></div>
    ${hoursScript()}${venueCards().replace('class="grid g3"', 'class="grid" style="gap:12px"')}
  </div>
  <div class="card"><h3>Send a message</h3><p class="mute small">Opens in your mail app with everything filled in, addressed to a person who reads it.</p>
    <form class="f" data-mailto="${site.email}"><input type="hidden" name="subject" value="Website message"><label class="fl">Name<input name="name" required autocomplete="name"></label><label class="fl">Email<input name="email" type="email" required autocomplete="email"></label><label class="fl">How can we help?<textarea name="message" required></textarea></label><button class="btn" type="submit">Send</button></form>
  </div>
</div>
<div class="mapwrap" style="margin-top:34px" data-map="https://www.google.com/maps?q=${mapsQ}&output=embed"><a class="btn" href="https://www.google.com/maps/search/?api=1&query=${mapsQ}" rel="noopener" data-showmap>Show the map</a><a class="btn ghost" href="https://www.google.com/maps/dir/?api=1&destination=${mapsQ}" rel="noopener">Directions</a></div>
</div></section>` });

/* ---------------- about ---------------- */
pages.push({ path: "/about", title: "Our story · Dark Horse Brewing Co.", desc: "Since 1997. One of the last fiercely independent breweries in Michigan craft beer, and a whole lot more than a brewery.", current: "/about", body: `
<section class="hero" style="min-height:50vh;padding:0;border:0"><img class="bg" src="${A}/marshall-sign.webp" alt="The People of Historic Marshall Welcome You, the sign at the edge of town" width="1200" height="675" fetchpriority="high"><div class="wrap"><div class="k">The Dark Horse story</div><h1>${esc(story.h)}</h1></div></section>
<section><div class="wrap" style="max-width:760px">${story.paras.map((p, i) => `<p${i === 0 ? ' class="lead"' : ""}>${esc(p)}</p>`).join("")}<p style="margin-top:22px"><a class="btn" href="${B}/contact">Come visit</a></p></div></section>` });

/* ---------------- write ---------------- */
for (const p of pages) {
  const file = path.join(here, p.path === "/" ? "index.html" : p.path.slice(1) + ".html");
  fs.writeFileSync(file, shell(p));
}
fs.mkdirSync(path.join(here, "events"), { recursive: true });
const ics = (e) => { const d = (s) => new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Dark Horse Brewing Co.//Events//EN", "BEGIN:VEVENT", `UID:${e.slug}@darkhorsebrewery.com`, `DTSTAMP:${d(built.toISOString())}`, `DTSTART:${d(e.start)}`, `DTEND:${d(e.end)}`, `SUMMARY:${e.title}`, `DESCRIPTION:${e.blurb}`, `LOCATION:Dark Horse Brewing Co.\\, ${site.address.street}\\, ${site.address.city}\\, ${site.address.state} ${site.address.zip}`, "END:VEVENT", "END:VCALENDAR", ""].join("\r\n"); };
for (const e of events) fs.writeFileSync(path.join(here, "events", `${e.slug}.ics`), ics(e));
console.log(`built ${pages.length} pages, ${events.length} calendar files, ${upcoming.length} upcoming events as of ${built.toISOString().slice(0, 10)}`);
