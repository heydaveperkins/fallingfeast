/*
 * FALLING FEAST: a Thanksgiving 8-bit arcade game.
 *
 * Everything you see is drawn and animated by game.riv. This file owns the
 * rules (input, spawning, difficulty, collision, power-ups, lives, scoring)
 * and talks to Rive only through view model properties (see README).
 *
 * Positions are art pixels: the artboard is 180 x 390.
 */
(() => {
  "use strict";

  /* ======================================================================
   * TUNING. Everything you might want to adjust is in this one block.
   * ==================================================================== */
  const GRAVY_BOAT_WIDTH = 56; // art pixels. The quick-tweak: basket is 32, try 48..72.

  const CONFIG = {
    // --- lives and score ---------------------------------------------------
    maxLives: 5,
    points: { good: 1, acorn: 1 },   // points per catch (before the feather multiplier)
    featherScoreMultiplier: 2,       // all catches while the rainbow feather is active

    // --- the basket ----------------------------------------------------------
    basketWidth: 32,                 // normal cornucopia width (must match the art)
    basketSpeed: 1600,               // max art px/s (high = it follows the finger closely)
    catchPadding: 4,                 // extra grace each side, art px
    touchMode: "relative",           // "relative": drag anywhere, basket moves by the finger's movement
                                     // "absolute": basket sits at the finger's x (finger is below/over it)
    touchSensitivity: 1.0,           // relative mode: art px moved per art px dragged

    // --- levels --------------------------------------------------------------
    // Difficulty only changes when the level changes. Catching `catchesPerLevel`
    // good items (the gold acorn counts, power-ups do not) advances the level.
    catchesPerLevel: 50,
    levelCountdownSteps: 3,          // level-up: everything freezes, the new level is shown, then it counts down 3-2-1
    levelCountdownStep: 0.7,         // seconds per count (the basket can still move during the pause)
    // Per-level values: value(L) = start + perLevel * (L - 1), clamped to the limit
    baseSpeed: 55,                   // fall speed, art px/s, at level 1
    speedPerLevel: 28,
    maxSpeed: 235,
    speedJitter: 0.03,               // +/- random variation per item
    startInterval: 0.95,             // seconds between spawns at level 1
    intervalPerLevel: -0.15,
    minInterval: 0.17,
    intervalJitter: 0.30,
    hazardShareStart: 0.10,          // share of spawns that are hazards at level 1
    hazardSharePerLevel: 0.13,
    hazardShareMax: 0.80,
    bagSize: 14,                     // the shuffled bag: no long streaks of one type
    hazardGapStart: 0.50,            // min seconds between hazard spawns at level 1
    hazardGapPerLevel: -0.09,
    hazardGapMin: 0.05,
    stepHz: 60,                      // simulation + pixel-step rate. 30 = more "stepped" but judders; 60 is easier on the eyes

    // --- fairness: a reachable gap is always kept until this level, after which the
    // wall of hazards is allowed to become undodgeable and the run ends
    fairUntilLevel: 6,
    minSafeGap: 10,                  // art px of reachable free space required while fair
    fairWindow: 0.55,                // seconds: hazards this close together in time count as "the same row"

    // --- power-ups ---------------------------------------------------------------
    // A power-up item is dropped every powerBaseInterval * (1 + powerIntervalPerLevel * (level - 1)) seconds
    powerBaseInterval: 13,
    powerIntervalPerLevel: 0.12,     // a power-up is due every base * (1 + perLevel * (level - 1)) seconds
    powerWeights: {                  // relative odds when one is due
      acorn: 3, gravy: 2, feather: 2, tin: 2,
    },
    acornWeightWhenFull: 0.3,        // gold acorn is less likely when lives are already full
    gravySeconds: 10,
    featherSeconds: 10,
    warnSeconds: 2,                  // blink warning before a power-up ends
    featherSlowFactor: 0.55,         // fall-speed multiplier during the rainbow feather (spawn rate is NOT slowed)

    // --- timing -----------------------------------------------------------------
    countdownStep: 0.8,              // seconds per 3-2-1-GO
    gameOverDelay: 1.1,              // seconds between the last hit and the dinner table
    playAgainLock: 0.8,              // seconds before the dinner screen accepts a tap
  };

  // Layout constants (art pixels): these match the art in scene.rml
  const ART_W = 180, ART_H = 390;
  const SPAWN_Y = 22;                // items start hidden under the HUD band and slide out
  const BASKET_TOP = 344;            // top of the basket mouth
  const FLOOR_Y = 366;
  const ITEM_HALF = 9;               // item half-width for collision (items are drawn 1.5x: see ITEM_SCALE in tools/gen.py)
  const CAP_W = 12;                  // gravy boat cap width (art)

  // Pool: how many of each item exist (must match SLOTS in tools/gen.py)
  const GOOD = ["turkey", "pie", "roll", "corn", "cranberry", "potato", "sweet", "casserole", "apple", "acorn"];
  const HAZARD = ["burnt", "sprout", "tomato", "pan", "plate", "frozen"];
  const POWER = ["gravy", "feather", "tin"];
  const SLOTS = { acorn: 2, gravy: 1, feather: 1, tin: 1 };
  [...GOOD, ...HAZARD, ...POWER].forEach((k) => { if (!SLOTS[k]) SLOTS[k] = HAZARD.includes(k) ? 5 : 4; });
  const PLAIN_GOOD = GOOD.filter((k) => k !== "acorn");

  /* ======================================================================
   * Utilities
   * ==================================================================== */
  const $ = (id) => document.getElementById(id);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad6 = (n) => String(Math.min(999999, n)).padStart(6, "0");
  const debug = /[?&]debug\b/.test(location.search);

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem("fallingFeast." + k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("fallingFeast." + k, String(v)); } catch (e) { /* private mode */ } },
  };

  /* ======================================================================
   * Rive
   * ==================================================================== */
  const canvas = $("game");
  const frame = $("frame");
  const riveLib = window.rive;
  riveLib.RuntimeLoader.setWasmUrl("vendor/rive-webgl2-2.44.2/rive.wasm");
  riveLib.RuntimeLoader.setWasmFallbackUrl("vendor/rive-webgl2-2.44.2/rive_fallback.wasm");

  let r = null, vm = null, riveReady = false;
  const handles = new Map(), sent = new Map();

  function handle(type, path) {
    const key = type + ":" + path;
    if (!handles.has(key)) {
      const h = vm ? vm[type](path) : null;
      if (!h) console.warn("Falling Feast: no view model property", path);
      handles.set(key, h);
    }
    return handles.get(key);
  }
  function put(type, path, value) {
    if (sent.get(path) === value) return;
    const h = handle(type, path);
    if (!h) return;
    h.value = value;
    sent.set(path, value);
  }
  const setNum = (p, v) => put("number", p, Math.round(v * 100) / 100);
  const setBool = (p, v) => put("boolean", p, !!v);
  const setStr = (p, v) => put("string", p, v);
  const setEnum = (p, v) => put("enum", p, v);
  const fire = (p) => { const h = handle("trigger", p); if (h) h.trigger(); };

  // Rive state is written once per simulation step, only when it changed.
  function startRive() {
    r = new riveLib.Rive({
      src: "game.riv" + (window.FALLING_BUILD ? "?v=" + window.FALLING_BUILD : ""),
      canvas,
      stateMachine: "Game",
      autoplay: true,
      autoBind: true,
      shouldDisableRiveListeners: true, // all input is handled below
      layout: new riveLib.Layout({ fit: riveLib.Fit.Contain, alignment: riveLib.Alignment.Center }),
      onLoad: () => {
        vm = r.viewModelInstance;
        riveReady = true;
        fitFrame();
        initGame();
        frame.classList.add("ready");
        requestAnimationFrame(tick);
      },
      onLoadError: (e) => { $("status").textContent = "Couldn't load. Please reload."; console.error(e); },
    });
  }

  /* ======================================================================
   * Fit: a 9:19.5 frame, drawn at an integer multiple of the art so every
   * art pixel is the same crisp size.
   * ==================================================================== */
  let scale = 1; // CSS px per art px
  function fitFrame() {
    const stage = $("stage");
    const cs = getComputedStyle(stage);
    const availW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availH = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const w = Math.max(60, Math.min(availW, (availH * ART_W) / ART_H));
    frame.style.width = Math.floor(w) + "px";
    frame.style.height = Math.floor((w * ART_H) / ART_W) + "px";
    scale = w / ART_W;
    if (r) {
      // integer multiple of the art -> crisp pixels; CSS stretches it to the frame
      const dpr = window.devicePixelRatio || 1;
      const n = Math.max(2, 2 * Math.round((w * dpr) / ART_W / 2)); // even: keeps 1.5x items on whole device pixels
      r.resizeDrawingSurfaceToCanvas((n * ART_W) / canvas.clientWidth);
    }
  }
  window.addEventListener("resize", fitFrame);
  window.addEventListener("orientationchange", fitFrame);
  if (window.ResizeObserver) new ResizeObserver(fitFrame).observe($("stage"));

  /* ======================================================================
   * Audio: SFX synthesised with Web Audio, music from audio/*.mp3
   * ==================================================================== */
  const audio = { ctx: null, master: null, music: {}, gains: {}, muted: store.get("muted", "0") === "1", started: false, slow: false };
  const STAMP = window.FALLING_BUILD ? "?v=" + window.FALLING_BUILD : "";   // so a replaced track is not served from cache
  const MUSIC_FILES = { normal: "audio/music-normal.mp3" + STAMP, slow: "audio/music-slow.mp3" + STAMP };

  function audioStart() {
    if (audio.started) { if (audio.ctx && audio.ctx.state === "suspended") audio.ctx.resume(); return; }
    audio.started = true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audio.ctx = new AC();
    audio.master = audio.ctx.createGain();
    audio.master.gain.value = audio.muted ? 0 : 1;
    audio.master.connect(audio.ctx.destination);
    for (const k of Object.keys(MUSIC_FILES)) {
      const el = new Audio(MUSIC_FILES[k]);
      el.loop = true;
      el.preload = "auto";
      el.crossOrigin = "anonymous";
      el.addEventListener("error", () => {}); // missing music is fine: sound effects still work
      const src = audio.ctx.createMediaElementSource(el);
      const g = audio.ctx.createGain();
      g.gain.value = k === "normal" ? 0.55 : 0;
      src.connect(g); g.connect(audio.master);
      audio.music[k] = el; audio.gains[k] = g;
    }
    // both loops play together, so the crossfade stays in sync
    Object.values(audio.music).forEach((el) => el.play().catch(() => {}));
  }
  // The two loops differ in length (the slow one is the same piece, stretched), so when
  // crossfading we move the incoming track to the same proportional spot in the piece.
  function musicMode(slow) {
    if (!audio.ctx || !audio.gains.normal || audio.slow === slow) return;
    audio.slow = slow;
    const from = audio.music[slow ? "normal" : "slow"], to = audio.music[slow ? "slow" : "normal"];
    if (from && to && from.duration > 0 && isFinite(from.duration) && isFinite(to.duration)) {
      try { to.currentTime = (from.currentTime / from.duration) * to.duration; } catch (e) { /* not seekable yet */ }
    }
    const t = audio.ctx.currentTime;
    for (const [k, target] of [["normal", slow ? 0 : 0.55], ["slow", slow ? 0.55 : 0]]) {
      const g = audio.gains[k].gain;
      g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(target, t + 0.9);
    }
  }
  function setMuted(m) {
    audio.muted = m;
    store.set("muted", m ? "1" : "0");
    if (audio.master) audio.master.gain.value = m ? 0 : 1;
    $("mute").classList.toggle("off", m);
    $("mute").setAttribute("aria-pressed", String(m));
  }

  // One-shot chiptune voices: [startFreq, endFreq, seconds, wave, volume, delay]
  function beeps(list) {
    if (!audio.ctx || audio.muted) return;
    const now = audio.ctx.currentTime;
    for (const [f0, f1, dur, wave = "square", vol = 0.12, delay = 0] of list) {
      const o = audio.ctx.createOscillator(), g = audio.ctx.createGain();
      o.type = wave;
      o.frequency.setValueAtTime(f0, now + delay);
      if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), now + delay + dur);
      g.gain.setValueAtTime(vol, now + delay);
      g.gain.exponentialRampToValueAtTime(0.0008, now + delay + dur);
      o.connect(g); g.connect(audio.master);
      o.start(now + delay); o.stop(now + delay + dur + 0.02);
    }
  }
  const SFX = {
    catch: () => beeps([[740, 1180, 0.09, "square", 0.1], [1180, 1480, 0.07, "square", 0.08, 0.07]]),
    catch2: () => beeps([[880, 1320, 0.08, "square", 0.1], [1320, 1760, 0.08, "square", 0.1, 0.06], [1760, 2100, 0.08, "square", 0.08, 0.12]]),
    miss: () => beeps([[180, 70, 0.16, "triangle", 0.16]]),
    hazard: () => beeps([[300, 60, 0.35, "sawtooth", 0.14], [120, 40, 0.3, "square", 0.12, 0.04]]),
    shield: () => beeps([[1500, 900, 0.1, "triangle", 0.12], [2100, 700, 0.18, "square", 0.07, 0.05]]),
    gravy: () => beeps([[392, 392, 0.09, "square", 0.1], [523, 523, 0.09, "square", 0.1, 0.09], [659, 659, 0.09, "square", 0.1, 0.18], [784, 988, 0.2, "square", 0.1, 0.27]]),
    feather: () => beeps([0, 1, 2, 3, 4, 5].map((i) => [440 * Math.pow(1.19, i), 440 * Math.pow(1.19, i + 1), 0.07, "square", 0.09, i * 0.06])),
    tin: () => beeps([[600, 1200, 0.1, "triangle", 0.14], [1200, 1800, 0.14, "square", 0.08, 0.08]]),
    life: () => beeps([[523, 523, 0.08, "square", 0.1], [659, 659, 0.08, "square", 0.1, 0.08], [784, 784, 0.08, "square", 0.1, 0.16], [1047, 1047, 0.22, "square", 0.1, 0.24]]),
    over: () => beeps([[440, 330, 0.22, "square", 0.12], [330, 247, 0.22, "square", 0.12, 0.22], [247, 165, 0.22, "square", 0.12, 0.44], [165, 82, 0.5, "triangle", 0.16, 0.66]]),
    tick: () => beeps([[660, 660, 0.1, "square", 0.1]]),
    go: () => beeps([[880, 880, 0.3, "square", 0.12]]),
    start: () => beeps([[523, 523, 0.07, "square", 0.1], [784, 784, 0.12, "square", 0.1, 0.07]]),
    clear: () => beeps([[1800, 600, 0.25, "square", 0.06], [2400, 900, 0.2, "triangle", 0.07, 0.03], [1200, 300, 0.3, "square", 0.05, 0.06]]),
    level: () => beeps([[523, 523, 0.07, "square", 0.1], [659, 659, 0.07, "square", 0.1, 0.07], [784, 784, 0.07, "square", 0.1, 0.14], [1047, 1047, 0.07, "square", 0.1, 0.21], [784, 1047, 0.25, "square", 0.1, 0.28]]),
    warn: () => beeps([[1000, 1000, 0.04, "square", 0.05]]),
  };

  /* ======================================================================
   * Game state
   * ==================================================================== */
  const S = {
    mode: "title",
    paused: false,
    t: 0,                 // seconds survived while playing
    level: 1, levelCatches: 0, pauseT: 0, pauseNum: 0,
    score: 0, lives: CONFIG.maxLives, best: parseInt(store.get("best", "0"), 10) || 0,
    caught: Object.fromEntries(GOOD.map((k) => [k, 0])),
    basketX: ART_W / 2, targetX: ART_W / 2, moving: false,
    gravyT: 0, featherT: 0, shield: false,
    spawnIn: 1.0, powerIn: 0, lastHazardT: -9, bag: [], lastKind: "",
    countdownT: 0, endIn: 0, modeT: 0,
    blink: 0,
    items: [],
    free: {},             // kind -> array of free slot indices
    flashQueue: [],
  };

  const slotName = (k, i) => `s_${k}_${i}`;

  function initPools() {
    for (const k of Object.keys(SLOTS)) S.free[k] = Array.from({ length: SLOTS[k] }, (_, i) => i);
  }

  function initGame() {
    initPools();
    setNum("basketW", CONFIG.basketWidth);
    applyGravyGeometry();
    setBool("gravy", false); setBool("feather", false); setBool("shield", false);
    setBool("gravyWarn", false); setBool("featherWarn", false);
    S.best = parseInt(store.get("best", "0"), 10) || 0;
    setStr("titleBest", "BEST " + pad6(S.best));
    enterTitle();
    if (debug) window.fallingFeast = { audio, musicMode, S, CONFIG, vm, r, SFX, step, pushHud, startCountdown, spawn, onCatch };
  }

  // The gravy boat is two fixed caps and a stretchy middle: one constant sets its width
  function applyGravyGeometry() {
    const w = Math.max(2 * CAP_W, Math.round(GRAVY_BOAT_WIDTH / 2) * 2);
    setNum("gravyL", -w / 2);
    setNum("gravyM", -w / 2 + CAP_W);
    setNum("gravyR", w / 2 - CAP_W);
    setNum("gravyBodyW", w - 2 * CAP_W);
  }
  const basketWidth = () => (S.gravyT > 0 ? Math.max(2 * CAP_W, Math.round(GRAVY_BOAT_WIDTH / 2) * 2) : CONFIG.basketWidth);

  /* ---------------------------------------------------------------- flow */
  function setMode(m) {
    S.mode = m; S.modeT = 0;
    setEnum("gameState", m);
  }
  function enterTitle() {
    setMode("title");
    resetItems();
    S.gravyT = S.featherT = 0; S.shield = false;
    musicMode(false);
    S.best = parseInt(store.get("best", "0"), 10) || 0;
    setStr("titleBest", "BEST " + pad6(S.best));
  }
  function startCountdown() {
    audioStart();
    resetItems();
    S.score = 0; S.lives = CONFIG.maxLives; S.t = 0; S.level = 1; S.levelCatches = 0; S.pauseT = 0; setNum("bannerOn", 0);
    for (const k of GOOD) S.caught[k] = 0;
    S.gravyT = S.featherT = 0; S.shield = false;
    S.bag = []; S.lastKind = ""; S.lastHazardT = -9;
    S.spawnIn = 0.6; S.powerIn = CONFIG.powerBaseInterval * rnd(0.6, 1.0);
    S.countdownT = 0; S.countStep = -1;
    setMode("countdown");
    setStr("bigText", "3");
    SFX.start();
    pushHud();
  }
  // Everything still falling bursts away (white flash + sparkle burst), so each level starts on a clear screen
  function clearScreen() {
    for (const it of S.items) {
      if (it.fate) continue;
      it.fate = "cleared"; it.fateT = 0.7;
      setEnum(`${it.slot}/fx`, "hit");
    }
  }
  function levelUp() {
    clearScreen();
    S.level++; S.levelCatches = 0;
    S.pauseT = CONFIG.levelCountdownSteps * CONFIG.levelCountdownStep;
    S.pauseNum = CONFIG.levelCountdownSteps;
    S.spawnIn = Math.max(S.spawnIn, 0.6);   // a short beat of calm once play resumes
    setStr("bannerSub", String(S.pauseNum));
    setNum("bannerOn", 1);
    setStr("bannerText", "LEVEL " + S.level);
    SFX.clear(); SFX.level();
  }
  function startPlaying() {
    setMode("playing");
    SFX.go();
  }
  function gameOver() {
    SFX.over();
    musicMode(false);
    for (const it of S.items) it.dead = true;
    flushDead(true);
    if (S.score > S.best) { S.best = S.score; store.set("best", S.best); }
    setMode("dinner");
    GOOD.forEach((k, i) => {
      const n = S.caught[k];
      setStr(`cnt${i}`, n ? "x" + n : "");
      setEnum(`t${i}/fx`, n ? "fall" : "hidden");
    });
    setStr("finalText", "SCORE " + pad6(S.score));
    setStr("bestText", "BEST " + pad6(S.best));
    setStr("titleBest", "BEST " + pad6(S.best));
    pushHud();
  }

  function resetItems() {
    for (const it of S.items) { setEnum(`${it.slot}/fx`, "hidden"); setNum(`${it.slot}/y`, -100); }
    S.items = [];
    initPools();
  }

  /* ----------------------------------------------------------- spawning */
  const lv = () => S.level - 1;
