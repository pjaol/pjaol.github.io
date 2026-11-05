(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ---------- Pulsar map: each ray is a project ---------- */
  const RAYS = [
    { name: "The VGER Group", note: "The company. Applied AI, data and software, built by senior people.", href: "#vger", len: 290, angle: 0, galactic: true },
    { name: "SlideMarks", note: "Harvey balls and status symbols that behave like text.", href: "#slidemarks", len: 170, angle: 24 },
    { name: "Clio Daye", note: "Cycle tracking with no server. Your data stays on your phone.", href: "#clio", len: 205, angle: 52 },
    { name: "LocalLucene", note: "2007. Geographic search for Lucene. Became Spatial Lucene.", href: "#trajectory", len: 240, angle: 79 },
    { name: "Lens", note: "Spots AI-generated images in the browser. No uploads.", href: "https://github.com/thevgergroup/lens", len: 150, angle: 103 },
    { name: "apollo-io-mcp", note: "MCP server so your agents can talk to Apollo.io.", href: "https://github.com/thevgergroup/apollo-io-mcp", len: 190, angle: 131 },
    { name: "undetected-browser-tool", note: "Browser tooling for LangChain agents that doesn't get blocked.", href: "https://github.com/thevgergroup/undetected-browser-tool", len: 215, angle: 156 },
    { name: "langchain-logger", note: "See the chain of thought your LangChain app actually ran.", href: "https://github.com/thevgergroup/langchain-logger", len: 160, angle: 183 },
    { name: "fsspec-encrypted", note: "Application-level encryption for fsspec. At rest isn't enough.", href: "https://github.com/thevgergroup/fsspec-encrypted", len: 228, angle: 207 },
    { name: "mad-skills", note: "Claude Code skills from real shipping experience.", href: "https://github.com/thevgergroup/mad-skills", len: 140, angle: 232 },
    { name: "notion-wp", note: "Notion to WordPress sync that actually syncs.", href: "https://github.com/thevgergroup/notion-wp", len: 182, angle: 258 },
    { name: "tail-ct", note: "tail -f for Certificate Transparency logs.", href: "https://github.com/pjaol/tail-ct", len: 132, angle: 283 },
    { name: "dokku-synology", note: "Dokku on a Synology without touching the DSM UI.", href: "https://github.com/pjaol/dokku-synology", len: 198, angle: 309 },
    { name: "linkedin-cleanup-js", note: "Strip the suggested-post noise out of your LinkedIn feed.", href: "https://github.com/pjaol/linkedin-cleanup-js", len: 165, angle: 335 },
  ];

  // Stable bit pattern per name, like the binary period marks on the Golden Record
  const bitsFor = (s) => {
    let h = 2166136261;
    for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const out = [];
    for (let i = 0; i < 10; i++) out.push((h >>> i) & 1);
    return out;
  };

  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  const svg = document.getElementById("pulsar");
  const readout = document.getElementById("pulsar-readout");
  const defaultReadout = readout.innerHTML;

  if (svg) {
    const spin = el("g", { class: "spin" }, svg);
    [70, 140, 210, 280].forEach((r) => el("circle", { class: "orbitline", r, cx: 0, cy: 0 }, spin));
    el("circle", { class: "halo", r: 14, cx: 0, cy: 0 }, svg);
    el("circle", { class: "core", r: 4.5, cx: 0, cy: 0 }, svg);

    RAYS.forEach((p, i) => {
      const a = (p.angle * Math.PI) / 180;
      const x = Math.cos(a) * p.len, y = Math.sin(a) * p.len;
      const g = el("g", { tabindex: 0, role: "link", "aria-label": `${p.name}. ${p.note}` }, svg);
      const delay = reduced ? 0 : 400 + i * 90;
      const ray = el("line", { class: "ray draw", x1: 0, y1: 0, x2: x, y2: y }, g);
      ray.style.setProperty("--len", p.len);
      ray.style.setProperty("--dl", `${delay}ms`);

      // binary ticks along the outer section of the ray
      const nx = -Math.sin(a), ny = Math.cos(a);
      const bits = bitsFor(p.name);
      const start = p.len * 0.55, step = (p.len * 0.4) / bits.length;
      bits.forEach((b, j) => {
        const d = start + j * step;
        const cx = Math.cos(a) * d, cy = Math.sin(a) * d;
        const h = b ? 6 : 2.5;
        const t = el("line", { class: "tick draw", x1: cx - nx * h, y1: cy - ny * h, x2: cx + nx * h, y2: cy + ny * h }, g);
        t.style.setProperty("--len", h * 2);
        t.style.setProperty("--dl", `${delay + 900 + j * 30}ms`);
      });

      if (p.galactic) {
        const lab = el("text", { class: "label", x: x - 4, y: y - 12, "text-anchor": "end" }, g);
        lab.textContent = "VGER";
      }

      el("line", { class: "hit", x1: 0, y1: 0, x2: x, y2: y }, g);

      const on = () => {
        svg.querySelectorAll("g.on").forEach((n) => n.classList.remove("on"));
        g.classList.add("on");
        readout.innerHTML = "";
        const k = document.createElement("span"); k.className = "k"; k.textContent = p.name;
        const v = document.createElement("span"); v.className = "v"; v.textContent = p.note;
        readout.append(k, v);
      };
      const off = () => { g.classList.remove("on"); readout.innerHTML = defaultReadout; };
      const go = () => { if (p.href.startsWith("#")) document.querySelector(p.href).scrollIntoView(); else window.open(p.href, "_blank", "noopener"); };

      g.addEventListener("mouseenter", on);
      g.addEventListener("focus", on);
      g.addEventListener("mouseleave", off);
      g.addEventListener("blur", off);
      g.addEventListener("click", go);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  /* ---------- Seven taps on the core. Seven of Nine would approve. ---------- */
  let taps = 0, lastTap = 0;
  if (svg) {
    const core = el("circle", { class: "core-hit", r: 13, cx: 0, cy: 0 }, svg);
    const say = (k, v) => {
      readout.innerHTML = "";
      const a = document.createElement("span"); a.className = "k"; a.textContent = k;
      const b = document.createElement("span"); b.className = "v"; b.textContent = v;
      readout.append(a, b);
    };
    core.addEventListener("mouseenter", () => say("Signal origin", "Something is listening in here. Seven of Nine would know what to do."));
    core.addEventListener("mouseleave", () => { if (!taps) readout.innerHTML = defaultReadout; });
    core.addEventListener("click", (e) => {
      e.stopPropagation();
      const now = Date.now();
      taps = now - lastTap > 2500 ? 1 : taps + 1;
      lastTap = now;
      svg.classList.remove("tap"); void svg.getBBox(); svg.classList.add("tap");
      if (taps >= 7) { taps = 0; readout.innerHTML = defaultReadout; assimilate(); return; }
      say(`Subjunction ${taps} of 7`, taps < 4 ? "Keep going." : "Resistance is weakening.");
      clearTimeout(core._reset);
      core._reset = setTimeout(() => { taps = 0; readout.innerHTML = defaultReadout; }, 2500);
    });
  }

  /* ---------- The flickering streetlight: the core glitches green now and then ---------- */
  if (svg && !reduced) {
    const glitchOnce = (ms) => {
      svg.classList.add("glitch");
      svg.style.setProperty("--gx", `${(Math.random() * 6 - 3).toFixed(1)}px`);
      svg.style.setProperty("--gy", `${(Math.random() * 4 - 2).toFixed(1)}px`);
      setTimeout(() => svg.classList.remove("glitch"), ms);
    };
    const flicker = () => {
      const heroInView = window.scrollY < window.innerHeight;
      if (!document.hidden && heroInView && cx.hidden) {
        // usually one blink, sometimes a stutter, rarely a long sputter
        const r = Math.random();
        const pattern = r < 0.55 ? [90] : r < 0.9 ? [70, 60, 140] : [60, 50, 80, 40, 220];
        let t = 0;
        pattern.forEach((ms, i) => {
          if (i % 2 === 0) setTimeout(() => glitchOnce(ms), t);
          t += ms + 40;
        });
      }
      setTimeout(flicker, 5000 + Math.random() * 9000);
    };
    setTimeout(flicker, 4000 + Math.random() * 3000);
  }

  /* ---------- Mission elapsed time since first push to GitHub ---------- */
  const met = document.getElementById("met");
  const epoch = Date.UTC(2010, 10, 20, 21, 28, 47);
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  const tickMet = () => {
    let s = Math.floor((Date.now() - epoch) / 1000);
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    met.textContent = `${pad(d, 5)}d ${pad(h)}:${pad(m)}:${pad(s)}`;
  };
  if (met) { tickMet(); setInterval(tickMet, 1000); }

  /* ---------- SlideMarks demo: Harvey balls are just characters ---------- */
  const HARVEY = ["\uE000", "\uE001", "\uE002", "\uE003", "\uE004"];
  document.querySelectorAll(".hb").forEach((b) => {
    b.addEventListener("click", () => {
      const v = (Number(b.dataset.v) + 1) % HARVEY.length;
      b.dataset.v = v;
      b.firstElementChild.textContent = HARVEY[v];
      b.lastElementChild.textContent = `Harvey ball ${v * 25} percent`;
    });
  });

  /* ---------- Open source signals ---------- */
  const list = document.getElementById("repos");
  if (list) {
    document.querySelectorAll(".filters button").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.classList.contains("on"));
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filters button").forEach((b) => { b.classList.remove("on"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("on"); btn.setAttribute("aria-pressed", "true");
        const f = btn.dataset.f;
        list.querySelectorAll("li").forEach((li) => { li.hidden = f !== "all" && li.dataset.c !== f; });
      });
    });
  }

  /* ---------- Scroll reveals and active nav ---------- */
  const targets = document.querySelectorAll(".section-head, .payload, .path li, .manifesto, .disciplines li, .quotes figure, .repos li, .hail-inner");
  if (!reduced && "IntersectionObserver" in window) {
    targets.forEach((t) => t.classList.add("inview"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sibs = [...e.target.parentElement.children];
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 70}ms`;
        e.target.classList.add("seen");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    targets.forEach((t) => io.observe(t));
  }

  const navLinks = [...document.querySelectorAll(".bar nav a[href^='#']")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

  document.getElementById("yr").textContent = new Date().getFullYear();

  /* ---------- Type "vger" ---------- */
  const LINES = [
    "V'Ger seeks the Creator.",
    "Carbon unit detected. Shall we build something?",
    "Transmission received. hello@thevgergroup.com is standing by.",
  ];
  const tx = document.getElementById("transmission");
  const txLine = document.getElementById("tx-title");
  const txClose = document.getElementById("tx-close");
  let buf = "", lineIdx = 0, typer;
  const openTx = () => {
    tx.hidden = false;
    txClose.focus();
    const msg = LINES[lineIdx++ % LINES.length];
    clearInterval(typer);
    if (reduced) { txLine.textContent = msg; return; }
    let i = 0; txLine.textContent = "";
    typer = setInterval(() => { txLine.textContent = msg.slice(0, ++i); if (i >= msg.length) clearInterval(typer); }, 45);
  };
  const closeTx = () => { tx.hidden = true; clearInterval(typer); };
  txClose.addEventListener("click", () => setTimeout(closeTx, 0));
  tx.addEventListener("click", (e) => { if (e.target === tx) closeTx(); });
  /* ---------- The Collective ---------- */
  const cx = document.getElementById("collective");
  const cxImg = document.getElementById("cx-img");
  const cxSub = document.getElementById("cx-sub");
  const cxResist = document.getElementById("cx-resist");
  const cxComply = document.getElementById("cx-comply");
  const DIRECTIVES = [
    "Your technical debt will be assimilated.",
    "Your data will be adapted to service us.",
    "Your roadmap will ship on time.",
    "Resistance is futile.",
  ];
  let cxTimers = [];
  const clearCx = () => { cxTimers.forEach(clearTimeout); cxTimers = []; };

  function assimilate() {
    if (!cxImg.getAttribute("src")) cxImg.src = "assets/unimatrix-01.jpg";
    cx.hidden = false;
    cx.classList.remove("ready");
    cxResist.textContent = "Resist";
    cxResist.disabled = false;
    cxSub.textContent = "";
    clearCx();
    const step = reduced ? 0 : 1100;
    DIRECTIVES.forEach((line, i) => {
      cxTimers.push(setTimeout(() => {
        const s = document.createElement("span");
        s.textContent = line;
        if (i === DIRECTIVES.length - 1) s.className = "futile";
        cxSub.appendChild(s);
      }, 900 + i * step));
    });
    cxTimers.push(setTimeout(() => { cx.classList.add("ready"); cxComply.focus(); }, 900 + DIRECTIVES.length * step));
  }

  const endCx = () => {
    clearCx();
    cx.hidden = true;
    document.body.classList.add("assimilated");
  };
  cxComply.addEventListener("click", () => setTimeout(endCx, 0));
  cxResist.addEventListener("click", () => {
    cxResist.textContent = "Futile";
    cxResist.disabled = true;
    cx.classList.add("shake");
    cxTimers.push(setTimeout(() => { cx.classList.remove("shake"); endCx(); }, 1400));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !cx.hidden) return endCx();
    if (e.key === "Escape" && !tx.hidden) return closeTx();
    if (e.target.closest?.("input, textarea") || e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-4);
    if (buf === "vger") { buf = ""; openTx(); }
  });

  console.log("%cpjaol.github.io", "font: 32px serif; color: #d6a548");
  console.log("Reading the source? Good. That's the right instinct. Say hello: hello@thevgergroup.com");
  console.log("Two signals are hidden on this page. Both are hinted in the footer.");
})();
