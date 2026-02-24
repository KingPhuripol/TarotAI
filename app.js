/* ══════════════════════════════════════════
   ARCANUM — AI Tarot Oracle  |  app.js
   ══════════════════════════════════════════ */
"use strict";

// ── Page router ─────────────────────────────────────────────────────
function showPage(name) {
  const home = document.getElementById("page-home");
  const reading = document.getElementById("page-reading");
  const nav = document.getElementById("nav");

  if (name === "reading") {
    home.classList.add("hidden");
    reading.classList.remove("hidden");
    nav.style.display = "none";
    window.scrollTo({ top: 0, behavior: "instant" });
    if (app.phase !== "question") resetToQuestion();
  } else {
    reading.classList.add("hidden");
    home.classList.remove("hidden");
    nav.style.display = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ── Starfield background canvas ─────────────────────────────────────
(function initBgCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    stars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      o: Math.random() * 0.45 + 0.05,
      s: Math.random() * 0.5 + 0.08,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.y += s.s * 0.12;
      s.twinkle += 0.01;
      if (s.y > H) {
        s.y = -2;
        s.x = Math.random() * W;
      }
      const pulse = s.o * (0.7 + 0.3 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      // Vary between gold and silver-blue stars
      const cold = s.twinkle % (Math.PI * 2) < 1.2;
      ctx.fillStyle = cold
        ? `rgba(200,210,255,${(pulse * 0.5).toFixed(3)})`
        : `rgba(201,152,74,${pulse.toFixed(3)})`;
      ctx.fill();
    }
    // Occasional shooting star
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();

// ── Nav behaviour ────────────────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("nav-burger");
  const drawer = document.getElementById("nav-drawer");
  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true },
  );

  if (burger && drawer) {
    burger.addEventListener("click", () => {
      const open = !drawer.classList.contains("hidden");
      drawer.classList.toggle("hidden", open);
      burger.classList.toggle("open", !open);
    });
    // Close drawer on nav link click
    drawer.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        drawer.classList.add("hidden");
        burger.classList.remove("open");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        if (drawer) drawer.classList.add("hidden");
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();

// ── Homepage CTA  buttons ────────────────────────────────────────────
[
  "hero-begin-btn",
  "nav-cta-btn",
  "drawer-begin-btn",
  "steps-begin-btn",
  "cta-begin-btn",
].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", () => showPage("reading"));
});

const navBrandBtn = document.getElementById("nav-brand-btn");
if (navBrandBtn) navBrandBtn.addEventListener("click", () => showPage("home"));

// ── Featured Major Arcana grid ───────────────────────────────────────
(function buildFeaturedGrid() {
  const grid = document.getElementById("feat-grid");
  if (!grid || typeof TAROT_CARDS === "undefined") return;
  const elementIcons = {
    Fire: "🔥",
    Water: "💧",
    Air: "💨",
    Earth: "🌱",
    Spirit: "✨",
    Aether: "✨",
  };
  const featured = TAROT_CARDS.filter((c) => c.arcana === "Major").slice(0, 12);
  grid.innerHTML = featured
    .map(
      (c) => `
    <div class="feat-card">
      <div class="fc-n">${c.number !== null && c.number !== undefined ? c.number : ""}</div>
      <span class="el-icon">${elementIcons[c.element] || "✦"}</span>
      <div class="fc-nm">${c.name}</div>
      <div class="fc-el">${c.element || ""}</div>
    </div>`,
    )
    .join("");
})();