const speedAt = () => Math.min(CONFIG.maxSpeed, CONFIG.baseSpeed + CONFIG.speedPerLevel * lv());
const hazardShareAt = () => Math.min(CONFIG.hazardShareMax, CONFIG.hazardShareStart + CONFIG.hazardSharePerLevel * lv());
const intervalAt = () => Math.max(CONFIG.minInterval, CONFIG.startInterval + CONFIG.intervalPerLevel * lv());
const hazardGapAt = () => Math.max(CONFIG.hazardGapMin, CONFIG.hazardGapStart + CONFIG.hazardGapPerLevel * lv());

// Weighted, shuffled bag: the mix follows hazardShare(t) but a bag holds a
  // fixed number of draws, so runs of one type stay short.
  function refillBag() {
    const nHaz = Math.round(CONFIG.bagSize * hazardShareAt());
    const nGood = CONFIG.bagSize - nHaz;
    const goods = shuffle(PLAIN_GOOD.slice()), haz = shuffle(HAZARD.slice());
    const bag = [];
    for (let i = 0; i < nGood; i++) bag.push(goods[i % goods.length]);
    for (let i = 0; i < nHaz; i++) bag.push(haz[i % haz.length]);
    S.bag = shuffle(bag);
  }
  function nextKind(wantGoodOnly) {
    for (let tries = 0; tries < 4; tries++) {
      if (!S.bag.length) refillBag();
      let i = S.bag.length - 1;
      // avoid the same kind twice in a row when the bag has something else
      if (S.bag[i] === S.lastKind) { const j = S.bag.findIndex((k) => k !== S.lastKind); if (j >= 0) i = j; }
      let k = S.bag.splice(i, 1)[0];
      if (wantGoodOnly && HAZARD.includes(k)) k = PLAIN_GOOD[(Math.random() * PLAIN_GOOD.length) | 0];
      if (S.free[k] && S.free[k].length) return k;
    }
    return null;
  }

  // Will there still be a reachable gap if a hazard drops at x?
  function pathStaysOpen(x, speed) {
    if (S.level >= CONFIG.fairUntilLevel) return true;
    const hw = basketWidth() / 2;
    const tNew = (BASKET_TOP - SPAWN_Y) / speed;
    const blocked = [[x - ITEM_HALF - hw, x + ITEM_HALF + hw]];
    for (const it of S.items) {
      if (it.cls !== "hazard" || it.fate) continue;
      const tIt = (BASKET_TOP - it.y) / it.speed;
      if (Math.abs(tIt - tNew) < CONFIG.fairWindow) blocked.push([it.x - ITEM_HALF - hw, it.x + ITEM_HALF + hw]);
    }
    blocked.sort((a, b) => a[0] - b[0]);
    let cursor = hw, best = 0;
    for (const [a, b] of blocked) {
      if (a > cursor) best = Math.max(best, Math.min(a, ART_W - hw) - cursor);
      cursor = Math.max(cursor, b);
    }
    best = Math.max(best, ART_W - hw - cursor);
    return best >= CONFIG.minSafeGap;
  }

  function spawn(kind, x, y, fx) {
    const free = S.free[kind];
    if (!free || !free.length) return null;
    const idx = free.pop();
    const cls = HAZARD.includes(kind) ? "hazard" : POWER.includes(kind) ? "power" : "good";
    const base = speedAt();
    const it = { kind, cls, slot: slotName(kind, idx), idx, x, y, speed: base * (1 + rnd(-CONFIG.speedJitter, CONFIG.speedJitter)), fate: "", fateT: 0, dead: false };
    S.items.push(it);
    setEnum(`${it.slot}/fx`, fx || "fall");
    return it;
  }

  function trySpawnOne() {
    // gravy boat: no hazards while it lasts
    const kind = nextKind(S.gravyT > 0);
    if (!kind) return;
    S.lastKind = kind;
    const margin = ITEM_HALF + 2;
    const speed = speedAt();
    let x = rnd(margin, ART_W - margin);
    if (HAZARD.includes(kind)) {
      if (S.t - S.lastHazardT < hazardGapAt()) {
        // too soon after the last hazard: drop a good item instead
        const g = nextKind(true);
        if (g) spawn(g, rnd(margin, ART_W - margin), SPAWN_Y);
        return;
      }
      let ok = false;
      for (let i = 0; i < 8 && !ok; i++) { ok = pathStaysOpen(x, speed); if (!ok) x = rnd(margin, ART_W - margin); }
      if (!ok) { // keep the path open: swap in a good item
        const g = nextKind(true);
        if (g) spawn(g, x, SPAWN_Y);
        return;
      }
      S.lastHazardT = S.t;
    }
    spawn(kind, x, SPAWN_Y);
  }

  function spawnPower() {
    const w = { ...CONFIG.powerWeights };
    if (S.lives >= CONFIG.maxLives) w.acorn *= CONFIG.acornWeightWhenFull;
    if (S.gravyT > 0) w.gravy = 0;
    if (S.featherT > 0) w.feather = 0;
    if (S.shield || S.items.some((i) => i.kind === "tin")) w.tin = 0;
    const entries = Object.entries(w).filter(([k, v]) => v > 0 && S.free[k] && S.free[k].length);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    if (!total) return;
    let roll = Math.random() * total, pick = entries[0][0];
    for (const [k, v] of entries) { roll -= v; if (roll <= 0) { pick = k; break; } }
    spawn(pick, rnd(ITEM_HALF + 4, ART_W - ITEM_HALF - 4), SPAWN_Y);
  }

  /* ---------------------------------------------------------- catching */
  function onCatch(it) {
    const x2 = S.featherT > 0;
    it.fate = "caught"; it.fateT = 0.7;
    it.y = BASKET_TOP + 4;
    if (it.cls === "good") {
      const pts = (it.kind === "acorn" ? CONFIG.points.acorn : CONFIG.points.good) * (x2 ? CONFIG.featherScoreMultiplier : 1);
      S.score += pts;
      S.caught[it.kind]++;
      if (++S.levelCatches >= CONFIG.catchesPerLevel) levelUp();
      setEnum(`${it.slot}/fx`, x2 ? "caught2" : "caught");
      fire("catch");
      if (it.kind === "acorn") {
        if (S.lives < CONFIG.maxLives) { S.lives++; fire("lifeRestored"); SFX.life(); }
        else (x2 ? SFX.catch2 : SFX.catch)();
      } else (x2 ? SFX.catch2 : SFX.catch)();
    } else if (it.cls === "power") {
      setEnum(`${it.slot}/fx`, "caught");
      fire("catch");
      if (it.kind === "gravy") { S.gravyT = CONFIG.gravySeconds; convertHazards(); SFX.gravy(); }
      if (it.kind === "feather") { if (S.featherT <= 0) musicMode(true); S.featherT = CONFIG.featherSeconds; SFX.feather(); }
      if (it.kind === "tin") { S.shield = true; SFX.tin(); }
    } else {
      // hazard
      setEnum(`${it.slot}/fx`, "hit");
      if (S.shield) {
        S.shield = false; fire("catch"); SFX.shield();
      } else {
        S.lives--; fire("hazardHit"); SFX.hazard();
        if (S.lives <= 0) S.endIn = CONFIG.gameOverDelay;
      }
    }
  }

  // Gravy boat: every hazard on screen becomes a good item, with a sparkle flash
  function convertHazards() {
    for (const it of S.items.slice()) {
      if (it.cls !== "hazard" || it.fate) continue;
      const g = nextKind(true) || PLAIN_GOOD[0];
      setEnum(`${it.slot}/fx`, "converted");
      it.fate = "converted"; it.fateT = 0.7;
      const ni = spawn(g, it.x, it.y);
      if (ni) ni.speed = it.speed;
    }
  }

  function flushDead(all) {
    S.items = S.items.filter((it) => {
      if (!it.dead) return true;
      setEnum(`${it.slot}/fx`, "hidden");
      setNum(`${it.slot}/y`, -100);
      S.free[it.kind].push(it.idx);
      return false;
    });
  }

  /* -------------------------------------------------------- simulation */
  function step(dt) {
    S.modeT += dt;
    // basket follows the target
    const bw = basketWidth();
    const tx = clamp(S.targetX, bw / 2, ART_W - bw / 2);
    const maxMove = CONFIG.basketSpeed * dt;
    const nx = Math.round(S.basketX + clamp(tx - S.basketX, -maxMove, maxMove));
    S.moving = nx !== Math.round(S.basketX);
    S.basketX = nx;

    if (S.mode === "countdown") {
      S.countdownT += dt;
      const stepNo = Math.floor(S.countdownT / CONFIG.countdownStep);
      if (stepNo !== S.countStep) {
        S.countStep = stepNo;
        if (stepNo <= 2) { setStr("bigText", String(3 - stepNo)); if (stepNo > 0) SFX.tick(); }
        else if (stepNo === 3) { setStr("bigText", "GO!"); }
        else { startPlaying(); }
      }
      return;
    }
    if (S.mode !== "playing") return;

    // level-up pause: items, spawns, timers and the clock all hold still
    if (S.pauseT > 0) {
      S.pauseT = Math.max(0, S.pauseT - dt);
      for (const it of S.items) if (it.fate) { it.fateT -= dt; if (it.fateT <= 0) it.dead = true; }   // bursts finish and free their slots
      flushDead();
      const n = Math.ceil(S.pauseT / CONFIG.levelCountdownStep - 1e-6);
      if (n > 0 && n !== S.pauseNum) { S.pauseNum = n; setStr("bannerSub", String(n)); SFX.tick(); }
      if (S.pauseT === 0) { setNum("bannerOn", 0); SFX.go(); }
      return;
    }

    S.t += dt;
    const slow = S.featherT > 0 ? CONFIG.featherSlowFactor : 1;

    // timers
    if (S.gravyT > 0) { S.gravyT = Math.max(0, S.gravyT - dt); if (S.gravyT === 0) applyGravyGeometry(); }
    if (S.featherT > 0) { S.featherT = Math.max(0, S.featherT - dt); if (S.featherT === 0) musicMode(false); }

    // spawn rate is NOT slowed by the feather
    if (S.lives > 0) {
      S.spawnIn -= dt;
      while (S.spawnIn <= 0) {
        trySpawnOne();
        S.spawnIn += intervalAt() * (1 + rnd(-CONFIG.intervalJitter, CONFIG.intervalJitter));
      }
      S.powerIn -= dt;
      if (S.powerIn <= 0) {
        spawnPower();
        S.powerIn = CONFIG.powerBaseInterval * (1 + CONFIG.powerIntervalPerLevel * lv()) * rnd(0.75, 1.25);
      }
    }

    // move items in whole-pixel steps; collide
    const half = bw / 2 + CONFIG.catchPadding;
    for (const it of S.items) {
      if (it.fate) { it.fateT -= dt; if (it.fateT <= 0) it.dead = true; continue; }
      it.y += it.speed * slow * dt;
      if (it.y >= BASKET_TOP - 6 && it.y <= BASKET_TOP + 10 && Math.abs(it.x - S.basketX) <= half + ITEM_HALF - 3) {
        onCatch(it);
      } else if (it.y >= FLOOR_Y - 12) {
        if (it.cls === "good") {
          it.fate = "splat"; it.fateT = 0.8; it.y = FLOOR_Y - 10;
          setEnum(`${it.slot}/fx`, "splat");
          fire("missed"); SFX.miss();
        } else it.dead = true; // hazards and power-ups that miss just fall off the bottom
      }
    }
    flushDead();

    if (S.endIn > 0) { S.endIn -= dt; if (S.endIn <= 0) { S.endIn = 0; gameOver(); } }
    else if (S.lives <= 0) gameOver();
  }

  /* --------------------------------------------------------------- HUD */
  const warnBlink = (t) => t > 0 && t <= CONFIG.warnSeconds;
  function pushHud() {
    setNum("basketX", S.basketX);
    setNum("basketW", basketWidth());
    setBool("moving", S.moving);
    setNum("score", S.score);
    setNum("lives", S.lives);
    for (let i = 1; i <= CONFIG.maxLives; i++) setNum("life" + i, S.lives >= i ? 1 : 0);
    setStr("scoreText", pad6(S.score));
    setStr("levelText", "LV " + String(S.level).padStart(2, "0"));
    setNum("levelBar", Math.round((ART_W * S.levelCatches) / CONFIG.catchesPerLevel));

    const blinkOn = Math.floor(S.blink * 6) % 2 === 0;
    setBool("gravy", S.gravyT > 0);
    setBool("gravyWarn", warnBlink(S.gravyT));
    setNum("gravyBar", Math.ceil((24 * S.gravyT) / CONFIG.gravySeconds));
    setNum("hudGravy", S.gravyT > 0 && !(warnBlink(S.gravyT) && !blinkOn) ? 1 : 0);

    setBool("feather", S.featherT > 0);
    setBool("featherWarn", warnBlink(S.featherT));
    setNum("featherBar", Math.ceil((24 * S.featherT) / CONFIG.featherSeconds));
    setNum("hudFeather", S.featherT > 0 && !(warnBlink(S.featherT) && !blinkOn) ? 1 : 0);
    setNum("hudX2", S.featherT > 0 ? 1 : 0);

    setBool("shield", S.shield);
    setNum("hudShield", S.shield ? 1 : 0);

    for (const it of S.items) {
      setNum(`${it.slot}/x`, Math.round(it.x));
      setNum(`${it.slot}/y`, Math.round(it.y));
    }
  }

  /* -------------------------------------------------------------- loop */
  let last = 0, acc = 0, warnTick = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (!riveReady) return;
    const dt = Math.min(0.1, (now - last) / 1000 || 0);
    last = now;
    if (S.paused) return;
    S.blink += dt;
    const h = 1 / CONFIG.stepHz;
    acc += dt;
    let stepped = false;
    while (acc >= h) { acc -= h; step(h); stepped = true; }
    if (stepped) {
      if (S.mode !== "dinner") pushHud();
      // tiny tick while a power-up is about to end
      if ((warnBlink(S.gravyT) || warnBlink(S.featherT)) && (warnTick += h) > 0.3) { warnTick = 0; SFX.warn(); }
    }
  }

  /* ------------------------------------------------------------- input */
  let dragging = false, dragStartX = 0, baseAtDrag = 0, activeId = null;
  function artX(clientX) {
    const rect = frame.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * ART_W;
  }
  function pause(p) {
    if (S.paused === p) return;
    S.paused = p;
    if (r) p ? r.pause() : r.play();
    if (audio.ctx) p ? audio.ctx.suspend() : (audioStart(), audio.ctx.resume());
    last = performance.now(); acc = 0;
  }

  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest && e.target.closest("#mute")) return;
    audioStart();
    if (S.paused) return;
    if (S.mode === "title") { startCountdown(); }
    else if (S.mode === "dinner" && S.modeT > CONFIG.playAgainLock) { startCountdown(); }
    if (e.pointerType === "mouse") { S.targetX = artX(e.clientX); return; }
    dragging = true; activeId = e.pointerId;
    dragStartX = e.clientX; baseAtDrag = S.basketX;
    if (CONFIG.touchMode === "absolute") S.targetX = artX(e.clientX);
  }, { passive: false });
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse") { S.targetX = artX(e.clientX); return; } // hover: no click needed
    if (!dragging || e.pointerId !== activeId) return;
    if (CONFIG.touchMode === "absolute") S.targetX = artX(e.clientX);
    else S.targetX = baseAtDrag + ((e.clientX - dragStartX) / scale) * CONFIG.touchSensitivity;
  }, { passive: false });
  const endDrag = (e) => { if (e.pointerId === activeId) { dragging = false; activeId = null; } };
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  const keys = {};
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { keys[e.key] = true; e.preventDefault(); }
    if ((e.key === "Enter" || e.key === " ") && (S.mode === "title" || (S.mode === "dinner" && S.modeT > CONFIG.playAgainLock))) { audioStart(); startCountdown(); e.preventDefault(); }
  });
  window.addEventListener("keyup", (e) => { keys[e.key] = false; });
  setInterval(() => {
    if (S.paused) return;
    if (keys.ArrowLeft) S.targetX = S.basketX - 12;
    if (keys.ArrowRight) S.targetX = S.basketX + 12;
  }, 33);

  // Block page scroll, pull-to-refresh, double-tap zoom, callouts, selection
  ["touchmove", "gesturestart", "gesturechange", "dblclick", "contextmenu"].forEach((n) =>
    document.addEventListener(n, (e) => e.preventDefault(), { passive: false }));

  /* ----------------------------------------------- mute, pause, rotate */
  $("mute").addEventListener("click", (e) => { e.stopPropagation(); audioStart(); setMuted(!audio.muted); });
  setMuted(audio.muted);

  const landscape = window.matchMedia("(orientation: landscape) and (pointer: coarse) and (max-height: 520px)");
  const syncRotate = () => pause(landscape.matches || document.hidden);
  landscape.addEventListener ? landscape.addEventListener("change", syncRotate) : landscape.addListener(syncRotate);
  document.addEventListener("visibilitychange", syncRotate);
  window.addEventListener("pagehide", () => pause(true));
  window.addEventListener("pageshow", syncRotate);

  startRive();
  syncRotate();
})();
