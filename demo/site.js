/* Dark Horse demo. Everything here is an enhancement: with JavaScript off every page is
   complete, the hours still print, the events still list, the forms still reach an inbox. */
(function () {
  document.documentElement.classList.add("js");
  var TZ = "America/Detroit";

  /* ---- age gate: once, remembered, injected so the no-JS page is whole ---- */
  try {
    if (!localStorage.getItem("dh21")) {
      var g = document.createElement("div");
      g.className = "gate"; g.setAttribute("role", "dialog"); g.setAttribute("aria-modal", "true"); g.setAttribute("aria-labelledby", "gateh");
      g.innerHTML = '<div class="box"><img src="/demo/assets/logo.avif" alt="" width="88" height="88"><h2 id="gateh">Are you 21 or older?</h2><div class="row"><button class="btn" id="gateYes">Yes, I am 21+</button><a class="btn ghost" href="https://www.choosemarshall.com/" rel="noopener">Not yet</a></div><p class="small">Please drink responsibly.</p></div>';
      document.body.appendChild(g); document.body.classList.add("gated");
      var y = document.getElementById("gateYes"); y.focus();
      y.addEventListener("click", function () { try { localStorage.setItem("dh21", "1"); } catch (e) {} g.remove(); document.body.classList.remove("gated"); });
    }
  } catch (e) {}

  /* ---- open now: computed from the one hours table baked into the page ---- */
  function nowParts() {
    var f = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "numeric", minute: "numeric", hour12: false });
    var p = {}; f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var h = parseInt(p.hour, 10); if (h === 24) h = 0;
    return { day: days[p.weekday], t: h + parseInt(p.minute, 10) / 60 };
  }
  function fmt(h) { var hh = Math.floor(h), m = Math.round((h - hh) * 60); var ap = hh >= 12 ? "PM" : "AM"; var d = hh % 12 || 12; return d + (m ? ":" + (m < 10 ? "0" + m : m) : "") + " " + ap; }
  var hoursEl = document.getElementById("hours");
  if (hoursEl) {
    var venues = JSON.parse(hoursEl.textContent), n = nowParts();
    venues.forEach(function (v) {
      var today = v.days[n.day], status, cls = "closed", line;
      if (today && n.t >= today[0] && n.t < today[1]) {
        cls = ""; status = "Open now";
        line = "Closes " + fmt(today[1]);
        if (v.kitchen && v.kitchen[n.day]) line += " · kitchen until " + fmt(v.kitchen[n.day]);
        if (v.breakfast && v.breakfast.days.indexOf(n.day) > -1 && n.t < v.breakfast.to) line = "Breakfast until " + fmt(v.breakfast.to) + " · " + line.charAt(0).toLowerCase() + line.slice(1);
      } else if (today && n.t < today[0]) { status = "Closed"; line = "Opens " + fmt(today[0]) + " today"; }
      else {
        status = "Closed";
        for (var i = 1; i <= 7; i++) { var d = (n.day + i) % 7; if (v.days[d]) { line = "Opens " + ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d] + " " + fmt(v.days[d][0]); break; } }
      }
      document.querySelectorAll('[data-venue="' + v.key + '"]').forEach(function (el) {
        var c = el.querySelector(".chip"); if (c) { c.className = "chip " + cls; c.innerHTML = '<span class="dot"></span>' + status; }
        var t = el.querySelector(".today"); if (t) t.textContent = line;
      });
    });
    var chip = document.getElementById("heroStatus");
    if (chip) { var tap = venues[0], td = tap.days[n.day]; var open = td && n.t >= td[0] && n.t < td[1]; chip.className = "chip " + (open ? "" : "closed"); chip.innerHTML = '<span class="dot"></span>' + (open ? "Taproom open now · kitchen until " + fmt(tap.kitchen[n.day]) : (td && n.t < td[0] ? "Taproom opens " + fmt(td[0]) + " today" : "Taproom closed right now")); }
  }

  /* ---- events: anything that has ended disappears on its own ---- */
  var evs = document.querySelectorAll("[data-end]"), left = 0;
  evs.forEach(function (el) { if (new Date(el.getAttribute("data-end")) < new Date()) el.remove(); else left++; });
  if (evs.length && !left) document.querySelectorAll(".empty").forEach(function (e) { e.style.display = "block"; });

  /* ---- mug club: tabs, and a checkout stand-in that says what it is ---- */
  var tabs = document.querySelectorAll(".tabs button");
  if (tabs.length) {
    var panels = document.querySelectorAll(".panel");
    function pick(id) { tabs.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("aria-controls") === id ? "true" : "false"); }); panels.forEach(function (p) { p.hidden = p.id !== id; }); }
    tabs.forEach(function (b) { b.addEventListener("click", function () { pick(b.getAttribute("aria-controls")); }); });
    pick(location.hash === "#join" ? "join" : "renew");
  }
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var kind = f.getAttribute("data-demo"), out = document.getElementById(f.getAttribute("data-out"));
      var fd = new FormData(f), name = fd.get("name") || "", email = fd.get("email") || "", member = fd.get("member") || "";
      if (kind === "renew") {
        out.innerHTML = '<h3>Renewal ready for payment</h3><p><strong>' + esc(name) + '</strong>' + (member ? ', mug #' + esc(member) : '') + '. Annual renewal.</p><p class="mute">On the live site this button opens secure checkout, card on file, and your renewal is recorded the moment it clears. This is the demo, so nothing is charged and nothing is stored.</p><a class="btn" href="#" onclick="return false">Continue to secure payment</a>';
      } else {
        out.innerHTML = '<h3>You are on the December list</h3><p><strong>' + esc(name) + '</strong>, we will email <strong>' + esc(email) + '</strong> when release details are set.</p><p class="mute">On the live site this goes straight into the member list and sends you a confirmation. In the demo it goes nowhere, so if you actually want on the list: <a href="mailto:emily@darkhorsebrewery.com?subject=' + encodeURIComponent("Mug Club December release list") + '&body=' + encodeURIComponent(name + "\n" + email) + '">email Emily</a>.</p>';
      }
      out.hidden = false; out.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* ---- contact and catering: a mailto with every field prefilled, the honest no-backend handoff ---- */
  document.querySelectorAll("form[data-mailto]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(f), lines = [];
      fd.forEach(function (v, k) { if (k !== "subject") lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ": " + v); });
      location.href = "mailto:" + f.getAttribute("data-mailto") + "?subject=" + encodeURIComponent(fd.get("subject") || "Website message") + "&body=" + encodeURIComponent(lines.join("\n"));
    });
  });
  /* ---- map facade: the embed loads when somebody asks for it ---- */
  document.querySelectorAll("[data-map]").forEach(function (w) {
    var b = w.querySelector("[data-showmap]"); if (!b) return;
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var f = document.createElement("iframe"); f.src = w.getAttribute("data-map"); f.title = "Map to Dark Horse Brewing Co."; f.setAttribute("referrerpolicy", "no-referrer-when-downgrade"); f.loading = "lazy";
      w.innerHTML = ""; w.appendChild(f);
    });
  });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
})();