// ── Scroll-reveal (IntersectionObserver) ────────────────────────────
(function initScrollReveal() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("revealed"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// ══════════════════════════════════════════════════════════════════════
//  READING APP STATE
// ══════════════════════════════════════════════════════════════════════
const app = {
  phase: "question",
  question: "",
  spreadType: "three-card",
  drawnCards: [],
  shuffled: false,
};

// ── Helpers ──────────────────────────────────────────────────────────
function setPhase(name) {
  app.phase = name;
  const stepLabels = {
    question: "ขั้นตอนที่ 1 จาก 3",
    spread: "ขั้นตอนที่ 2 จาก 3",
    result: "ผลการดูดวง",
  };
  ["question", "spread", "result"].forEach((p) => {
    const el = document.getElementById(`phase-${p}`);
    if (el) el.classList.toggle("hidden", p !== name);
  });
  const rh = document.getElementById("rh-step");
  if (rh) rh.textContent = stepLabels[name] ?? "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLoading(v) {
  const ov = document.getElementById("loading-overlay");
  if (ov) ov.classList.toggle("hidden", !v);
}

function showError(msg) {
  const b = document.getElementById("error-banner");
  const m = document.getElementById("error-msg");
  if (b && m) {
    m.textContent = msg;
    b.classList.remove("hidden");
  }
}

function hideError() {
  const b = document.getElementById("error-banner");
  if (b) b.classList.add("hidden");
}

function resetToQuestion() {
  app.question = "";
  app.spreadType = "three-card";
  app.drawnCards = [];
  app.shuffled = false;

  const qi = document.getElementById("question-input");
  if (qi) qi.value = "";
  const cc = document.getElementById("char-count");
  if (cc) cc.textContent = "0";
  const bp = document.getElementById("btn-proceed");
  if (bp) bp.disabled = true;

  document.querySelectorAll(".spread-opt").forEach((el, i) => {
    el.classList.toggle("selected", i === 0);
    el.setAttribute("aria-checked", i === 0 ? "true" : "false");
  });

  setPhase("question");
}

// ── Step 1 — Question ─────────────────────────────────────────────────
const qInput = document.getElementById("question-input");
if (qInput) {
  qInput.addEventListener("input", () => {
    const v = qInput.value.trim();
    app.question = v;
    const cc = document.getElementById("char-count");
    if (cc) cc.textContent = qInput.value.length;
    const bp = document.getElementById("btn-proceed");
    if (bp) bp.disabled = v.length < 5;
  });
}

// Example question chips
document.querySelectorAll(".eq-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    if (!qInput) return;
    qInput.value = chip.textContent.trim();
    qInput.dispatchEvent(new Event("input"));
    qInput.focus();
    // Subtle flash feedback
    chip.style.borderColor = "var(--gold)";
    chip.style.color = "var(--gold-pale)";
    setTimeout(() => {
      chip.style.borderColor = "";
      chip.style.color = "";
    }, 600);
  });
});

document.querySelectorAll(".spread-opt").forEach((el) => {
  function selectIt() {
    document.querySelectorAll(".spread-opt").forEach((o) => {
      o.classList.remove("selected");
      o.setAttribute("aria-checked", "false");
    });
    el.classList.add("selected");
    el.setAttribute("aria-checked", "true");
    app.spreadType = el.dataset.spread;
  }
  el.addEventListener("click", selectIt);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectIt();
    }
  });
});

const btnProceed = document.getElementById("btn-proceed");
if (btnProceed) {
  btnProceed.addEventListener("click", () => {
    if (app.question.length < 5) return;
    app.shuffled = false;
    app.drawnCards = [];
    buildSpreadView();
    setPhase("spread");
  });
}

// ── Step 2 — Spread ───────────────────────────────────────────────────
function buildSpreadView() {
  if (typeof SPREADS === "undefined") return;
  const spread = SPREADS[app.spreadType];
  if (!spread) return;

  const titleEl = document.getElementById("spread-title");
  if (titleEl) titleEl.textContent = spread.name;
  const descEl = document.getElementById("spread-desc");
  if (descEl) descEl.textContent = spread.description || "";
  const qdEl = document.getElementById("question-display");
  if (qdEl) qdEl.textContent = `"${app.question}"`;

  const container = document.getElementById("card-slots");
  if (!container) return;
  container.innerHTML = spread.positions
    .map(
      (pos, i) =>
        `<div class="card-slot" id="slot-${i}">
       <div class="slot-pos">${pos}</div>
       <div class="card-flip">
         <div class="card-flip-inner" id="flip-inner-${i}">
           <div class="card-flip-back">
             <div class="slot-back-star">✦</div>
             <div class="slot-back-arcanum">ARCANUM</div>
           </div>
           <div class="card-flip-front" id="flip-front-${i}"></div>
         </div>
       </div>
     </div>`,
    )
    .join("");

  // In pick mode: clicking an empty slot opens the picker for that slot
  container.addEventListener("click", (e) => {
    if (currentMode !== "pick") return;
    const slot = e.target.closest(".card-slot:not(.drawn)");
    if (!slot) return;
    pickerCurrentSlot = parseInt(slot.id.replace("slot-", ""), 10);
    const posNameEl = document.getElementById("picker-pos-name");
    if (posNameEl)
      posNameEl.textContent =
        spread.positions[pickerCurrentSlot] ?? `Card ${pickerCurrentSlot + 1}`;
    buildCircleCards();
    buildPickerProgress();
    if (pickerOverlay) pickerOverlay.classList.remove("hidden");
  });

  const btnReveal = document.getElementById("btn-reveal");
  if (btnReveal) btnReveal.disabled = true;

  const hint = document.querySelector(".shuffle-hint");
  if (hint)
    hint.textContent =
      currentMode === "scan"
        ? "Scan each physical card with your camera."
        : "Click any face-down card — or 'Pick Next Card' — to choose from all 78 cards.";
}

