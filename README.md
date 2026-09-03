# Dark Horse Brewing Co. — site teardown

Prospect: Dark Horse Brewing Company, Marshall MI (+ Family of Brands: ROAK, Altes, Great America)
Live site: https://www.darkhorsebrewery.com/
Audited: 2026-09-03

All findings below were verified live against the production site (network transfer sizes, DOM inspection, console errors, mobile viewport render) — not visual opinion.

## Verdict

This is a legitimately bad site, not just a dated one. Most teardowns are "it looks like 2014." This one has functional bugs a visitor will actually hit: a contact page with no address or phone number, a mobile homepage missing its own intro headline, an events calendar showing the wrong day of the week for two of three upcoming shows, and — the headline find — a completely fake "Dinner Menu" page (unedited Wix template, $1.50 cocktails, tuna sashimi they don't serve) sitting live and indexable right next to their real menu. Fair to call it one of the worst we've pulled apart, and the brand underneath (30 years, 4,800-member Mug Club, genuinely good "About" copy) deserves better than what's shipping.

## Findings

### 1. 11MB homepage, same weight on mobile
- Desktop load: 187 requests, ~11.1MB transferred, 1.9s load event.
- Mobile (375px viewport): 201 requests, ~10.4MB transferred — 10.1MB of that is images.
- 57 images, none responsive/srcset'd. A phone on the taproom's spotty rural signal downloads the exact same multi-megabyte desktop images as a fiber connection.

### 2. No real H1 — the page has no headline for SEO
- Only two `<h1>` tags exist on the entire homepage: "Upcoming Events" and "JOIN OUR MAILING LIST".
- The actual brand/value-prop copy ("A New Breed" / who they are) is never marked up as a heading. Google has nothing to key off for what this page is about.
- 7 of 84 images ship with no alt text.

### 3. Mobile homepage is missing content the desktop version has
- Confirmed via DOM check on a 375px viewport: the "A NEW BREED" section headline does not render on mobile at all — it's simply not in the mobile layout. Visitors on a phone (most of them) skip straight from the hero video to body copy with no heading.

### 4. Contact page has no address, phone, or map
- The entire page is: a headline, a blurry out-of-focus banner photo, "TAPROOM | COMMONS MARKET | GENERAL STORE," and a bare contact form.
- No street address, no phone number, no embedded map — for a physical destination business whose whole pitch is "come visit us in Marshall."
- Below the form there's a dead whitespace gap roughly half a screen tall before the footer even starts.

### 5. Events calendar has visibly wrong dates
- "Live Music Saturday: Boy Mob" is listed under **Mon, Sep 07**.
- "Live Music Thursday: The Fat Animals" is also listed under **Mon, Sep 07**.
- Two of the three upcoming events shown on the homepage have a day-name in the title that doesn't match the date next to it. This is live, customer-facing, right now.

### 6. Sloppy IA / URL hygiene
- The "Family of Brands" nav item actually points to `/family-of-brands-1` — a Wix duplicate-page artifact (someone made the page twice and never cleaned up the slug). The clean guess, `/family-of-brands`, 404s.
- The "Order Carryout" button sends users to a Toast ordering link with the slug `roak-brewing-co-dark-horse-brewing-511-s-kalamazoo-ave` — mashing their Detroit brand (ROAK) and their Marshall brand (Dark Horse) into one URL. Reads like two locations got merged in Toast and nobody renamed it.

### 7. Built on Wix, throwing a console error on every load
- `Uncaught (in promise) Error: Wix Site SDK only works in a Wix site environment` fires on page load — a broken first-party script call shipping to production.
- Site-builder platform (Wix) is a ceiling on their own: no real control over markup/performance, which is why #1–#3 above are structurally hard for them to fix without leaving the platform.

## Round 2 — deeper findings

### 8. A fake menu is live on the internet next to the real one
- `/menu?menu=dinner-menu` is a real, publicly reachable page, listed in their own sitemap (`restaurants-menu-sitemap.xml`), titled "Dinner Menu | Dark Horse Brewing Co."
- It is 100% unedited Wix Restaurant Menu template placeholder content: "Tuna sashimi" $4.50, "Peanut crusted steak" $8.00, cocktails (Aperol Spritz, Gin & Tonic, Mojito) at $1.50, blurred stock-photo plates. None of this is what Dark Horse serves.
- It is not linked from anywhere in the site nav — it's an orphaned setup artifact nobody finished or deleted, sitting indexable at a URL a customer could absolutely land on from Google ("dark horse brewery menu").
- The real taproom menu (Cheese Bread, Nachos, Dark Horse Chili, Michigan Salad, real prices) exists, but only as one section buried inside a single long scrolling page at `/brewery`, mixed in with hours, events, and mug club info — it's not its own clean, linkable, indexable "Menu" page. So the URL that reads as "the menu" to Google is the fake one.

### 9. Ordering and menu info is scattered across three different platforms they don't own
- Carryout ordering → Toast (`order.toasttab.com/.../roak-brewing-co-dark-horse-brewing-...`)
- Beer list + "order carryout" again → Untappd (`business.untappd.com` and `untappd.com/v/dark-horse-brewing-co`)
- Food menu → buried in the `/brewery` page (when it's not accidentally the fake Wix one above)
- A visitor trying to figure out "what do they serve and how do I order it" bounces across three separate systems with three separate looks, none of which is darkhorsebrewery.com.

### 10. Mug Club — 4,800+ members, zero digital self-service
- Their own copy: "more than 4,800 mugs hanging throughout the taproom." This is a real, sizeable, high-loyalty membership program.
- Renewal process, in full, per the site: "Visit the taproom or email emily@darkhorsebrewery.com to renew your membership or inquire about how to become a member."
- No online signup, no online renewal or payment, no member portal, a staff member's personal email as the entire digital interface for a 4,800-person program. This is the single clearest "here's what we'd build" opportunity on the whole site — a real membership/loyalty system tied into ordering and POS.

### 11. H1 problem is site-wide, not just the homepage
- Checked `/about` (their actual brand story page) and `/contact`: **zero H1 tags on either page.**
- `/brewery` and `/mug-club` do have H1s, so it's not a platform limitation — it's inconsistent, page-by-page, across the site.

### 12. Their real phone number isn't on their own site
- (269) 781-9940 is listed on third-party directories (SinglePlatform, etc.) but does not appear anywhere on darkhorsebrewery.com, including the Contact page (see #4).

### 13. The brand story is genuinely good — the site doesn't sell it
- `/about` copy is well-written and has real hooks: opened 1997, "TV-show fame," 5,000+ Mug Club members, Winterfest Beer Olympics, the 4ELF Party, "one of the few fiercely independent breweries left in Michigan." This is a brand worth building for.
- None of that story gets a proper heading (see #11), none of it is reinforced by the mobile experience (see #3), and the visual craft (blurry banner photos, template placeholder menu) undercuts it at every turn. The gap between the brand and the build is the pitch.

## What this means for the pitch

Every point above is demonstrable in under 5 minutes on a call — load the site, open the contact page, load it on a phone, look at the events widget. Nothing here is "trust me, ours looks nicer." That's the strongest kind of teardown: it's not a taste argument, it's "your ordering link is telling customers this is a different brewery."

## Next steps
- [ ] Confirm this repo is meant for a demo rebuild (like the Griffin Claw two-demo approach) or just houses the teardown/proposal doc.
- [ ] If building a demo: fix #2/#3 (proper H1 + mobile parity), #4 (address/phone/map on contact), #5 (correct event dates), #6 (clean URLs, single-brand ordering link) as the headline "here's what we'd ship" comparison.
