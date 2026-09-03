# Dark Horse Brewing Co., site teardown

**Prospect:** Dark Horse Brewing Company, 511 S. Kalamazoo Ave., Marshall, MI 49068. Family of brands: Dark Horse, ROAK, Brew Detroit, Altes, Great America.
**Live site:** https://www.darkhorsebrewery.com/ (Wix)
**Audited:** September 3, 2026, 6:50 to 7:30 PM Eastern, three passes.
**Engagement shape:** Scout. Nothing built yet. This file is the audit; the proposal lifts from it.

Every finding below was checked this session in a real Chromium browser against production, by fetching markup, or both. Each carries a tag from `glaze.md`: **M** means the markup alone proves it (title tags, schema, sitemap, HTTP status, script counts, image weights), **R** means it needed a render. Anything that could not be confirmed is in the "Open and unverified" section at the bottom rather than dropped. Two claims from the first pass turned out to be wrong and are kept under "Retired," with the reason.

---

## Verdict

Not a dated site, a broken one, and the two are pitched differently. A dated site gets "it looks like 2014." This one has faults a customer will hit before they hit the taproom door:

- A fake "Dinner Menu" page is live and indexable at [`/menu`](https://www.darkhorsebrewery.com/menu): unedited Wix template filler with $1.50 cocktails and tuna sashimi, sitting next to the real menu, and shipping its own structured data to Google.
- The homepage's one primary button, ORDER CARRYOUT, opened to "Currently not accepting online orders" at 7:15 PM on a Thursday, inside kitchen hours.
- Two of the three upcoming events on the homepage show a weekday in the title that contradicts the date under it. One event page manages three different dates for the same show.
- On a phone, the homepage's own intro headline does not exist in the DOM.
- Their Mug Club, 4,800 members strong by their own count, is run out of one employee's email inbox.
- The browser tab icon is Wix's default, not their horse.
- Lighthouse mobile: 16.6MB, 250 requests, 243 of them third-party, Time to Interactive 42.7 seconds.

And the reason it is worth the pitch: the brand underneath is real. Founded 1997, one of the last independents in Michigan craft beer, a 4,800-mug loyalty program people camp out for, a kitchen doing wood-fired pizza and Thursday-to-Sunday breakfast, five labels, a beer garden with a live music calendar. The About page copy is the best writing on the site. The build is the only thing letting it down, and none of it is theirs. Which is the proposal's h1: *Do you own your website?* The honest answer is no, and it is no five separate ways (see "The wedge").

---

## Findings, in the Scout order

### 1. Search and sharing

**1.1 The homepage has no headline for Google. (M)**
The only two `<h1>` elements on the homepage are "Upcoming Events" and "JOIN OUR MAILING LIST." Nothing says what the business is. Across the site headings are used as font sizes, not structure:

| Page | `<h1>` count | What they are |
|---|---|---|
| [/](https://www.darkhorsebrewery.com/) | 2 | Upcoming Events, JOIN OUR MAILING LIST |
| [/about](https://www.darkhorsebrewery.com/about) (the brand story) | 0 | |
| [/contact](https://www.darkhorsebrewery.com/contact) | 0 | |
| [/dark-horse](https://www.darkhorsebrewery.com/dark-horse) | 12 | every beer name |
| [/roak](https://www.darkhorsebrewery.com/roak) | 9 | every beer name |
| [/brew-detroit](https://www.darkhorsebrewery.com/brew-detroit) | 8 | |
| [/great-america](https://www.darkhorsebrewery.com/great-america) | 7 | |
| [/altes](https://www.darkhorsebrewery.com/altes) | 6 | |
| [/brewery](https://www.darkhorsebrewery.com/brewery) | 3 | |

Lighthouse's SEO category scores this site 100, because Lighthouse does not check heading structure. Say that out loud if it comes up rather than letting them find it.

**1.2 Title and description are inconsistent and over length. (M)**
Homepage title is "Home | Dark Horse Brewing Company." Every other page uses "| Dark Horse Brewing Co." The homepage meta description is 402 characters; Google shows about 155. The fake menu page (1.5) has no meta description at all, and its sibling URLs are titled "Menus (New) | Dark Horse Brewing Co.", a working title shipped to production.

**1.3 The browser-tab icon is Wix's default. (M)**
All three `<link rel="icon">` tags on every page point at `https://static.parastorage.com/client/pfavico.ico`, the generic Wix favicon. Thirty years of brand and the tab shows someone else's logo.

**1.4 No business schema anywhere. (M)**
The homepage carries one generic `WebSite` JSON-LD block that Wix emits by default. There is no `LocalBusiness`, `Brewery`, `Restaurant` or `BarOrPub` schema on any page checked ([/](https://www.darkhorsebrewery.com/), [/about](https://www.darkhorsebrewery.com/about), [/brewery](https://www.darkhorsebrewery.com/brewery), [/events](https://www.darkhorsebrewery.com/events)), so hours, address, phone and menu are not machine-readable to Google. Credit where due: individual event pages do carry `Event` schema from Wix Events. The fake menu page carries `BreadcrumbList` and `ImageObject` schema, meaning the placeholder is the page with the most structured data on the site.

**1.5 A template menu is live, indexable, and in their sitemap. (M, R)**
[`/menu`](https://www.darkhorsebrewery.com/menu) (also `/menu?menu=dinner-menu`) is titled "Dinner Menu | Dark Horse Brewing Co." and is 100 percent unedited Wix Restaurant Menu placeholder content: Tuna sashimi $4.50, Peanut crusted steak $8.00, Schnitzel $4.00, Healthy smoothie $3.00, and Aperol Spritz / Gin & Tonic / Mojito at $1.50, over blurred stock photos of plates. It is listed in their own [`restaurants-menu-sitemap.xml`](https://www.darkhorsebrewery.com/restaurants-menu-sitemap.xml), last modified 2026-02-05. Four more parameter variants (`lunch-menu`, `breakfast-menu`, `drinks-menu`, `brunch-menu`) all return 200 with the same placeholder body. None of it is linked from the navigation; it is an abandoned setup nobody deleted.

The real taproom menu exists and is good (Cheese Bread 11, Nachos with brisket 15, Dark Horse Chili, Michigan Salad, wood-fired 12" and 16" pizzas and a Detroit-style square), but it lives as one section inside the single long [`/brewery`](https://www.darkhorsebrewery.com/brewery) page, mixed in with three sets of hours, events, the Mug Club and catering. So the URL that reads as "the menu" to a crawler is the fake one.

**1.6 The old WordPress site's URLs are dead with no redirects, and Google still lists them. (M)**
A `site:` search still returns [`darkhorsebrewery.com/blog/`](https://darkhorsebrewery.com/blog/) ("Blog - Dark Horse Brewing Co.") and `/tag/beer-dinner/`. Both 301 to a slash-stripped path that returns 404. Every link earned by the old site over its life now lands on an error page.

**1.7 Sloppy slugs. (M)**
The Family of Brands nav item points at [`/family-of-brands-1`](https://www.darkhorsebrewery.com/family-of-brands-1), the suffix Wix adds when a page is created twice. The natural URL, `/family-of-brands`, returns 404. Event pages carry the same fingerprint: `live-music-saturday-boy-mob-1`, `live-music-thursday-the-fat-animals-2`.

### 2. Usability, on a phone

**2.1 The homepage headline is missing on mobile. (R, confirmed on two loads)**
At a 375px viewport, "A NEW BREED," the heading over the intro paragraph on desktop, is absent from the DOM entirely (`document.body.innerText.includes('A NEW BREED')` is `false`). Phone visitors go from hero video to body copy with no heading. Wix mobile layouts are a separate, hand-managed arrangement, and this one was never finished.

**2.2 The primary call to action opened to a dead end during service hours. (R, timestamped)**
Every page's most prominent button, ORDER CARRYOUT, links to [Toast](https://order.toasttab.com/online/roak-brewing-co-dark-horse-brewing-511-s-kalamazoo-ave). At 7:15 PM Eastern on Thursday, September 3, with the taproom open until 10 and the kitchen until 9 by their own hours, the page read **"Currently not accepting online orders."** No explanation, no fallback, no phone number in view. Whether that was a deliberate switch-off during a rush or a configuration fault, the visitor cannot tell, and the site offers nothing else to do. (The full pizza menu, calzones, sandwiches and a Toast points program are all visible on that page and nowhere on their own site; see 3.3.)

**2.3 "Buy Tickets" and a checkout, for free live music. (R)**
Every event, including the Thursday and Saturday live music, shows a "Buy Tickets" button that opens a Wix Events checkout for a $0.00 General Admission ticket ([example](https://www.darkhorsebrewery.com/event-details/live-music-thursday-the-fat-animals-2)). A customer wanting to know whether they need a ticket is put through a purchase flow to find out they do not.

**2.4 Three sets of hours, one place to see them. (M)**
The homepage shows Taproom hours only, opening 11 AM. [`/brewery`](https://www.darkhorsebrewery.com/brewery), mid-page, adds Commons Market hours (Mon to Sun 11 to 8, "NOW OPEN EARLY THURSDAY - SUNDAY FOR BREAKFAST! 7:00 a.m. - 11:00 a.m.") and General Store hours (Thu 4 to 8, Fri to Sun 12 to 8). The earliest "are they open yet" question a visitor asks, a Saturday breakfast, is answered nowhere near the top of anything. Third-party listings already disagree with each other about it (one directory shows Thu to Sun 7 AM to 8 PM as the business hours).

**2.5 The Contact page body has no address, phone, map, hours or email. (R)**
[`/contact`](https://www.darkhorsebrewery.com/contact) is a headline, a heavily out-of-focus banner photo, the words "TAPROOM | COMMONS MARKET | GENERAL STORE," and a form. The address and phone appear only in the small shared footer below a dead whitespace gap roughly half a screen tall. The phone number in that footer is plain text, not a `tel:` link. Note the correction under "Retired": the first draft of this audit said the phone number was not on the site at all. It is, in the footer, on every page.

**2.6 The mobile menu. (R, unverified, see bottom)**
In our emulated 375px Chromium test the hamburger opened to a stuck state twice: the dim overlay frozen at 1 percent opacity, the first item ("ABOUT") positioned above the top edge of the screen, menu text bleeding transparently over the page content. The browser pane was backgrounded during both runs, which throttles animation frames and can produce exactly that symptom, so this is **not** going in front of the owner until someone opens the menu on a physical phone. If it reproduces, it is the headline finding of the whole audit.

### 3. Brand consistency

**3.1 Two names for the same company. (M)**
"Dark Horse Brewing Company" in the homepage title, "Dark Horse Brewing Co." everywhere else, including the copyright line.

**3.2 The ordering link names a different brewery. (M)**
The Toast slug is `roak-brewing-co-dark-horse-brewing-511-s-kalamazoo-ave`. ROAK is their Royal Oak brand, acquired in 2024. The address is correct (Marshall); the name mashes two brands into one URL, which is what a customer sees in the address bar and in any shared link.

**3.3 Five different platforms, five different looks, none of them theirs. (M)**

| Task | Where the visitor ends up | Whose branding |
|---|---|---|
| Order food | order.toasttab.com | Toast |
| See the beer list | business.untappd.com/app/boards/64669 | Untappd, a TV-board URL |
| "VIEW MENU / ORDER CARRYOUT" (Commons) | untappd.com/v/dark-horse-brewing-co (a 12-item breakfast menu, no ordering) | Untappd |
| Buy merch | stores.inksoft.com/dark_horse_brewing_co | InkSoft |
| Events and tickets | Wix Events checkout | Wix |
| Everything else | Wix | Wix |

A button labeled "ORDER CARRYOUT" on the Commons section goes to a menu you cannot order from. Toast runs a points program ("Earn 1 point for every $1 spent") that has no connection to the Mug Club, so they have two loyalty programs and own neither.

**3.4 Blurred hero photos. (R)**
The Contact page banner and every plate photo on the placeholder menu are out of focus. The homepage hero is a video of the Marshall welcome sign, fine on its own, but the pattern across pages is photography that was cropped from something never meant to be a banner.

### 4. Content

**4.1 Wrong dates on live events. (M)**
On the homepage and [`/events`](https://www.darkhorsebrewery.com/events):
- "Live Music **Saturday**: Boy Mob" is listed as **Mon, Sep 07**. Its [detail page](https://www.darkhorsebrewery.com/event-details/live-music-saturday-boy-mob-1) shows Sep 07, 2026, 6 to 9 PM, and its description reads "Join us on Saturday, September 19th." Three dates, one show.
- "Live Music **Thursday**: The Fat Animals" is listed as **Mon, Sep 07**.
Their own Instagram caption, pulled into the homepage feed, says live music is "every Thursday and Saturday." September 7 is a Monday. These are placeholder dates that went live.

**4.2 "An satmeal stout." (M)**
[`/roak`](https://www.darkhorsebrewery.com/roak), Devil Dog description: "An satmeal stout that boasts a smooth, velvety texture." Two errors in three words on the flagship beer of an acquired brand.

**4.3 Camera filenames as alt text. (M)**
Screen readers on these pages announce "I M G underscore zero zero eight one dot J P G." Found: `IMG_0081.JPG` ([/about](https://www.darkhorsebrewery.com/about) and [/work-with-us](https://www.darkhorsebrewery.com/work-with-us)), `IMG_0185.JPG`, `IMG_7844_edited.jpg` and `DH_Commons_Full_Bldg (1) 2_edited.jpg` ([/brewery](https://www.darkhorsebrewery.com/brewery)), `IMG_3338.JPG` ([/family-of-brands-1](https://www.darkhorsebrewery.com/family-of-brands-1)), `Untitled design (1).jpg` and `DHmugs.jpg` (homepage). Lighthouse's accessibility score is 100 because an alt attribute is present; it does not read them.

**4.4 The Mug Club is two different sizes. (M)**
[`/about`](https://www.darkhorsebrewery.com/about): "more than 5,000 Mug Club members." [`/mug-club`](https://www.darkhorsebrewery.com/mug-club): "more than 4,800 mugs hanging throughout the taproom." One fact, two pages, two numbers.

**4.5 The homepage is 247 words. (M)**
Rendered body text, everything included. The Contact page is 54 words, Work With Us is 61 and has no positions listed, only a generic form. The brand's best copy, the About page at 322 words, is the one with no heading.

**4.6 The Mug Club has no digital layer at all. (M)**
The entire membership process, per [`/mug-club`](https://www.darkhorsebrewery.com/mug-club): "Visit the taproom or email emily@darkhorsebrewery.com to renew your membership or inquire about how to become a member." No signup, no renewal, no payment, no member login, no waitlist for the once-a-year December release people line up for. A 4,800-person program administered from one staff inbox. This is the clearest thing on the site that we would build rather than fix.

**4.7 The distillery has no page. (M)**
The About page says the company is "home to a craft brewery, small distillery, and a true entertainment destination." The word "distillery" appears nowhere else on the site, and `/distillery` is a 404.

### 5. Performance

Lighthouse 12.8.2, mobile profile, simulated throttling, run locally 2026-09-03 23:19 UTC. Summary saved at [`audit/lighthouse-mobile-2026-09-03.json`](audit/lighthouse-mobile-2026-09-03.json).

| | Score or value |
|---|---|
| Performance | **69** |
| Accessibility | 100 (see 4.3 and section 7 for what that does not cover) |
| SEO | 100 (see 1.1) |
| Best Practices | 96 |
| First Contentful Paint | 3.3 s |
| Largest Contentful Paint | **6.6 s** (bar: 2.5 s) |
| Time to Interactive | **42.7 s** |
| Cumulative Layout Shift | 0.076 |
| Total page weight | **16,980 KiB** |
| Requests | **250**, of which **243 third-party** |
| Scripts | 104, 1.4MB |
| Images | 53, 10.0MB |
| Media | 9, 4.5MB |

Where it goes:

- **Instagram: 11.4MB of the 16.6.** The homepage embeds a feed widget that loads eight Instagram video players in iframes plus about sixty images, most of them not in a modern format (Lighthouse estimates 3.25MB saved from WebP/AVIF alone) and served at Instagram's native size rather than the 218px thumbnails they display at. The single largest resource on the homepage is a 1,455KB Instagram JPEG.
- **A 655KB age-verification script that never verifies anyone.** `age.bestfreecdn.com/storage/js/age-4773.js` loads on every page, 567KB of it unused, blocking the main thread for 103ms, and across more than six page loads at two viewports no age gate ever rendered, no cookie was set, and no overlay element exists in the DOM. A brewery whose Great America line is 10 percent ABV ships a broken age gate from a free-widget CDN.
- **Wix: 4.5MB and 104 script tags** for a site with 247 words on its homepage. Two Sentry error-tracking bundles ship to every visitor.
- **Mobile is served the same weight as desktop.** Our own trace at 375px measured 10.4MB transferred, 10.1MB of it images, on first load. No `srcset`, no mobile-sized variants.
- 165 resources with short or no cache lifetime.

### 6. Security and console

Clean where it counts: HTTP redirects to HTTPS, apex redirects to www, HSTS is set (`max-age=31556952`), `x-content-type-options: nosniff`. No certificate issues.

One uncaught exception on every page load (R):
`Uncaught (in promise) Error: Wix Site SDK only works in a Wix site environment.`
A first-party script call that fails on the platform it was written for, in production.

### 7. Accessibility

Lighthouse: 100. That number is the automated floor and it is honest to report it. What it does not catch is above: alt text that is present but meaningless (4.3), a heading structure that is decoration (1.1), a phone number that is not a link (2.5), a menu that may not open (2.6). The house auditor, axe at 390 and 1440 on eight routes, is running as this is written and its result is appended below when it lands.

---

## The wedge: do you own your website?

The proposal's h1, per `glaze/proposal.md`. Here the answer is no in five separate places:

1. **The site** is Wix. They rent the page builder, the hosting, the events app, the form app and the menu app that produced the fake page. Leaving Wix means starting over; there is no code to take.
2. **Ordering** is Toast, at a Toast URL with the wrong brewery's name in it. The points program lives there too.
3. **The beer list** is Untappd, at a URL built for a TV screen.
4. **Merch** is InkSoft.
5. **The Mug Club**, the single most valuable customer asset they have, 4,800 people who camp out in December, exists as a spreadsheet and an inbox. If Emily leaves, the program's digital footprint leaves with her.

A visitor who wants to know the hours, see the menu, check the tap list, order a pizza, buy a shirt and renew a mug membership touches five companies and one employee. None of the five is Dark Horse.

This is also why the findings above are structurally hard for them to fix in place: 1.1, 1.3, 1.4, 2.1 and section 5 are Wix's ceiling, not a to-do list.

---

## What we would build

Concrete, and short because the demo will say the rest.

- **One home** with an actual headline, the three sets of hours in one block with "open now" computed from the clock, today's music, and the four brand marks. Under 1MB.
- **A menu page that is a menu page**, at `/menu`, owned, with the pizza, the breakfast and the taproom menu each linkable, and the placeholder gone. Structured data for all of it.
- **Hours, address, phone, email and every price in one constant file**, so 4,800 versus 5,000 cannot happen twice.
- **Events that cannot show a Monday for a Saturday**: the weekday is derived from the date, free events say "Free, no ticket needed," ticketed ones sell tickets.
- **Mug Club membership**: signup, renewal, card on file, member number, the December release as a real waitlist, an owner screen that answers "how many renewed." This is the Custom Order line of the job and the reason it is not a menu price.
- **Ordering under their own name**: `order.darkhorsebrewery.com`, so the URL is theirs whether the kitchen runs Toast behind it or something else later (see `glaze.md` on Toast's frame policy; on-page embedding is not possible, the hostname is).
- **A tap list on their own page** fed from Untappd's data rather than linking out to Untappd's screen.
- **An age gate that works**, once, cookie-backed, ten lines of code instead of 655KB.
- **The five brand pages** rebuilt on one system, with the beers as a list and not as twelve h1s.
- **Contact** with a map, `tel:` and `mailto:` links, and hours above the form.
- Redirects for the old blog and tag URLs so the last decade of inbound links lands somewhere.

## What it costs

Open with Kevin. The menu's Baker's Dozen ($2,000 plus $150) covers everything above except the Mug Club system and the ordering hostname, which make this a Custom Order. `proposal.md` requires a number, not "starting from," and a sourced market anchor with a link under it. Both are decisions for Kevin before the proposal page is written.

## What happens next

One action, per the ruling for US-market proposals: book the call at glazedweb.com/schedule. The demo and proposal page follow the Griffin Claw structure in `glaze/proposal.md` (proposal at the root of `darkhorse.glazedweb.com`, demo at `/demo`, `beforeFiles` host rewrites, `noindex` on the pitch host and the `.vercel.app` host).

---

## Checked and clean

So nobody re-audits these: HTTPS enforcement and HSTS; the Untappd beer board does render a live, priced tap list (an earlier fetch summary said otherwise, it was wrong); the InkSoft store loads under their name; Instagram and Facebook links resolve to the right accounts; `robots.txt` is Wix's standard and blocks nothing important; individual event pages carry `Event` schema; the sitemap index is well-formed; copyright year reads 2026, which is correct.

## Retired claims

Kept as retractions, per `glaze.md`, so nobody re-derives them.

- **"Their phone number is not on their own site."** Wrong. `269-781-9940` and the street address are in the shared footer on every page. The first-pass check read only the `<main>` element. The surviving claim is narrower and true: the Contact page's own body has none of it, and the footer number is not a `tel:` link.
- **"7 of 84 images have no alt text."** Misleading. Those carry `alt=""`, which is the correct markup for decorative images. The real alt-text fault is 4.3, filenames shipped as descriptions.
- **"VISIT THE TAPROOM and SEE ALL EVENTS are black text on black."** Wrong. A contrast sweep that walked up to the nearest painted ancestor misread the button. They are white on black and fine.
- **"The Untappd beer list link is broken."** Wrong; a text-only fetch saw only the word "Untappd." Rendered, it is a full priced tap list.
- **"Altes Lite has an incomplete description" and "the copyright year is a placeholder."** Both from a summarizer, both wrong on inspection.

## Open and unverified

- **The mobile menu (2.6).** Needs a physical phone. Do not present it until then.
- **Whether Toast online ordering is switched off deliberately in the evenings.** We observed one timestamp. Worth a second check at a quieter hour before it goes in the proposal as a pattern rather than an instance.
- **The age-gate script's intent.** It loads, it does nothing visible, it may be geo-gated or long dead. Either way it costs 655KB per visitor.
- **Google Business Profile hours** against the three sets on the site. Not checked this session.
- **Whether the "Menus (New)" pages are a half-finished migration** somebody is actively working on. If so, the fake menu finding is still true today and still indexable.

## Files

| Path | What it is |
|---|---|
| `README.md` | This audit |
| `audit/lighthouse-mobile-2026-09-03.json` | Compact Lighthouse summary: scores, metrics, failing audits, third-party breakdown, largest resources |

## Next steps

- [ ] Kevin: confirm this repo is the demo rebuild (Griffin Claw pattern) and rule on price.
- [ ] Open the mobile menu on a real phone; promote or retire 2.6.
- [ ] Re-check Toast ordering availability at an off-peak hour.
- [ ] Append the axe auditor result to section 7.
- [ ] Intake per `glaze/intake.md` before building anything: real photography, logo files, the actual Mug Club rules and price, the breakfast menu, who owns the domain.