// ── Shared: place a card (any source) into a slot ─────────────────────
function placeCardInSlot(i, card, animate = true) {
  const slot = document.getElementById(`slot-${i}`);
  if (!slot) return;
  const spread = SPREADS[app.spreadType];
  const pos = spread?.positions?.[i] ?? `Card ${i + 1}`;
  const imgSrc =
    (typeof CARD_IMAGES !== "undefined" && CARD_IMAGES[card.name]) || "";

  const flipFront = slot.querySelector(".card-flip-front");
  const flipInner = slot.querySelector(".card-flip-inner");

  if (flipFront && flipInner) {
    // Card-flip structure: fill front face then flip
    flipFront.innerHTML = `
      ${imgSrc ? `<img class="slot-img" src="${imgSrc}" alt="${card.name}" loading="lazy">` : ""}
      <div class="slot-name">${card.name}</div>
      ${card.reversed ? '<div class="slot-rev">⟳ Reversed</div>' : ""}
      <div class="slot-el">${card.element || ""}</div>`;
    slot.classList.toggle("reversed", !!card.reversed);
    slot.classList.remove("pick-empty");
    slot.classList.add("drawn");
    if (animate) {
      setTimeout(() => flipInner.classList.add("flipped"), 80);
    } else {
      flipInner.classList.add("flipped");
    }
  } else {
    // Fallback: no flip structure present
    const elementIcons = {
      Fire: "🔥",
      Water: "💧",
      Air: "💨",
      Earth: "🌱",
      Spirit: "✨",
      Aether: "✨",
    };
    slot.innerHTML = `
      <div class="slot-pos">${pos}</div>
      ${imgSrc ? `<img class="slot-img" src="${imgSrc}" alt="${card.name}" loading="lazy">` : `<div class="slot-icon">${elementIcons[card.element] || "✦"}</div>`}
      <div class="slot-name">${card.name}</div>
      ${card.reversed ? '<div class="slot-rev">⟳ Reversed</div>' : ""}`;
    slot.classList.add("drawn");
    slot.classList.toggle("reversed", !!card.reversed);
    if (animate) {
      slot.classList.add("drawing");
      setTimeout(() => slot.classList.remove("drawing"), 600);
    }
  }
}

const btnReveal = document.getElementById("btn-reveal");
if (btnReveal) {
  btnReveal.addEventListener("click", async () => {
    const spread =
      typeof SPREADS !== "undefined" ? SPREADS[app.spreadType] : null;
    const totalSlots = spread ? spread.positions.length : 0;
    const filledCards = app.drawnCards.filter(Boolean);
    if (filledCards.length === 0) return;
    // Allow partial readings — fill missing slots with random if needed
    if (filledCards.length < totalSlots) {
      const missing = totalSlots - filledCards.length;
      const extras = typeof drawCards !== "undefined" ? drawCards(missing) : [];
      for (let i = 0; i < totalSlots; i++) {
        if (!app.drawnCards[i] && extras.length) {
          app.drawnCards[i] = extras.shift();
          placeCardInSlot(i, app.drawnCards[i], true);
        }
      }
    }
    showLoading(true);
    hideError();
    try {
      const result = await getTarotReading(
        app.question,
        app.drawnCards.filter(Boolean),
        app.spreadType,
      );
      renderResult(result);
      setPhase("result");
    } catch (err) {
      console.error("OpenAI API error, falling back to local reading:", err);
      try {
        const localSpread =
          typeof SPREADS !== "undefined" ? SPREADS[app.spreadType] : null;
        if (localSpread && typeof getMockReading !== "undefined") {
          const mock = getMockReading(
            app.question,
            localSpread,
            app.drawnCards.filter(Boolean),
          );
          renderResult(mock);
          setPhase("result");
        } else {
          showError("The Oracle is temporarily unavailable. Please try again.");
        }
      } catch (e2) {
        showError("The Oracle is temporarily unavailable. Please try again.");
      }
    } finally {
      showLoading(false);
    }
  });
}

// ── Step 3 — Render result ────────────────────────────────────────────
function renderResult(data) {
  const spread =
    typeof SPREADS !== "undefined" ? SPREADS[app.spreadType] : null;

  const snEl = document.getElementById("selected-spread-name");
  if (snEl) snEl.textContent = spread?.name ?? "";
  const qdRes = document.getElementById("question-display-result");
  if (qdRes) qdRes.textContent = `"${app.question}"`;

  // ── Drawn cards visual row ──────────────────────────────────────────
  const cardsRowEl = document.getElementById("result-cards-row");
  if (cardsRowEl) {
    const positions = spread?.positions ?? [];
    cardsRowEl.innerHTML = app.drawnCards
      .filter(Boolean)
      .map((card, i) => {
        const imgSrc =
          (typeof CARD_IMAGES !== "undefined" && CARD_IMAGES[card.name]) || "";
        return `<div class="rc-thumb" style="animation-delay:${i * 0.15}s">
          <div class="rc-thumb-img-wrap${card.reversed ? " reversed" : ""}">
            ${imgSrc ? `<img src="${imgSrc}" alt="${card.name}">` : `<div class="rc-thumb-placeholder">✦</div>`}
            ${card.reversed ? `<div class="rc-thumb-rev">&#8597; Reversed</div>` : ""}
          </div>
          <div class="rc-thumb-pos">${positions[i] ?? `Card ${i + 1}`}</div>
          <div class="rc-thumb-name">${card.name}</div>
        </div>`;
      })
      .join("");
  }

  // Oracle summary
  const sumEl = document.getElementById("result-summary");
  if (sumEl) sumEl.textContent = data.summary ?? "";

  // Visualisation
  const viz = data.visualization_data ?? {};

  const oeEl = document.getElementById("overall-energy");
  if (oeEl) oeEl.textContent = viz.overall_energy ?? "—";

  const deEl = document.getElementById("dominant-element");
  if (deEl) {
    deEl.textContent = viz.dominant_element ?? "—";
    if (viz.dominant_element && typeof getElementColor === "function") {
      const c = getElementColor(viz.dominant_element);
      deEl.style.color = c?.primary ?? "";
    }
  }

  const score = parseInt(viz.energy_score) || 0;
  const esEl = document.getElementById("energy-score");
  if (esEl) esEl.textContent = `${viz.energy_score ?? "—"} / 10`;
  const fill = document.querySelector(".score-fill");
  if (fill) fill.style.width = `${score * 10}%`;

  // Element bars
  const elBars = document.getElementById("element-bars");
  if (elBars) {
    const dist = viz.element_distribution ?? {};
    const elColors = {
      Fire: "#e55",
      Water: "#5599dd",
      Air: "#99ccee",
      Earth: "#7cb870",
      Spirit: "#cc88ee",
      Aether: "#cc88ee",
    };
    elBars.innerHTML = Object.entries(dist)
      .map(
        ([el, ct]) => `
      <div class="el-bar-row">
        <span class="el-bar-label">${el}</span>
        <div class="el-bar-track"><div class="el-bar-fill" style="width:${Math.min(ct * 20, 100)}%;background:${elColors[el] || "#c9984a"}"></div></div>
        <span class="el-bar-ct">${ct}</span>
      </div>`,
      )
      .join("");
  }

  // Key themes
  const ktEl = document.getElementById("key-themes");
  if (ktEl) {
    const themes = viz.key_themes ?? [];
    ktEl.innerHTML = themes
      .map((t) => `<span class="theme">${t}</span>`)
      .join("");
  }

  // Fortune telling phrases (from card data)
  const fortunes = app.drawnCards.flatMap((c) => c.fortune_telling ?? []);
  const fp = document.getElementById("fortune-panel");
  const fl = document.getElementById("fortune-phrases");
  if (fp && fl) {
    if (fortunes.length > 0) {
      fl.innerHTML = fortunes
        .slice(0, 6)
        .map((f) => `<div class="fortune-item">${f}</div>`)
        .join("");
      fp.style.display = "";
    } else {
      fp.style.display = "none";
    }
  }

  // Per-card readings
  const crEl = document.getElementById("card-readings");
  if (crEl) {
    const cardReadings = data.card_readings ?? [];
    const positions = spread?.positions ?? [];
    crEl.innerHTML = cardReadings
      .map((cr, i) => {
        const card = app.drawnCards[i];
        const keywords = card?.keywords ?? [];
        const elCol =
          card && typeof getElementColor === "function"
            ? (getElementColor(card.element)?.primary ?? "#c9984a")
            : "#c9984a";
        const cardImgSrc =
          (typeof CARD_IMAGES !== "undefined" &&
            card &&
            CARD_IMAGES[card.name]) ||
          "";
        return `<div class="reading-card" style="--accent:${elCol};border-left-color:${elCol}">
          ${cardImgSrc ? `<img class="rc-card-img${card?.reversed ? " reversed" : ""}" src="${cardImgSrc}" alt="${card?.name ?? ""}">` : ""}
          <div class="rc-body">
            <div class="rc-head">
              <div>
                <span class="rc-pos">${positions[i] ?? ""}&nbsp;&middot;&nbsp;</span>
                <span class="rc-name">${cr.card_name ?? card?.name ?? ""}</span>
                ${card?.reversed ? '<span class="rc-rev"> Reversed</span>' : ""}
              </div>
            </div>
            <p class="rc-interp">${cr.interpretation ?? ""}</p>
            ${
              keywords.length > 0
                ? `<div class="rc-keywords">${keywords
                    .slice(0, 5)
                    .map((k) => `<span class="rc-kw">${k}</span>`)
                    .join("")}</div>`
                : ""
            }
          </div>
        </div>`;
      })
      .join("");
  }

  // Questions to reflect on
  const allQ = app.drawnCards.flatMap((c) => c.questions_to_ask ?? []);
  const qp = document.getElementById("questions-panel");
  const ql = document.getElementById("questions-list");
  if (qp && ql) {
    if (allQ.length > 0) {
      ql.innerHTML = allQ
        .slice(0, 5)
        .map((q) => `<li>${q}</li>`)
        .join("");
      qp.style.display = "";
    } else {
      qp.style.display = "none";
    }
  }

  // Advice & closing
  const advEl = document.getElementById("advice-text");
  if (advEl) advEl.textContent = data.advice ?? "";
  const clEl = document.getElementById("closing-msg");
  if (clEl) clEl.textContent = data.closing_message ?? "";
}

// ── Navigation back/new-reading ──────────────────────────────────────
const backBtn = document.getElementById("back-btn");
if (backBtn) backBtn.addEventListener("click", () => showPage("home"));

const btnBackHome = document.getElementById("btn-back-home");
if (btnBackHome) btnBackHome.addEventListener("click", () => showPage("home"));

const btnNewReading = document.getElementById("btn-new-reading");
if (btnNewReading)
  btnNewReading.addEventListener("click", () => {
    resetToQuestion();
    showPage("reading");
  });

const dismissError = document.getElementById("dismiss-error");
if (dismissError) dismissError.addEventListener("click", hideError);

// ── Camera / Vision Scanning ─────────────────────────────────────────
let camStream = null;
let camCurrentSlot = 0;
let camDetectedCard = null;
let camDetectedRev = false;

const camOverlay = document.getElementById("camera-modal");
const camVideo = document.getElementById("cam-video");
const camCanvas = document.getElementById("cam-canvas");
const camFeedWrap = document.getElementById("cam-feed-wrap");
const camPrevWrap = document.getElementById("cam-preview-wrap");
const camPrevImg = document.getElementById("cam-preview-img");
const camDetectBox = document.getElementById("cam-detect-box");
const camDetectSt = document.getElementById("cam-detect-status");
const camSlotName = document.getElementById("cam-slot-name");
const camResult = document.getElementById("cam-result");
const camResName = document.getElementById("cam-result-name");
const camResMeta = document.getElementById("cam-result-meta");
const camResConf = document.getElementById("cam-result-conf");
const camErr = document.getElementById("cam-err");
const camProgress = document.getElementById("cam-progress");
const btnCapture = document.getElementById("cam-btn-capture");
const btnRetake = document.getElementById("cam-btn-retake");
const btnUseCam = document.getElementById("cam-btn-use");

function buildProgressDots() {
  if (!camProgress) return;
  const spread = SPREADS[app.spreadType];
  if (!spread) return;
  const count = spread.positions.length;
  camProgress.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className =
      "cam-dot" +
      (i < camCurrentSlot ? " done" : i === camCurrentSlot ? " active" : "");
    camProgress.appendChild(d);
  }
}

function resetToLiveFeed() {
  if (camFeedWrap) camFeedWrap.classList.remove("hidden");
  if (camPrevWrap) camPrevWrap.classList.add("hidden");
  if (camDetectBox) camDetectBox.classList.add("hidden");
  if (camResult) camResult.classList.add("hidden");
  if (camErr) camErr.classList.add("hidden");
  if (btnUseCam) btnUseCam.disabled = true;
  if (btnCapture) btnCapture.disabled = false;
  if (btnRetake) btnRetake.disabled = true;
  camDetectedCard = null;
}

async function openCameraModal() {
  if (!camOverlay) return;

  const spread = SPREADS[app.spreadType];
  if (!spread) return;

  // Find first empty slot
  camCurrentSlot = 0;
  for (let i = 0; i < app.drawnCards.length; i++) {
    if (app.drawnCards[i]) camCurrentSlot++;
    else {
      camCurrentSlot = i;
      break;
    }
  }

  // Update slot label
  const pos = spread.positions[camCurrentSlot];
  if (camSlotName)
    camSlotName.textContent = pos ? pos.name : `Card ${camCurrentSlot + 1}`;

  resetToLiveFeed();
  buildProgressDots();
  camOverlay.classList.remove("hidden");

  try {
    camStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 960 },
      },
    });
    camVideo.srcObject = camStream;
    await camVideo.play();
  } catch (err) {
    // Fall back to front camera
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      camVideo.srcObject = camStream;
      await camVideo.play();
    } catch (e) {
      showCamError("Camera access denied or unavailable: " + e.message);
      if (camFeedWrap) camFeedWrap.classList.add("hidden");
    }
  }
}

function closeCameraModal() {
  if (camStream) {
    camStream.getTracks().forEach((t) => t.stop());
    camStream = null;
  }
  if (camOverlay) camOverlay.classList.add("hidden");
  if (camVideo) camVideo.srcObject = null;
}

async function captureFrame() {
  if (!camVideo || !camCanvas) return;
  const w = camVideo.videoWidth || 640;
  const h = camVideo.videoHeight || 480;
  camCanvas.width = w;
  camCanvas.height = h;
  camCanvas.getContext("2d").drawImage(camVideo, 0, 0, w, h);

  const dataURL = camCanvas.toDataURL("image/jpeg", 0.85);
  if (camPrevImg) camPrevImg.src = dataURL;

  if (camFeedWrap) camFeedWrap.classList.add("hidden");
  if (camPrevWrap) camPrevWrap.classList.remove("hidden");
  if (camDetectBox) camDetectBox.classList.remove("hidden");
  if (camDetectSt) camDetectSt.textContent = "กำลังวิเคราะห์ภาพ…";
  if (camResult) camResult.classList.add("hidden");
  if (camErr) camErr.classList.add("hidden");
  if (btnCapture) btnCapture.disabled = true;
  if (btnRetake) btnRetake.disabled = false;

  // base64 without prefix
  const base64 = dataURL.split(",")[1];
  try {
    const result = await detectCardFromImage(base64, "image/jpeg");
    showDetectionResult(result);
  } catch (e) {
    showCamError(e.message || "Detection failed — please retake");
  }
}

function showDetectionResult(result) {
  if (camDetectBox) camDetectBox.classList.add("hidden");

  const matched = findCardByName(result.card_name || "");
  if (!matched) {
    showCamError(`Could not match "${result.card_name}" — please retake`);
    return;
  }

  camDetectedCard = matched;
  camDetectedRev = !!result.reversed;

  if (camResName) camResName.textContent = matched.name;
  if (camResMeta) {
    camResMeta.textContent = camDetectedRev ? "⟳ Reversed" : "Upright";
    camResMeta.style.color = camDetectedRev ? "#e55" : "var(--gold-pale)";
  }
  const conf = result.confidence
    ? Math.round(result.confidence * 100) + "%"
    : "";
  if (camResConf) camResConf.textContent = conf ? `Confidence: ${conf}` : "";

  if (camResult) camResult.classList.remove("hidden");
  if (btnUseCam) btnUseCam.disabled = false;
}

function useDetectedCard() {
  if (!camDetectedCard) return;

  const card = { ...camDetectedCard, reversed: camDetectedRev };
  app.drawnCards[camCurrentSlot] = card;
  placeCardInSlot(camCurrentSlot, card, true);

  // Check if all slots are filled
  const spread = SPREADS[app.spreadType];
  const total = spread ? spread.positions.length : 1;
  const filled = app.drawnCards.filter(Boolean).length;

  if (filled >= total) {
    closeCameraModal();
    const revealBtn = document.getElementById("btn-reveal");
    if (revealBtn) revealBtn.disabled = false;
  } else {
    // Advance to next empty slot
    camCurrentSlot = app.drawnCards.findIndex((c) => !c);
    if (camCurrentSlot === -1) {
      closeCameraModal();
      return;
    }
    const pos = spread.positions[camCurrentSlot];
    if (camSlotName)
      camSlotName.textContent = pos ?? `Card ${camCurrentSlot + 1}`;
    buildProgressDots();
    resetToLiveFeed();
  }
}

function showCamError(msg) {
  if (camDetectBox) camDetectBox.classList.add("hidden");
  if (camErr) {
    camErr.textContent = msg;
    camErr.classList.remove("hidden");
  }
  if (camFeedWrap) camFeedWrap.classList.remove("hidden");
  if (camPrevWrap) camPrevWrap.classList.add("hidden");
  if (btnCapture) btnCapture.disabled = false;
  if (btnRetake) btnRetake.disabled = true;
}

// Wire-up
const btnScan = document.getElementById("btn-scan");
if (btnScan) btnScan.addEventListener("click", openCameraModal);

const camCloseBtn = document.getElementById("cam-close");
if (camCloseBtn) camCloseBtn.addEventListener("click", closeCameraModal);

if (btnCapture) btnCapture.addEventListener("click", captureFrame);
if (btnUseCam) btnUseCam.addEventListener("click", useDetectedCard);
if (btnRetake)
  btnRetake.addEventListener("click", () => {
    resetToLiveFeed();
    if (camFeedWrap) camFeedWrap.classList.remove("hidden");
  });

// ══════════════════════════════════════════════════════════════════════
//  MODE TABS  (Pick Cards / Scan Cards)
// ══════════════════════════════════════════════════════════════════════
let currentMode = "pick";

function setMode(mode) {
  currentMode = mode;
  document
    .querySelectorAll(".mode-tab")
    .forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
  const btnPickEl = document.getElementById("btn-pick");
  const btnScanEl = document.getElementById("btn-scan");
  if (btnPickEl) btnPickEl.classList.toggle("hidden", mode !== "pick");
  if (btnScanEl) btnScanEl.classList.toggle("hidden", mode !== "scan");

  const hint = document.querySelector(".shuffle-hint");
  if (hint) {
    if (mode === "pick")
      hint.textContent =
        "คลิกไพ่ในวงแหวน — หรือกด 'เลือกไพ่ถัดไป' เพื่อเลือกจากไพ่ 78 ใบ";
    else hint.textContent = "สแกไพ่จริงแต่ละใบด้วยกล้อง";
  }

  // Always reset when switching mode
  app.drawnCards = [];
  app.shuffled = false;
  const revBtn = document.getElementById("btn-reveal");
  if (revBtn) revBtn.disabled = true;
  if (app.phase === "spread") {
    buildSpreadView();
    if (mode === "pick") {
      setTimeout(() => {
        document
          .querySelectorAll(".card-slot")
          .forEach((s) => s.classList.add("pick-empty"));
      }, 50);
    }
  }
}

document.querySelectorAll(".mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => setMode(tab.dataset.mode));
});

// ══════════════════════════════════════════════════════════════════════
//  CARD PICKER MODAL
// ══════════════════════════════════════════════════════════════════════
let pickerCurrentSlot = 0;

const pickerOverlay = document.getElementById("picker-modal");
const pickerRevCb = document.getElementById("picker-rev");
const pickerProgress = document.getElementById("picker-progress");

// Build 78-card circle/ring inside the picker overlay
function buildCircleCards() {
  const container = document.getElementById("circle-cards");
  if (!container || typeof TAROT_CARDS === "undefined") return;

  const usedNames = new Set(app.drawnCards.filter(Boolean).map((c) => c.name));

  // Shuffle a copy so ring order is random every time
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
  const total = shuffled.length;

  container.innerHTML = shuffled
    .map((card, i) => {
      const angle = (360 / total) * i;
      const imgSrc =
        (typeof CARD_IMAGES !== "undefined" && CARD_IMAGES[card.name]) || "";
      const isUsed = usedNames.has(card.name);
      return `<button class="cp-card${isUsed ? " used" : ""}"
        style="--ca:${angle}deg"
        data-name="${card.name}"
        aria-label="${card.name}"
        type="button">
      <div class="cp-card-inner">
        <div class="cp-card-back">
          <span class="cp-card-back-star">✦</span>
          <span class="cp-card-back-text">ARCANUM</span>
        </div>
        <div class="cp-card-face">
          ${imgSrc ? `<img src="${imgSrc}" alt="${card.name}" loading="lazy">` : ""}
        </div>
      </div>
    </button>`;
    })
    .join("");

  const previewImg = document.getElementById("cp-preview-img");
  const previewName = document.getElementById("cp-preview-name");
  const previewEl = document.getElementById("cp-preview");
  const cpCenter = document.getElementById("cp-center");

  container.querySelectorAll(".cp-card:not(.used)").forEach((el) => {
    const name = el.dataset.name;
    const img = el.querySelector("img");
    el.addEventListener("mouseenter", () => {
      if (previewEl && img) {
        if (previewImg) previewImg.src = img.src;
        if (previewName) previewName.textContent = name;
        previewEl.classList.remove("hidden");
        cpCenter?.classList.add("hidden");
      }
    });
    el.addEventListener("mouseleave", () => {
      previewEl?.classList.add("hidden");
      cpCenter?.classList.remove("hidden");
    });
    el.addEventListener("click", () => {
      const card = TAROT_CARDS.find((c) => c.name === name);
      if (card) selectPickedCard(card);
    });
  });
}

// Build progress dots in the picker footer
function buildPickerProgress() {
  if (!pickerProgress || typeof SPREADS === "undefined") return;
  const spread = SPREADS[app.spreadType];
  if (!spread) return;
  pickerProgress.innerHTML = spread.positions
    .map((_, i) => {
      const done = !!app.drawnCards[i];
      const current = i === pickerCurrentSlot && !done;
      return `<div class="picker-dot${done ? " done" : ""}${current ? " current" : ""}"></div>`;
    })
    .join("");
}

function openPickerModal(slotIndex = -1) {
  if (!pickerOverlay || typeof SPREADS === "undefined") return;
  const spread = SPREADS[app.spreadType];
  if (!spread) return;

  if (slotIndex >= 0) {
    pickerCurrentSlot = slotIndex;
  } else {
    pickerCurrentSlot = app.drawnCards.findIndex((c) => !c);
    if (pickerCurrentSlot === -1) pickerCurrentSlot = 0;
  }

  const posNameEl = document.getElementById("picker-pos-name");
  if (posNameEl)
    posNameEl.textContent =
      spread.positions[pickerCurrentSlot] ?? `Card ${pickerCurrentSlot + 1}`;

  if (pickerRevCb) pickerRevCb.checked = false;

  buildCircleCards();
  buildPickerProgress();
  pickerOverlay.classList.remove("hidden");
}

function closePickerModal() {
  if (pickerOverlay) pickerOverlay.classList.add("hidden");
}

function selectPickedCard(card) {
  if (!card) return;
  const reversed = pickerRevCb?.checked || false;
  const fullCard = { ...card, reversed };

  app.drawnCards[pickerCurrentSlot] = fullCard;
  app.shuffled = true;
  placeCardInSlot(pickerCurrentSlot, fullCard, true);

  const spread = SPREADS[app.spreadType];
  const total = spread ? spread.positions.length : 1;
  const filled = app.drawnCards.filter(Boolean).length;

  if (filled >= total) {
    closePickerModal();
    const revealBtn = document.getElementById("btn-reveal");
    if (revealBtn) revealBtn.disabled = false;
  } else {
    // Advance to next empty slot
    const next = app.drawnCards.findIndex((c) => !c);
    if (next === -1) {
      closePickerModal();
      return;
    }
    pickerCurrentSlot = next;
    const posNameEl = document.getElementById("picker-pos-name");
    if (posNameEl)
      posNameEl.textContent =
        spread.positions[pickerCurrentSlot] ?? `Card ${pickerCurrentSlot + 1}`;
    buildCircleCards();
    buildPickerProgress();
  }
}

// ── Picker event listeners ─────────────────────────────────────────────
const btnPickEl = document.getElementById("btn-pick");
if (btnPickEl) btnPickEl.addEventListener("click", () => openPickerModal());

const pickerCloseBtn = document.getElementById("picker-close");
if (pickerCloseBtn) pickerCloseBtn.addEventListener("click", closePickerModal);

// Close on backdrop click (clicking outside the ring)
if (pickerOverlay) {
  pickerOverlay.addEventListener("click", (e) => {
    if (e.target === pickerOverlay) closePickerModal();
  });
}
