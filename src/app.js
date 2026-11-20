// ===== ENGLISH PATH: A2 → C2 (sin IA) =====
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const today = () => new Date().toLocaleDateString("en-CA");
const DAY = 86400000;
const DAILY_GOAL = 80;
const lvlIdx = (lv) => LEVELS.indexOf(lv);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);

// ---------- Contenido derivado ----------
const ALL_VOCAB = [];
(() => {
  const seen = new Set();
  LEVELS.forEach((lv) => {
    let topic = "General", i = 0;
    VOCAB[lv].split("\n").forEach((raw) => {
      const line = raw.trim();
      if (line.startsWith("#")) { topic = line.replace(/^#\s*/, ""); return; }
      if (!line.includes("|")) return;
      const [en, es, ex] = line.split("|").map((x) => (x || "").trim());
      const id = `${lv}-${i++}`;
      if (seen.has(en.toLowerCase())) return;
      seen.add(en.toLowerCase());
      ALL_VOCAB.push({ id, level: lv, topic, en, es, ex });
    });
  });
})();
const itemsFor = (obj, prefix) => LEVELS.flatMap((lv) => (obj[lv] || []).map((x, i) => ({ ...x, id: `${lv}-${prefix}${i}`, level: lv })));
const ALL_READINGS = itemsFor(READINGS, "r");
const ALL_LISTENING = itemsFor(LISTENING, "l");
const ALL_ROLEPLAY = itemsFor(ROLEPLAY, "p");
const ALL_WRITING = itemsFor(WRITING, "w");
const ALL_LESSONS = LEVELS.flatMap((lv) => LESSONS[lv].map((l) => ({ ...l, level: lv })));
const REVIEW_STEPS = [2, 7, 21, 60, 120];
const EX_LESSON = new Map(); ALL_LESSONS.forEach((l) => l.ex.forEach((e) => EX_LESSON.set(e, l.id)));
const TYPE_NAMES = { mc: "Opción múltiple", fill: "Completar", ord: "Ordenar palabras", tr: "Traducir", fix: "Corregir errores" };
function recordEx(ex, ok, fix) {
  const id = EX_LESSON.get(ex); if (!id) return;
  const a = S.exStats[id] || (S.exStats[id] = [0, 0]), b = S.typeStats[ex[0]] || (S.typeStats[ex[0]] = [0, 0]);
  if (fix) { a[0]++; b[0]++; return; }
  a[0] += ok ? 1 : 0; a[1]++; b[0] += ok ? 1 : 0; b[1]++;
}

// ---------- Estado ----------
const defaultState = () => ({
  v: 2, level: "A2", unlocked: ["A2"], placementDone: false,
  xp: 0, streak: 0, lastDay: null, history: {},
  cards: {}, custom: [], lessons: {}, exams: {}, mistakes: [],
  newToday: { day: null, n: 0, r: 0 },
  done: { reading: {}, listening: {}, roleplay: {}, writing: {}, story: {} },
  skills: { vocab: [0, 0], grammar: [0, 0], listening: [0, 0], reading: [0, 0], speaking: [0, 0], writing: [0, 0] },
  daily: { day: null, tasks: {} }, cando: {},
  exStats: {}, typeStats: {}, mocks: {}, chunks: {}, retell: [], speak: [], immersion: [], texts: [], pron: {}, immPhase: 0, immCrit: {}, immDaily: null,
  settings: { rate: 0.95, newPerDay: 10, retention: 0.9, mmEmail: "" }, updatedAt: 0
});
let S = defaultState();
function migrate(x) {
  const d = defaultState(), o = Object.assign(d, x || {});
  o.done = Object.assign(defaultState().done, o.done || {});
  o.skills = Object.assign(defaultState().skills, o.skills || {});
  o.settings = Object.assign(defaultState().settings, o.settings || {});
  ["retell", "speak"].forEach((k) => { if (!Array.isArray(o[k])) o[k] = []; }); if (!o.chunks) o.chunks = {};
  if (!o.newToday || o.newToday.r === undefined) o.newToday = { day: null, n: 0, r: 0 };
  if (!o.v || o.v < 2) { o.v = 2; if (Object.keys(o.lessons).length || Object.keys(o.cards).length) o.placementDone = true; }
  return o;
}
function loadLocal() { try { const raw = localStorage.getItem("ingles-state"); if (raw) S = migrate(JSON.parse(raw)); } catch (e) {} }

let saveTimer = null;
function save() {
  S.updatedAt = Date.now();
  try { localStorage.setItem("ingles-state", JSON.stringify(S)); } catch (e) {}
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => Sync.push(), 2000);
}
function addXP(n) {
  const d = today();
  if (S.lastDay !== d) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    S.streak = S.lastDay === y.toLocaleDateString("en-CA") ? S.streak + 1 : 1;
    S.lastDay = d;
  }
  S.xp += n; S.history[d] = (S.history[d] || 0) + n;
  save(); renderTop(); if (n > 0) toast(`+${n} XP`);
}
function skill(name, c, t) { const s = S.skills[name]; s[0] += c; s[1] += t; }
function daily() { if (S.daily.day !== today()) S.daily = { day: today(), tasks: {} }; return S.daily.tasks; }
function markDaily(k) { const t = daily(); if (!t[k]) { t[k] = true; save(); toast("✓ Tarea del día completada"); } }

// ---------- Sincronización ----------
const Sync = {
  mode: "local", db: null, uid: null, busy: false, again: false,
  status(t) { this.text = t; const el = $("#sync"); if (el) el.textContent = t; },
  adopt(remote) {
    if (!remote) return false;
    if ((remote.updatedAt || 0) > (S.updatedAt || 0)) { S = migrate(JSON.parse(JSON.stringify(remote))); try { localStorage.setItem("ingles-state", JSON.stringify(S)); } catch (e) {} vq = null; render(); return true; }
    return false;
  },
  async init() {
    if (inClaude()) {
      try {
        const [dbx, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
        if (dbx && user) {
          this.uid = await user.id();
          if (this.uid) {
            this.db = dbx; this.mode = "claude";
            const snap = await this.db.doc(`data/users/${this.uid}/progress`).get();
            if (snap.exists) { if (!this.adopt(snap.data()) && (S.updatedAt || 0) > (snap.data().updatedAt || 0)) this.push(); }
            else if (S.updatedAt) this.push();
            this.status("Progreso sincronizado con tu cuenta de Claude");
            return;
          }
        }
      } catch (e) {}
    }
    if (Supa.ready()) {
      this.mode = "supabase";
      try { await this.pull(); this.status("Progreso sincronizado con tu base de datos"); }
      catch (e) { this.status("Sin conexión con la base de datos: guardado en este navegador"); }
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") this.pull().catch(() => {}); });
      return;
    }
    this.status("Guardado solo en este navegador · configura la sincronización en Ajustes");
  },
  async pull() {
    if (this.mode !== "supabase") return;
    const remote = await Supa.load();
    if (remote) { if (!this.adopt(remote) && (S.updatedAt || 0) > (remote.updatedAt || 0)) this.push(); }
    else if (S.updatedAt) this.push();
  },
  async push() {
    if (this.mode === "local") return;
    if (this.busy) { this.again = true; return; }
    this.busy = true;
    try {
      const data = JSON.parse(JSON.stringify(S));
      if (this.mode === "claude") await this.db.doc(`data/users/${this.uid}/progress`).set(data);
      else await Supa.saveData(data);
      this.status(this.mode === "claude" ? "Progreso sincronizado con tu cuenta de Claude" : "Progreso sincronizado con tu base de datos");
    } catch (e) { this.status("No se pudo sincronizar: guardado en este navegador"); }
    this.busy = false;
    if (this.again) { this.again = false; this.push(); }
  }
};

// Supabase por REST (sin librerías)
const Supa = {
  cfg() {
    let c = {}; try { c = JSON.parse(localStorage.getItem("ingles-supa-cfg") || "{}"); } catch (e) {}
    const def = (typeof SUPABASE_CONFIG !== "undefined" && SUPABASE_CONFIG) || {};
    return { url: (c.url || def.url || "").replace(/\/+$/, ""), key: c.key || def.anonKey || "" };
  },
  setCfg(url, key) { try { localStorage.setItem("ingles-supa-cfg", JSON.stringify({ url, key })); } catch (e) {} },
  session() { try { return JSON.parse(localStorage.getItem("ingles-supa-session") || "null"); } catch (e) { return null; } },
  setSession(s) { try { s ? localStorage.setItem("ingles-supa-session", JSON.stringify(s)) : localStorage.removeItem("ingles-supa-session"); } catch (e) {} },
  ready() { const c = this.cfg(); return !!(c.url && c.key && this.session()); },
  async auth(path, body) {
    const c = this.cfg();
    const r = await fetch(`${c.url}/auth/v1/${path}`, { method: "POST", headers: { apikey: c.key, "content-type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error_description || d.msg || d.message || "Error de autenticación");
    return d;
  },
  keep(d) { if (!d.access_token) return null; const s = { access: d.access_token, refresh: d.refresh_token, exp: Date.now() + (d.expires_in || 3600) * 1000 - 60000, uid: d.user && d.user.id, email: d.user && d.user.email }; this.setSession(s); return s; },
  async login(email, password) { return this.keep(await this.auth("token?grant_type=password", { email, password })); },
  async signup(email, password) { const d = await this.auth("signup", { email, password }); return this.keep(d) || "confirm"; },
  async token() {
    let s = this.session(); if (!s) throw new Error("Sin sesión");
    if (Date.now() > s.exp) { s = this.keep(await this.auth("token?grant_type=refresh_token", { refresh_token: s.refresh })); }
    return s;
  },
  async rest(method, query, body) {
    const c = this.cfg(), s = await this.token();
    const r = await fetch(`${c.url}/rest/v1/progress${query}`, { method, headers: { apikey: c.key, Authorization: `Bearer ${s.access}`, "content-type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.message || r.statusText); }
    return method === "GET" ? r.json() : null;
  },
  async load() { const s = await this.token(); const rows = await this.rest("GET", `?user_id=eq.${s.uid}&select=data`); return rows[0] ? rows[0].data : null; },
  async saveData(data) { const s = await this.token(); await this.rest("POST", "?on_conflict=user_id", { user_id: s.uid, data, updated_at: new Date().toISOString() }); },
  logout() { this.setSession(null); }
};

// ---------- Capacidades de Claude (solo voz y guardado) ----------
let ttsApi = null, dictApi = null;
const dictH = { partial: null, final: null, state: null };
const inClaude = () => !!(window.claude && window.claude.use);
function webSpeech() {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!R) return null;
  let rec = null;
  return {
    start() {
      return new Promise((res, rej) => {
        rec = new R(); rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false;
        rec.onstart = () => { dictH.state && dictH.state({ state: "listening" }); res(); };
        rec.onresult = (e) => { for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; (r.isFinal ? dictH.final : dictH.partial)?.({ text: r[0].transcript }); } };
        rec.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") rej({ code: "not_granted" }); };
        rec.onend = () => dictH.state && dictH.state({ state: "idle" });
        try { rec.start(); } catch (e) { rej(e); }
      });
    },
    stop() { try { rec && rec.stop(); } catch (e) {} return Promise.resolve(); }
  };
}
async function initCaps() {
  for (let i = 0; i < 15 && !inClaude() && window.top !== window; i++) await new Promise((r) => setTimeout(r, 100));
  if (inClaude()) {
    window.claude.use("tts").then((t) => { ttsApi = t; }).catch(() => {});
    window.claude.use("dictation").then((d) => {
      if (!d) { dictApi = dictApi || webSpeech(); return; }
      dictApi = d;
      d.onPartial((x) => dictH.partial && dictH.partial(x));
      d.onFinal((x) => dictH.final && dictH.final(x));
      d.onState((x) => dictH.state && dictH.state(x));
      if (["hablar"].includes(view)) render();
    }).catch(() => {});
  } else dictApi = webSpeech();
  await Sync.init();
}

// ---------- Voz ----------
// 1) Audios pregrabados con voz neuronal (audio/*.mp3) cuando existen; 2) voces del dispositivo elegidas en Ajustes.
const VOICE_KEYS = ["A", "B", "C"];
let audioIndex = null;
function fnv(str) { let h = 0x811c9dc5; for (const b of new TextEncoder().encode(str)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); }
function loadAudioIndex() { if (inClaude()) return; fetch("audio/index.json").then((r) => r.ok ? r.json() : []).then((a) => { audioIndex = new Set(a); }).catch(() => { audioIndex = null; }); }
function hqFile(sp, text) {
  if (!audioIndex || !audioIndex.size || S.settings.hq === false) return null;
  const t = String(text).trim(), order = [VOICE_KEYS[sp] || "A", ...VOICE_KEYS.filter((k) => k !== (VOICE_KEYS[sp] || "A"))];
  for (const k of order) { const h = fnv(k + "|" + t); if (audioIndex.has(h)) return `audio/${h}.mp3`; }
  return null;
}
function enVoices() { try { return speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang)); } catch (e) { return []; } }
function voiceScore(v) {
  const n = (v.name || "").toLowerCase(); let s = 0;
  if (/natural|neural|online|enhanced|premium|siri|wavenet|studio/.test(n)) s += 6;
  if (/google/.test(n)) s += 3; if (/microsoft/.test(n)) s += 2;
  if (/samantha|daniel|karen|moira|serena|aria|jenny|guy|ryan|sonia|libby|natasha|william/.test(n)) s += 2;
  if (/espeak|compact|robot|novelty|bad news|bells|bubbles|boing|jester|organ|trinoids|whisper|zarvox|superstar|wobble|cellos|albert|bahh|fred|junior|ralph/.test(n)) s -= 8;
  if (/en[-_](us|gb)/i.test(v.lang)) s += 1;
  if (v.localService === false) s += 1;
  return s;
}
const rankedVoices = () => enVoices().slice().sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name));
function voicePrefs() { try { return JSON.parse(localStorage.getItem("ingles-voices") || "{}"); } catch (e) { return {}; } }
function setVoicePref(k, uri) { const p = voicePrefs(); if (uri) p[k] = uri; else delete p[k]; try { localStorage.setItem("ingles-voices", JSON.stringify(p)); } catch (e) {} }
function voiceFor(i) {
  const vs = rankedVoices(); if (!vs.length) return null;
  const pref = voicePrefs()[VOICE_KEYS[i] || "A"]; const chosen = pref && vs.find((v) => v.voiceURI === pref);
  if (chosen) return chosen;
  const main = vs.find((v) => v.voiceURI === voicePrefs().A) || vs[0];
  if (i === 0) return main;
  const others = vs.filter((v) => v !== main);
  if (i === 1) return others.find((v) => /GB/i.test(v.lang) && voiceScore(v) >= voiceScore(main) - 4) || others[0] || main;
  return others[1] || others[0] || main;
}
const CLAUDE_VOICES = ["airy", "rounded", "glassy", "buttery"];
let speakToken = 0, curAudio = null;
function stopSpeech() { speakToken++; try { if (curAudio) { curAudio.pause(); curAudio = null; } } catch (e) {} try { ttsApi && ttsApi.stop(); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {} }
function speak(text, rate) { return speakLines([[0, text]], rate); }
function playFile(url, rate, token) {
  return new Promise((resolve, reject) => {
    if (token !== speakToken) return resolve();
    const a = new Audio(url); curAudio = a; a.playbackRate = rate; try { a.preservesPitch = true; } catch (e) {}
    a.onended = () => resolve(); a.onerror = () => reject(new Error("audio"));
    a.play().catch(reject);
  });
}
function ttsLine(sp, text, rate, token) {
  return new Promise((resolve) => {
    if (token !== speakToken) return resolve();
    try {
      const u = new SpeechSynthesisUtterance(text); const v = voiceFor(sp);
      u.lang = v ? v.lang : sp === 1 ? "en-GB" : "en-US"; if (v) u.voice = v; u.rate = rate;
      if (sp >= 2 && v && v === voiceFor(0)) u.pitch = 0.8;
      u.onend = resolve; u.onerror = resolve; speechSynthesis.speak(u);
    } catch (e) { toast("El audio no está disponible en este navegador"); resolve(); }
  });
}
async function speakLines(lines, rate, onLine) {
  rate = rate || S.settings.rate;
  stopSpeech();
  const token = speakToken;
  const anyHQ = lines.some(([sp, t]) => hqFile(sp, t));
  if (ttsApi && !anyHQ) {
    const t0 = lines.map(([sp, text], i) => ({ text, voice: CLAUDE_VOICES[sp % CLAUDE_VOICES.length], language: "en", rate, id: String(i) }));
    if (onLine) try { ttsApi.onLine(({ id }) => onLine(+id)); } catch (e) {}
    return ttsApi.speak(t0).catch((e) => { if (e && e.code === "not_granted") { ttsApi = null; return speakLines(lines, rate, onLine); } });
  }
  for (let i = 0; i < lines.length; i++) {
    if (token !== speakToken) return;
    const [sp, text] = lines[i]; onLine && onLine(i);
    const f = hqFile(sp, text);
    if (f) { try { await playFile(f, rate, token); continue; } catch (e) {} }
    if (token !== speakToken) return;
    await ttsLine(sp, text, rate, token);
    if (i < lines.length - 1) await new Promise((r) => setTimeout(r, 250));
  }
}
const speakBtn = (text, label = "🔊") => `<button class="icon-btn" data-speak="${esc(text)}" title="Escuchar">${label}</button>`;

// ---------- Texto ----------
function norm(s) {
  return String(s).toLowerCase().replace(/[’‘`´]/g, "'")
    .replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not").replace(/\bshan't\b/g, "shall not")
    .replace(/n't\b/g, " not").replace(/'m\b/g, " am").replace(/'re\b/g, " are").replace(/'ll\b/g, " will").replace(/'ve\b/g, " have").replace(/'d\b/g, " would")
    .replace(/\bok\b/g, "okay").replace(/colour/g, "color").replace(/favourite/g, "favorite").replace(/travell/g, "travel").replace(/organis/g, "organiz").replace(/realis/g, "realiz").replace(/apologis/g, "apologiz").replace(/centre/g, "center").replace(/\bmovie\b/g, "film")
    .replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
}
function similarity(a, b) {
  const x = norm(a).split(" "), y = norm(b).split(" ");
  if (!x[0] && !y[0]) return 1;
  const dp = Array(x.length + 1).fill(0).map(() => Array(y.length + 1).fill(0));
  for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) dp[i][j] = x[i - 1] === y[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[x.length][y.length] / Math.max(x.length, y.length);
}
const bestMatch = (said, models) => models.reduce((b, m) => { const s = similarity(m, said); return s > b.s ? { s, m } : b; }, { s: 0, m: models[0] });
function diffWords(target, said) { const s = new Set(norm(said).split(" ")); return target.split(/\s+/).map((w) => { const n = norm(w); return `<span class="${!n || n.split(" ").every((p) => s.has(p)) ? "ok" : "miss"}">${esc(w)}</span>`; }).join(" "); }

// ---------- Tarjetas (SM-2, ambas direcciones) ----------
const allCards = () => ALL_VOCAB.concat(typeof DEV_VOCAB !== "undefined" ? DEV_VOCAB : [], typeof CHUNK_CARDS !== "undefined" ? CHUNK_CARDS : [], S.custom);
const cardById = (id) => allCards().find((c) => c.id === id.replace(/:r$/, ""));
const levelOK = (c) => c.level === "MIS" || (c.chunk ? S.settings.chunkCards !== false && lvlIdx(c.level) <= lvlIdx(S.level) : c.level === "DEV" ? S.settings.devCards !== false : lvlIdx(c.level) <= lvlIdx(S.level));
function dueCards() {
  const now = Date.now();
  if (S.newToday.day !== today()) S.newToday = { day: today(), n: 0, r: 0, i: 0 };
  const due = [], fresh = [], rev = [], irrNew = [], devFresh = [], chFresh = [];
  IRREG.filter((v) => lvlIdx(v.level) <= lvlIdx(S.level)).forEach((v) => { const st = S.cards[v.id]; if (st) { if (st.due <= now) due.push({ c: v, dir: "irr" }); } else irrNew.push({ c: v, dir: "irr" }); });
  allCards().filter(levelOK).forEach((c) => {
    const f = S.cards[c.id], r = S.cards[c.id + ":r"];
    if (f) { if (f.due <= now) due.push({ c, dir: "f" }); } else (c.chunk ? chFresh : c.level === "DEV" ? devFresh : fresh).push({ c, dir: "f" });
    if (r) { if (r.due <= now) due.push({ c, dir: "r" }); } else if (f && f.reps >= 2 && !c.chunk) rev.push({ c, dir: "r" });
  });
  fresh.sort((a, b) => (b.c.level === "MIS") - (a.c.level === "MIS") || (b.c.level === S.level) - (a.c.level === S.level));
  const room = Math.max(0, S.settings.newPerDay - S.newToday.n), roomR = Math.max(0, S.settings.newPerDay - S.newToday.r);
  const roomI = Math.max(0, IRR_NEW_PER_DAY - (S.newToday.i || 0)), roomD = Math.max(0, 5 - (S.newToday.d || 0)), roomC = Math.max(0, 3 - (S.newToday.c || 0));
  return { due, fresh: fresh.slice(0, room).concat(irrNew.slice(0, roomI), devFresh.slice(0, roomD), chFresh.slice(0, roomC)), rev: rev.slice(0, roomR), totalNew: fresh.length, irrNew: irrNew.length };
}
// FSRS-4.5 (parámetros por defecto)
const FW = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const F_DECAY = -0.5, F_FACTOR = 19 / 81;
const fR = (t, st) => Math.pow(1 + F_FACTOR * t / st, F_DECAY);
const fInt = (st) => Math.min(3650, Math.max(1, Math.round(st / F_FACTOR * (Math.pow(S.settings.retention || 0.9, 1 / F_DECAY) - 1))));
const clampD = (d) => Math.min(10, Math.max(1, d));
const D0 = (g) => FW[4] - (g - 3) * FW[5];
function fsrsNext(prev, G, now) {
  let st = prev ? { ...prev } : null;
  if (st && st.s === undefined) { st.s = Math.max(0.5, st.int || 1); st.d = clampD(10 - ((st.ef || 2.5) - 1.3) * 4); st.last = (st.due || now) - (st.int || 1) * DAY; }
  if (!st || !st.last) st = { ...(st || {}), s: FW[G - 1], d: clampD(D0(G)), reps: 0, lapses: 0 };
  else {
    const t = Math.max(0, (now - st.last) / DAY), R = fR(t, st.s);
    if (G === 1) { st.s = Math.min(st.s, FW[11] * Math.pow(st.d, -FW[12]) * (Math.pow(st.s + 1, FW[13]) - 1) * Math.exp(FW[14] * (1 - R))); st.lapses = (st.lapses || 0) + 1; }
    else st.s = st.s * (Math.exp(FW[8]) * (11 - st.d) * Math.pow(st.s, -FW[9]) * (Math.exp(FW[10] * (1 - R)) - 1) * (G === 2 ? FW[15] : 1) * (G === 4 ? FW[16] : 1) + 1);
    st.d = clampD(FW[7] * D0(4) + (1 - FW[7]) * (st.d - FW[6] * (G - 3)));
  }
  st.last = now;
  if (G === 1) { st.reps = 0; st.due = now + 60000; } else { st.reps = (st.reps || 0) + 1; st.due = now + fInt(st.s) * DAY; }
  return st;
}
const QG = { 1: 1, 3: 2, 4: 3, 5: 4 };
function intervalLabel(key, q) { const now = Date.now(); const st = fsrsNext(S.cards[key], QG[q], now); const d = (st.due - now) / DAY; return d < 0.01 ? "1 min" : d < 30 ? Math.round(d) + " d" : d < 365 ? Math.round(d / 30) + " m" : (d / 365).toFixed(1) + " a"; }
function grade(key, q) {
  if (!S.cards[key]) { if (key.endsWith(":r")) S.newToday.r++; else if (key.startsWith("IRR:")) S.newToday.i = (S.newToday.i || 0) + 1; else if (key.startsWith("DEV-")) S.newToday.d = (S.newToday.d || 0) + 1; else if (key.startsWith("CH-")) S.newToday.c = (S.newToday.c || 0) + 1; else S.newToday.n++; }
  S.cards[key] = fsrsNext(S.cards[key], QG[q] || 3, Date.now());
  skill("vocab", q >= 3 ? 1 : 0, 1);
  addXP(2);
}
// Verbos irregulares
const IRREG = LEVELS.flatMap((lv) => (IRREGULAR[lv] || "").trim().split("\n").filter(Boolean).map((line) => { const [base, past, pp, es] = line.split("|").map((x) => x.trim()); return { id: "IRR:" + base, level: lv, base, past, pp, es, en: base, irr: true }; }));
const firstForm = (f) => f.split("/")[0];
function irrPattern(v) { const a = v.base, b = firstForm(v.past), c = firstForm(v.pp); return a === b && b === c ? "AAA" : b === c ? "ABB" : a === c ? "ABA" : "ABC"; }
const IRR_PATTERNS = { AAA: "Las tres formas iguales (cut – cut – cut)", ABB: "Pasado y participio iguales (buy – bought – bought)", ABA: "Participio igual al verbo base (come – came – come)", ABC: "Las tres formas distintas (go – went – gone)" };
const irrForms = (v) => `${v.base} – ${v.past.replace("/", " / ")} – ${v.pp.replace("/", " / ")}`;
const irrSay = (v) => `${v.base}, ${firstForm(v.past)}, ${firstForm(v.pp)}`;
const formOK = (forms, given) => forms.split("/").some((f) => norm(f) === norm(given));
const IRR_NEW_PER_DAY = 5;
const learnedCount = () => Object.entries(S.cards).filter(([k, c]) => !k.endsWith(":r") && c.reps >= 2).length;

// ---------- Navegación ----------
const VIEWS = [["inicio", "🏠", "Inicio"], ["tarjetas", "🗂️", "Tarjetas"], ["gramatica", "📘", "Gramática"], ["chunks", "🧩", "Chunks"], ["escuchar", "🎧", "Escuchar"], ["leer", "📖", "Leer"], ["hablar", "🎙️", "Hablar"], ["escribir", "✍️", "Escribir"], ["ti", "💻", "Inglés TI"], ["examenes", "🎓", "Exámenes"], ["inmersion", "🌎", "Inmersión"], ["progreso", "📊", "Progreso"], ["ajustes", "⚙️", "Ajustes"]];
let view = "inicio", sub = null;
function route() { let h = (location.hash || "").slice(1); if (h === "errores") { h = "progreso"; pTab = "errores"; } view = VIEWS.some((v) => v[0] === h) ? h : "inicio"; sub = null; stopSpeech(); closeLookup(); render(); }
function go(v) { if (location.hash.slice(1) === v) route(); else location.hash = v; }
function renderNav() { $("#nav").innerHTML = VIEWS.map(([id, ic, l]) => `<a href="#${id}" class="${view === id ? "active" : ""}"><span class="ic">${ic}</span><span class="lbl">${l}</span></a>`).join(""); }
function renderTop() {
  const t = S.history[today()] || 0;
  $("#top").innerHTML = `<div class="chip lvl">Nivel ${S.level}</div><div class="chip">🔥 ${S.streak} ${S.streak === 1 ? "día" : "días"}</div><div class="chip goal"><div class="bar"><i style="width:${Math.min(100, (t / DAILY_GOAL) * 100)}%"></i></div>${t}/${DAILY_GOAL} XP</div>`;
}
const RENDER = {};
function render() { renderNav(); renderTop(); (RENDER[view] || RENDER.inicio)($("#main")); window.scrollTo(0, 0); }
let toastT;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1700); }
document.addEventListener("click", (e) => {
  const sp = e.target.closest("[data-speak]"); if (sp) { e.stopPropagation(); speak(sp.getAttribute("data-speak"), sp.dataset.rate ? +sp.dataset.rate : undefined); }
  const g = e.target.closest("[data-go]"); if (g) go(g.getAttribute("data-go"));
  const na = e.target.closest("#nav a"); if (na && na.getAttribute("href") === location.hash) { e.preventDefault(); route(); }
});
function levelTabs(cur, cb) {
  return `<div class="tabs">${LEVELS.map((l) => `<button class="tab ${l === cur ? "on" : ""}" data-lvtab="${l}">${l}${S.unlocked.includes(l) ? "" : " 🔒"}</button>`).join("")}</div>`;
}
function bindTabs(m, cb) { $$("[data-lvtab]", m).forEach((b) => b.onclick = () => cb(b.dataset.lvtab)); }
function confirmBox(el, msg, yes) {
  el.innerHTML = `<div class="card note">${msg} <div class="row"><button class="btn small red" data-y>Sí</button><button class="btn small ghost" data-n>Cancelar</button></div></div>`;
  $("[data-y]", el).onclick = yes; $("[data-n]", el).onclick = () => { el.innerHTML = ""; };
}

// ---------- Motor de ejercicios ----------
function exerciseRunner(box, items, o) {
  let i = 0, correct = 0, answered = false; const wrongs = [];
  const typed = (t) => ["fill", "tr", "fix", "sub"].includes(t);
  function show() {
    const ex = items[i];
    if (!ex) return o.onFinish(correct, items.length, wrongs);
    answered = false;
    const t = ex[0]; let body = "";
    if (t === "mc") body = `${ex.pic ? `<div class="qpic">${ex.pic}</div>` : ""}<p class="q">${esc(ex[1])}</p><div class="opts">${ex[2].map((x, k) => `<button class="opt" data-k="${k}"><span class="key">${k + 1}</span>${ex.optHTML ? ex.optHTML[k] + (ex.optHTML[k] ? "" : esc(x)) : esc(x)}</button>`).join("")}</div>`;
    if (t === "fill") body = `<p class="q">${esc(ex[1])}</p><form class="ans row"><input id="ai" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribe la palabra que falta"><button class="btn">Comprobar</button></form>`;
    if (t === "tr") body = `<p class="label">Traduce al inglés</p><p class="q">${esc(ex[1])}</p><form class="ans"><textarea id="ai" rows="2" autocapitalize="off" spellcheck="false" placeholder="Write it in English…"></textarea><button class="btn wide">Comprobar</button></form>`;
    if (t === "fix") body = `<p class="label">Esta frase tiene un error. Corrígela.</p><p class="q wrongq">${esc(ex[1])}</p><form class="ans"><textarea id="ai" rows="2" autocapitalize="off" spellcheck="false">${esc(ex[1])}</textarea><button class="btn wide">Comprobar</button></form>`;
    if (t === "sub") body = `<p class="label">Transforma la frase usando: <b>${esc(ex[4])}</b></p><p class="q">${esc(ex[1])}</p><form class="ans"><textarea id="ai" rows="2" autocapitalize="off" spellcheck="false" placeholder="Write the new sentence…"></textarea><button class="btn wide">Comprobar</button></form>`;
    if (t === "blocks") body = `<p class="label">Arma la frase con los bloques</p><p class="q">${esc(ex[1])}</p><div class="built" id="built"></div><div class="bank">${shuffle(ex[2].slice()).map((w) => `<button class="w chunkw">${esc(w)}</button>`).join("")}</div><button class="btn" id="oc">Comprobar</button>`;
    if (t === "ord") body = `<p class="label">Ordena las palabras</p><p class="q">${esc(ex[1])}</p><div class="built" id="built"></div><div class="bank">${shuffle(ex[2].split(" ")).map((w) => `<button class="w">${esc(w)}</button>`).join("")}</div><button class="btn" id="oc">Comprobar</button>`;
    box.innerHTML = `<div class="row between"><div><h1>${esc(o.title)}</h1>${o.subtitle ? `<div class="muted small">${esc(o.subtitle)}</div>` : ""}</div>${o.onExit ? `<button class="btn ghost small" id="exit">Salir</button>` : ""}</div>
      <div class="bar"><i style="width:${(i / items.length) * 100}%"></i></div><div class="muted small">${i + 1} / ${items.length}</div>
      <div class="card excard">${body}<div id="fb"></div></div>`;
    if (o.onExit) $("#exit").onclick = o.onExit;
    if (t === "mc") $$(".opt", box).forEach((b) => b.onclick = () => choose(+b.dataset.k));
    if (typed(t)) {
      const inp = $("#ai"); inp.focus(); if (t === "fix") inp.setSelectionRange(inp.value.length, inp.value.length);
      inp.onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey && inp.tagName === "TEXTAREA") { e.preventDefault(); $(".ans", box).requestSubmit(); } };
      $(".ans", box).onsubmit = (e) => {
        e.preventDefault(); if (answered) return; const v = inp.value.trim(); if (!v) return;
        const ok = ex[2].some((a) => norm(a) === norm(v));
        const close = !ok && t !== "fill" && ex[2].some((a) => similarity(a, v) >= 0.85);
        finish(ok, ex[2][0], t === "fill" ? ex[3] : ex[3], v, close);
      };
    }
    if (t === "ord" || t === "blocks") {
      const built = [];
      const draw = () => { $("#built").innerHTML = built.map((b, k) => `<button class="w" data-r="${k}">${esc(b.textContent)}</button>`).join(""); $$("#built [data-r]", box).forEach((x) => x.onclick = () => { if (answered) return; const [rm] = built.splice(+x.dataset.r, 1); rm.classList.remove("used"); draw(); }); };
      $$(".bank .w", box).forEach((b) => b.onclick = () => { if (answered || b.classList.contains("used")) return; b.classList.add("used"); built.push(b); draw(); });
      $("#oc").onclick = () => { if (answered || !built.length) return; const v = built.map((b) => b.textContent).join(" "); const want = t === "blocks" ? ex[2].join(" ") : ex[2]; finish(norm(v) === norm(want), want, "", v); };
    }
  }
  function choose(k) {
    const ex = items[i]; if (answered) return;
    $$(".opt", box)[k].classList.add(k === ex[3] ? "right" : "wrong"); $$(".opt", box)[ex[3]].classList.add("right");
    finish(k === ex[3], ex[2][ex[3]], ex[4], ex[2][k]);
  }
  function finish(ok, answer, why, given, close) {
    answered = true; const ex = items[i];
    if (ok) correct++; else wrongs.push({ q: ex[1], answer, given, why, type: ex[0], ex });
    recordEx(ex, ok);
    const full = ex[0] === "fill" ? ex[1].replace(/_{2,}/, answer).replace(/\s*\([^)]*\)/g, "").trim() : ex[0] === "mc" ? (ex[1].includes("___") ? ex[1].replace(/_{2,}/, answer) : answer) : answer;
    $("#fb").innerHTML = `<div class="feedback ${ok ? "good" : "bad"}"><b>${ok ? "¡Correcto!" : close ? "Casi. Respuesta esperada:" : "Respuesta correcta:"}</b> ${ok ? "" : esc(answer)} ${speakBtn(full)}
      ${!ok && !["mc", "ord", "blocks"].includes(ex[0]) && ex[2].length > 1 ? `<div class="small muted">También vale: ${ex[2].slice(1, 4).map(esc).join(" · ")}</div>` : ""}
      ${why ? `<p>${esc(why)}</p>` : ""}${o.strict ? "" : csBox(full)}${!ok && ["tr", "fix", "fill", "sub"].includes(ex[0]) && !o.strict ? `<button class="btn ghost small" id="mine">Mi respuesta también es correcta</button>` : ""}</div>
      <button class="btn wide" id="nx">Continuar ⏎</button>`;
    if ($("#mine")) $("#mine").onclick = () => { correct++; wrongs.pop(); recordEx(ex, true, true); $("#mine").outerHTML = `<span class="small">✓ Contada como correcta</span>`; };
    $("#nx").onclick = next; $("#nx").focus();
  }
  function next() { i++; show(); }
  box.onkeydown = (e) => {
    const ex = items[i]; if (!ex) return;
    if (!answered && ex[0] === "mc" && /^[1-9]$/.test(e.key) && +e.key <= ex[2].length) choose(+e.key - 1);
  };
  show();
}

// ---------- Comprensión (lectura y escucha) ----------
function comprehension(box, item, o) {
  const isL = o.kind === "listening"; const ans = {}; let shownT = !isL;
  function draw() {
    const all = item.q.every((_, k) => ans[k] !== undefined);
    const c = item.q.filter((q, k) => ans[k] === q[2]).length;
    box.innerHTML = `<div class="row between"><div><h1>${esc(item.title)}</h1><div class="muted small">${o.subtitle || "Nivel " + item.level}</div></div>${o.onExit ? `<button class="btn ghost small" id="exit">Salir</button>` : ""}</div>
    ${isL ? `<div class="card player"><div class="row center"><button class="btn big-btn" id="play">▶️ Escuchar el audio</button><button class="btn ghost" id="slow">🐢 Más lento</button><button class="btn ghost" id="stop">⏹️</button></div><p class="muted small center">Escucha todas las veces que necesites. ${o.exam ? "" : "La transcripción se muestra al terminar."}</p></div>` : ""}
    ${!isL ? `<div class="card reading">${speakBtn(item.text, "🔊 Escuchar el texto")}${item.text.split(/\n\n+/).map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("")}</div>
      ${item.gloss && !o.exam ? `<details class="card"><summary><b>Glosario</b> (${item.gloss.length})</summary><div class="list">${item.gloss.map(([en, es]) => `<div class="li">${picHTML(en, "lst")}<div><b>${esc(en)}</b> — ${esc(es)}${pronHTML(en)}</div>${speakBtn(en)}<button class="btn ghost small" data-add="${esc(en)}|${esc(es)}">+ Tarjeta</button></div>`).join("")}</div></details>` : ""}` : ""}
    <h2>Preguntas</h2>${item.q.map((q, k) => `<div class="card excard"><p class="q">${k + 1}. ${esc(q[0])}</p><div class="opts">${q[1].map((x, j) => `<button class="opt ${ans[k] !== undefined ? (j === q[2] ? "right" : j === ans[k] ? "wrong" : "") : ""}" data-q="${k}" data-j="${j}">${esc(x)}</button>`).join("")}</div></div>`).join("")}
    ${isL && (shownT || all) && !o.exam ? `<details class="card" ${all ? "open" : ""}><summary><b>Transcripción</b></summary>${item.lines.map(([sp, t], i) => `<div class="line" data-line="${i}"><p><b>${esc(sp)}:</b> ${esc(t)} ${speakBtn(t)}</p>${csBox(t, false)}</div>`).join("")}</details>` : ""}
    ${all ? `<div class="card center"><h2>${c} de ${item.q.length} correctas</h2><div class="row center">${!o.exam ? `<button class="btn ghost" id="retell">🗣️ Cuéntalo con tus palabras</button>` : ""}<button class="btn" id="done">${o.exam ? "Continuar" : "Terminar"}</button></div></div>` : ""}`;
    if (o.onExit) $("#exit").onclick = () => { stopSpeech(); o.onExit(); };
    if (isL) {
      const lines = item.lines.map(([sp, t]) => [sp.charCodeAt(0) - 65, t]);
      $("#play").onclick = () => speakLines(lines); $("#slow").onclick = () => speakLines(lines, Math.max(0.6, S.settings.rate - 0.2)); $("#stop").onclick = stopSpeech;
    }
    $$("[data-q]", box).forEach((b) => b.onclick = () => { const k = +b.dataset.q; if (ans[k] !== undefined) return; ans[k] = +b.dataset.j; const y = window.scrollY; draw(); window.scrollTo(0, y); });
    $$("[data-add]", box).forEach((b) => b.onclick = () => { const [en, es] = b.dataset.add.split("|"); addCustomCard(en, es, ""); b.textContent = "✓"; b.disabled = true; });
    if ($("#done")) $("#done").onclick = () => { stopSpeech(); o.onFinish(c, item.q.length); };
    if ($("#retell")) $("#retell").onclick = () => { stopSpeech(); retellPage(box, item, () => { draw(); window.scrollTo(0, 0); }); };
  }
  draw();
}

// ---------- Generadores ----------
function vocabQuestions(levels, n) {
  const pool = ALL_VOCAB.filter((v) => levels.includes(v.level));
  return shuffle(pool).slice(0, n).map((w, k) => {
    const others = shuffle(pool.filter((x) => x.id !== w.id && x.es !== w.es)).slice(0, 3);
    if (k % 2) { const opts = shuffle([w, ...others]); return ["mc", `¿Cómo se dice “${w.es}” en inglés?`, opts.map((x) => x.en), opts.indexOf(w), w.ex]; }
    const opts = shuffle([w, ...others]); return ["mc", `¿Qué significa “${w.en}”?`, opts.map((x) => x.es), opts.indexOf(w), w.ex];
  });
}
function grammarQuestions(lv, n, types) { return shuffle(LESSONS[lv].flatMap((l) => l.ex).filter((e) => !types || types.includes(e[0]))).slice(0, n); }

// ---------- INICIO ----------
function levelProgress(lv) { const ls = LESSONS[lv]; const d = ls.filter((l) => S.lessons[l.id] && S.lessons[l.id].best >= 0.7).length; return { done: d, total: ls.length, pct: d / ls.length }; }
function nextLesson() { return LESSONS[S.level].find((l) => !(S.lessons[l.id] && S.lessons[l.id].best >= 0.7)); }
function dueLessons() { const now = Date.now(); return ALL_LESSONS.filter((l) => { const r = S.lessons[l.id]; return r && r.best >= 0.7 && r.due && r.due <= now; }); }
function extraTask() {
  const d = new Date().getDay();
  if (d === 1 || d === 4) return { k: "extra", ic: "📖", t: "Lee un texto", s: "Comprensión lectora", go: "leer" };
  if (d === 2 || d === 5) return { k: "extra", ic: "💬", t: "Conversación guiada", s: "Practica hablar en una situación real", go: "hablar" };
  if (d === 3 || d === 6) return { k: "extra", ic: "✍️", t: "Escribe un texto", s: "Compáralo con el modelo", go: "escribir" };
  return { k: "extra", ic: "📖", t: "Lee un texto", s: "Comprensión lectora", go: "leer" };
}
RENDER.inicio = (m) => {
  if (!S.placementDone) {
    m.innerHTML = `<h1>¡Bienvenido a English Path!</h1><div class="card hero"><p>Antes de empezar, conviene saber tu nivel real. La <b>prueba de ubicación</b> tarda unos 10 minutos y te pone en el nivel adecuado, para que no repitas lo que ya sabes.</p>
    <div class="row"><button class="btn big-btn" id="pt">Hacer la prueba de ubicación</button><button class="btn ghost" id="skip">Empezar desde A2</button></div></div>
    <div class="card"><h2>Cómo funciona</h2><ol><li><b>Todos los días</b> sigues tu sesión de hoy: tarjetas, gramática, escucha y una actividad extra.</li><li>Cada nivel tiene gramática, vocabulario, lecturas, audios, conversaciones guiadas y escritura.</li><li>Cuando completes las lecciones, presentas el <b>examen de nivel</b> (gramática, vocabulario, lectura y escucha) para subir.</li></ol></div>`;
    $("#pt").onclick = () => placementTest(m);
    $("#skip").onclick = () => { S.placementDone = true; save(); render(); };
    return;
  }
  const { due, fresh, rev } = dueCards(), nl = nextLesson(), dl = dueLessons(), p = levelProgress(S.level), t = daily(), ex = extraTask();
  const tasks = [
    { k: "cards", ic: "🗂️", t: `Repasa tus tarjetas`, s: `${due.length} pendientes · ${fresh.length + rev.length} nuevas`, go: "tarjetas" },
    { k: "grammar", ic: "📘", t: dl.length ? `Repaso de gramática (${dl.length})` : nl ? nl.title : `Examen de nivel ${S.level}`, s: dl.length ? "Lecciones que toca repasar" : nl ? "Siguiente lección" : "Ya puedes presentarlo", go: "gramatica" },
    { k: "listening", ic: "🎧", t: "Escucha un diálogo", s: "O haz 5 dictados", go: "escuchar" }, ex
  ];
  const doneN = tasks.filter((x) => t[x.k]).length;
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); const k = d.toLocaleDateString("en-CA"); return { v: S.history[k] || 0, l: d.toLocaleDateString("es-CO", { weekday: "narrow" }) }; });
  const max = Math.max(DAILY_GOAL, ...days.map((d) => d.v));
  const cd = CANDO[S.level] || [], cds = S.cando[S.level] || [];
  const skillNames = { vocab: "Vocabulario", grammar: "Gramática", listening: "Escucha", reading: "Lectura", speaking: "Habla", writing: "Escritura" };
  const examReady = p.pct >= 0.7;
  m.innerHTML = `<h1>Tu camino hacia el C1</h1>
  <div class="path">${LEVELS.map((lv) => { const u = S.unlocked.includes(lv), cur = lv === S.level, ps = S.exams[lv] && S.exams[lv].passed; return `<div class="step ${cur ? "cur" : ""} ${ps ? "done" : ""} ${u ? "" : "locked"}"><b>${lv}</b><small>${esc(LEVEL_INFO[lv].name)}</small>${ps ? "<em>✓</em>" : u ? "" : "<em>🔒</em>"}</div>`; }).join('<div class="link"></div>')}</div>
  <div class="card hero"><div class="muted">Nivel actual: ${S.level} · ${esc(LEVEL_INFO[S.level].name)}</div><p>${esc(LEVEL_INFO[S.level].goal)}</p>
    <div class="bar big"><i style="width:${p.pct * 100}%"></i></div><div class="muted small">${p.done}/${p.total} lecciones aprobadas${examReady ? ` · <a href="#gramatica">¡Ya puedes presentar el examen ${S.level}!</a>` : " · Aprueba el 70% para el examen"}</div></div>
  <h2>Tu sesión de hoy <span class="muted small">${doneN}/4</span></h2>
  <div class="tasks">${tasks.map((x) => `<button class="task ${t[x.k] ? "done" : ""}" data-go="${x.go}"><span class="big">${x.ic}</span><span><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span><span class="chk">${t[x.k] ? "✅" : "○"}</span></button>`).join("")}</div>
  ${(() => { const w = weakLessons()[0]; return w && w.rate < 0.75 ? `<div class="card note row between"><div>🎯 Tu tema más débil: <b>${esc(w.l.title)}</b> (${Math.round(w.rate * 100)}% de acierto)</div><button class="btn small" data-go="progreso">Ver diagnóstico</button></div>` : ""; })()}
  ${(() => { const nl = DEV.lessons.find((l) => !(S.lessons[l.id] && S.lessons[l.id].best >= 0.7)); return `<div class="card row between"><div>💻 <b>Inglés para tu trabajo</b><div class="muted small">${nl ? "Siguiente: " + esc(nl.title) : "Repasa entrevistas y conversaciones técnicas"}</div></div><button class="btn small" data-go="ti">Abrir</button></div>`; })()}
  <h2>Habilidades</h2><div class="card skills">${Object.entries(skillNames).map(([k, n]) => { const [c, tt] = S.skills[k]; return `<div class="sk"><span>${n}</span><div class="bar"><i style="width:${pct(c, tt)}%"></i></div><small>${tt ? pct(c, tt) + "% · " + tt + " resp." : "Sin datos"}</small></div>`; }).join("")}</div>
  <h2>Últimos 14 días</h2><div class="card week">${days.map((d) => `<div class="col"><div class="b" style="height:${Math.max(3, (d.v / max) * 90)}px" title="${d.v} XP"></div><small>${d.l}</small></div>`).join("")}</div>
  <div class="stats"><div class="card stat"><b>${S.xp}</b><small>XP total</small></div><div class="card stat"><b>${learnedCount()}</b><small>Palabras aprendidas</small></div><div class="card stat"><b>${Object.values(S.lessons).filter((l) => l.best >= 0.7).length}</b><small>Lecciones aprobadas</small></div><div class="card stat"><b>${Object.keys(S.done.reading).length + Object.keys(S.done.listening).length}</b><small>Textos y audios</small></div></div>
  <h2>Objetivos del nivel ${S.level}</h2><div class="card"><p class="muted small">Marca lo que ya puedes hacer con seguridad. Es tu autoevaluación honesta.</p>${cd.map((x, i) => `<label class="cando"><input type="checkbox" data-cd="${i}" ${cds[i] ? "checked" : ""}> ${esc(x)}</label>`).join("")}</div>
  <p class="muted small" id="sync">${esc(Sync.text || "")}</p>`;
  $$("[data-cd]", m).forEach((c) => c.onchange = () => { S.cando[S.level] = S.cando[S.level] || []; S.cando[S.level][+c.dataset.cd] = c.checked; save(); });
};

function placementTest(m) {
  const levels = LEVELS.slice(); let li = 0, reached = "A2";
  const runLevel = () => {
    const lv = levels[li];
    const items = shuffle(grammarQuestions(lv, 6, ["mc", "fill"]).concat(vocabQuestions([lv], 3)));
    exerciseRunner(m, items, {
      title: "Prueba de ubicación", subtitle: `Bloque ${li + 1} de ${levels.length} · Si no sabes, no adivines: elige la que creas y sigue.`, strict: true,
      onExit: () => render(),
      onFinish: (c, n) => {
        const ok = c / n >= 0.7;
        if (ok && li < levels.length - 1) { li++; reached = levels[li]; runLevel(); return; }
        const final = ok ? "C2" : levels[li];
        S.level = final; S.unlocked = LEVELS.slice(0, lvlIdx(final) + 1); S.placementDone = true;
        LEVELS.slice(0, lvlIdx(final)).forEach((l) => { S.exams[l] = S.exams[l] || { best: 0, passed: true, placement: true }; });
        vq = null; save();
        m.innerHTML = `<div class="card center"><div class="big">🎯</div><h2>Tu nivel para empezar: ${final}</h2><p>${esc(LEVEL_INFO[final].goal)}</p><p class="muted">Se desbloquearon los niveles anteriores para que puedas repasarlos cuando quieras. Las tarjetas empiezan por el vocabulario de tu nivel.</p><button class="btn" id="ok">Empezar</button></div>`;
        $("#ok").onclick = () => render();
      }
    });
  };
  runLevel();
}

// ---------- TARJETAS ----------
let vq = null;
RENDER.tarjetas = (m) => {
  if (sub === "list") return vocabList(m);
  if (!vq) { const { due, fresh, rev } = dueCards(); vq = { list: shuffle(due).concat(shuffle(fresh), shuffle(rev)), i: 0, flipped: false, done: 0, typed: null }; }
  const it = vq.list[vq.i];
  if (!it) {
    if (vq.done) markDaily("cards");
    const { totalNew } = dueCards();
    m.innerHTML = `<div class="row between"><h1>Tarjetas</h1><button class="btn ghost small" id="lst">📚 Ver todas</button></div><div class="card center"><div class="big">🎉</div><h2>¡Al día!</h2><p>Repasaste ${vq.done} tarjetas. La repetición espaciada funciona mejor poco y todos los días.</p><p class="muted">${totalNew} palabras nuevas disponibles hasta ${S.level}. Cada día entran también ${IRR_NEW_PER_DAY} verbos irregulares nuevos.</p><div class="row center"><button class="btn" id="more">Aprender 5 más</button><button class="btn ghost" id="vquiz">🖼️ Quiz con imágenes</button></div></div>`;
    $("#vquiz").onclick = () => visualQuiz(m, () => render());
    $("#more").onclick = () => { S.newToday.n = Math.max(0, S.newToday.n - 5); vq = null; render(); };
    $("#lst").onclick = () => { sub = "list"; render(); };
    return;
  }
  const { c, dir } = it, key = c.id + (dir === "r" ? ":r" : ""), isNew = !S.cards[key];
  if (dir === "irr") return irrCard(m, it, key, isNew);
  const head = `<div class="row between"><h1>Tarjetas</h1><button class="btn ghost small" id="lst">📚 Ver todas</button></div><div class="muted small">${vq.i + 1}/${vq.list.length} · ${isNew ? "Nueva" : "Repaso"} · ${dir === "r" ? "Español → inglés (escribe)" : "Inglés → español"} · ${c.level === "MIS" ? "Tus palabras" : c.level === "DEV" ? "💻 Inglés TI · " + esc(c.topic || "") : c.level + " · " + esc(c.topic || "")}</div>`;
  const nextCard = (q) => { grade(key, q); vq.done++; if (q < 3) vq.list.push(it); vq.i++; vq.flipped = false; vq.typed = null; render(); };
  if (dir === "f") {
    m.innerHTML = `${head}<div class="flash" id="flash">${picHTML(c.en, "big")}<div class="word">${esc(c.en)}</div>${speakBtn(c.en)}${pronHTML(c.en, { tips: vq.flipped })}${vq.flipped ? `<div class="back">${photoHTML(c.en)}<div class="word es">${esc(c.es)}</div>${c.ex ? `<p class="exs">“${esc(c.ex)}” ${speakBtn(c.ex)}</p>${csBox(c.ex, false)}` : ""}</div>` : `<div class="muted small">¿Qué significa? Piénsalo y toca para ver</div>`}</div>
    ${vq.flipped ? `<div class="grades"><button class="btn red" data-q="1">Otra vez<small>${intervalLabel(key, 1)}</small></button><button class="btn orange" data-q="3">Difícil<small>${intervalLabel(key, 3)}</small></button><button class="btn" data-q="4">Bien<small>${intervalLabel(key, 4)}</small></button><button class="btn green" data-q="5">Fácil<small>${intervalLabel(key, 5)}</small></button></div>` : `<button class="btn wide" id="show">Mostrar respuesta (espacio)</button>`}`;
    const flip = () => { if (!vq.flipped) { vq.flipped = true; render(); } };
    $("#flash").onclick = (e) => { if (!e.target.closest("[data-speak]")) flip(); };
    if ($("#show")) $("#show").onclick = flip;
    if (!vq.flipped) setTimeout(() => speak(c.en), 150);
    $$("[data-q]", m).forEach((b) => b.onclick = () => nextCard(+b.dataset.q));
    m.onkeydown = null;
    document.onkeydown = (e) => { if (view !== "tarjetas" || sub) return; if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return; if (e.key === " " && !vq.flipped) { e.preventDefault(); flip(); } else if (vq.flipped && ["1", "2", "3", "4"].includes(e.key)) nextCard([1, 3, 4, 5][+e.key - 1]); };
  } else {
    const enA = c.en.replace(/\s*\(.*?\)/g, "").trim(), hint = enA.split(" ").map((w) => w[0] + "_".repeat(Math.max(1, w.length - 1))).join(" ");
    const r = vq.typed;
    m.innerHTML = `${head}<div class="flash rev">${picHTML(c.en, "big")}<div class="word es">${esc(c.es)}</div>${c.ex ? `<p class="exs">“${esc(c.ex.replace(new RegExp(c.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "_____"))}”</p>` : ""}<div class="muted small">Pista: ${esc(hint)}</div></div>
    ${r ? `<div class="feedback ${r.ok ? "good" : "bad"}"><b>${r.ok ? "¡Correcto!" : "Era:"}</b> ${esc(c.en)} ${speakBtn(c.en)}${pronHTML(c.en, { tips: true })}${photoHTML(c.en)}${!r.ok ? `<div class="small">Escribiste: ${esc(r.v)}</div>` : ""}</div>
      ${r.ok ? `<div class="grades three"><button class="btn orange" data-q="3">Difícil<small>${intervalLabel(key, 3)}</small></button><button class="btn" data-q="4">Bien<small>${intervalLabel(key, 4)}</small></button><button class="btn green" data-q="5">Fácil<small>${intervalLabel(key, 5)}</small></button></div>` : `<div class="row"><button class="btn" data-q="1">Continuar</button><button class="btn ghost small" data-q="3">Lo tenía bien (error de tipeo)</button></div>`}`
    : `<form id="rf" class="row"><input id="ri" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribe en inglés"><button class="btn">Comprobar</button></form><button class="btn ghost small" id="idk">No lo sé</button>`}`;
    if (!r) {
      $("#ri").focus();
      $("#rf").onsubmit = (e) => { e.preventDefault(); const v = $("#ri").value.trim(); if (!v) return; const ok = norm(v) === norm(c.en) || norm(v) === norm(enA) || similarity(v, enA) >= 0.9; vq.typed = { ok, v }; render(); if (ok) speak(c.en); };
      $("#idk").onclick = () => { vq.typed = { ok: false, v: "—" }; render(); speak(c.en); };
    }
    $$("[data-q]", m).forEach((b) => b.onclick = () => nextCard(+b.dataset.q));
    document.onkeydown = null;
  }
  $("#lst").onclick = () => { sub = "list"; render(); };
};
let vlFilter = { q: "", lv: null, topic: "" };
function vocabList(m) {
  const lv = vlFilter.lv || S.level;
  if (lv === "IRR") return irrList(m);
  const topics = [...new Set(ALL_VOCAB.filter((v) => v.level === lv).map((v) => v.topic))];
  const list = (lv === "MIS" ? S.custom : ALL_VOCAB.filter((v) => v.level === lv)).filter((v) => (!vlFilter.topic || v.topic === vlFilter.topic) && (!vlFilter.q || (v.en + " " + v.es).toLowerCase().includes(vlFilter.q.toLowerCase())));
  m.innerHTML = `<div class="row between"><h1>Vocabulario</h1><button class="btn ghost small" id="back">← Repasar</button></div>
  <div class="tabs">${LEVELS.map((l) => `<button class="tab ${l === lv ? "on" : ""}" data-l="${l}">${l}${S.unlocked.includes(l) ? "" : " 🔒"}</button>`).join("")}<button class="tab ${lv === "MIS" ? "on" : ""}" data-l="MIS">Mías (${S.custom.length})</button><button class="tab ${lv === "IRR" ? "on" : ""}" data-l="IRR">Irregulares (${IRREG.length})</button></div>
  <div class="row"><input id="q" placeholder="Buscar en inglés o español…" value="${esc(vlFilter.q)}">${lv !== "MIS" ? `<select id="tp"><option value="">Todos los temas</option>${topics.map((t) => `<option ${t === vlFilter.topic ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>` : ""}</div>
  ${!S.unlocked.includes(lv) && lv !== "MIS" ? `<p class="note card">Puedes ver este vocabulario, pero entrará a tus tarjetas cuando llegues a ${lv}.</p>` : ""}
  ${pronGuide()}<div class="row"><button class="btn ghost small" id="vquiz">🖼️ Quiz con imágenes</button></div>
  <div class="card list">${list.map((v) => { const st = S.cards[v.id]; return `<div class="li">${picHTML(v.en, "lst")}<div><b>${esc(v.en)}</b> — ${esc(v.es)}${pronHTML(v.en)}<div class="muted small">${esc(v.ex)}</div></div>${speakBtn(v.en)}<span class="tag">${st ? (st.reps >= 2 ? "Aprendida" : "En curso") : "Nueva"}</span></div>`; }).join("") || "<p class='muted'>Nada por aquí.</p>"}</div>
  <h2>Agregar mi propia palabra</h2><form id="af" class="card"><div class="row"><input id="aen" placeholder="Inglés" required><input id="aes" placeholder="Español" required></div><input id="aex" placeholder="Frase de ejemplo (opcional)"><button class="btn">Agregar a mis tarjetas</button></form>`;
  $("#back").onclick = () => { sub = null; render(); };
  $("#vquiz").onclick = () => visualQuiz(m, () => vocabList(m));
  $$("[data-l]", m).forEach((b) => b.onclick = () => { vlFilter = { q: vlFilter.q, lv: b.dataset.l, topic: "" }; render(); });
  $("#q").oninput = (e) => { vlFilter.q = e.target.value; clearTimeout(vocabList.t); vocabList.t = setTimeout(() => { const pos = e.target.selectionStart; vocabList(m); const q = $("#q"); q.focus(); q.setSelectionRange(pos, pos); }, 250); };
  if ($("#tp")) $("#tp").onchange = (e) => { vlFilter.topic = e.target.value; vocabList(m); };
  $("#af").onsubmit = (e) => { e.preventDefault(); addCustomCard($("#aen").value.trim(), $("#aes").value.trim(), $("#aex").value.trim()); vocabList(m); };
}

// ---------- GRAMÁTICA ----------
let gLevel = null;
RENDER.gramatica = (m) => {
  gLevel = gLevel || S.level;
  if (sub && sub.lesson) return lessonPage(m, sub.lesson);
  const lv = gLevel, unlocked = S.unlocked.includes(lv), p = levelProgress(lv), ex = S.exams[lv], dl = dueLessons();
  const now = Date.now();
  m.innerHTML = `<h1>Gramática</h1>
  ${dl.length ? `<div class="card note row between"><div><b>🔁 Repaso pendiente:</b> ${dl.length} lección(es) aprobada(s) necesitan repaso para no olvidarlas.</div><button class="btn" id="rev">Repasar ahora</button></div>` : ""}
  ${levelTabs(lv)}
  ${!unlocked ? `<div class="card note">🔒 ${lv} se desbloquea al aprobar el examen de ${LEVELS[lvlIdx(lv) - 1]}. Puedes ver las lecciones, pero no practicarlas todavía.</div>` : ""}
  <p class="muted">${esc(LEVEL_INFO[lv].goal)}</p>
  <div class="lessons">${LESSONS[lv].map((l, k) => { const r = S.lessons[l.id]; const due = r && r.due && r.due <= now; return `<button class="lesson ${unlocked ? "" : "dim"}" data-l="${l.id}"><span class="num">${k + 1}</span><span><b>${esc(l.title)}</b><small>${l.ex.length} ejercicios${r ? ` · Mejor: ${Math.round(r.best * 100)}%` : ""}${r && r.due ? ` · ${due ? "Toca repasar" : "Repaso el " + new Date(r.due).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}` : ""}</small></span><span class="st">${due ? "🔁" : r && r.best >= 0.7 ? "✅" : ""}</span></button>`; }).join("")}</div>
  <div class="card exam"><div><b>🎓 Examen de nivel ${lv}</b><p class="muted small">4 secciones: gramática (12), vocabulario (8), lectura y escucha. Para aprobar: 75% en total y al menos 60% en cada sección.${ex ? ` Mejor resultado: ${Math.round(ex.best * 100)}%.` : ""}${ex && ex.placement ? " (Aprobado por la prueba de ubicación.)" : ""}</p></div>
    <button class="btn" id="exam">${ex && ex.passed ? "Repetir examen" : "Presentar examen"}</button></div>`;
  bindTabs(m, (l) => { gLevel = l; render(); });
  if ($("#rev")) $("#rev").onclick = () => grammarReview(m);
  $$("[data-l]", m).forEach((b) => b.onclick = () => { sub = { lesson: LESSONS[lv].find((x) => x.id === b.dataset.l) }; render(); });
  $("#exam").onclick = () => { if (!unlocked) { toast(`Primero aprueba el examen de ${LEVELS[lvlIdx(lv) - 1]}`); return; } levelExam(m, lv); };
};
function lessonPage(m, l) {
  const lv = l.id.split("-")[0].toUpperCase(), unlocked = S.unlocked.includes(lv);
  m.innerHTML = `<div class="row between"><h1>${esc(l.title)}</h1><button class="btn ghost small" id="back">← Volver</button></div>
  <div class="card explain">${l.explain}<p class="muted small">💡 Toca cualquier ejemplo en cursiva para escucharlo.</p></div>
  ${unlocked ? `<button class="btn big-btn" id="start">Practicar (${l.ex.length} ejercicios)</button>` : `<p class="note card">Disponible cuando desbloquees ${lv}.</p>`}`;
  $("#back").onclick = () => { sub = null; render(); };
  $$(".explain i", m).forEach((it) => { it.classList.add("sp"); it.onclick = () => speak(it.textContent); });
  if ($("#start")) $("#start").onclick = () => exerciseRunner(m, shuffle(l.ex), {
    title: l.title, onExit: () => render(),
    onFinish: (c, n, wrongs) => {
      const r = S.lessons[l.id] || { best: 0, tries: 0, stage: 0 }; const p = c / n;
      const firstPass = p >= 0.7 && !(r.best >= 0.7);
      r.best = Math.max(r.best, p); r.tries++; if (firstPass) { r.stage = 0; r.due = Date.now() + REVIEW_STEPS[0] * DAY; }
      S.lessons[l.id] = r; skill("grammar", c, n);
      wrongs.forEach((w) => addMistake({ type: "Gramática", wrong: w.given, right: w.answer, note: `${l.title}${w.why ? ": " + w.why : ""}`, q: w.q }));
      markDaily("grammar"); addXP(c * 5);
      m.innerHTML = `<div class="card center"><div class="big">${p >= 0.7 ? "🏆" : "💪"}</div><h2>${c} de ${n} (${pct(c, n)}%)</h2><p>${p >= 0.7 ? `¡Lección aprobada!${firstPass ? ` Te la volveré a pedir en ${REVIEW_STEPS[0]} días para que no se te olvide.` : ""}` : "Necesitas 70%. Relee la explicación y vuelve a intentarlo."}</p>${wrongs.length ? `<p class="muted small">Tus errores quedaron en “Errores” para practicarlos.</p>` : ""}<div class="row center"><button class="btn" id="again">Repetir</button><button class="btn ghost" id="lst">Volver</button></div></div>`;
      $("#again").onclick = () => render(); $("#lst").onclick = () => { sub = null; render(); };
    }
  });
}
function grammarReview(m, lessons, title) {
  const ls = lessons || dueLessons().slice(0, 4);
  const ordered = shuffle(ls.flatMap((l) => shuffle(l.ex).slice(0, lessons ? 5 : 4)));
  exerciseRunner(m, ordered, {
    title: title || "Repaso de gramática", subtitle: ls.map((l) => l.title).join(" · "), onExit: () => render(),
    onFinish: (c, n, wrongs) => {
      const wrongSet = new Set(wrongs.map((w) => w.ex));
      if (!lessons) ls.forEach((l) => { const r = S.lessons[l.id]; const its = ordered.filter((e) => EX_LESSON.get(e) === l.id); const ok = its.filter((e) => !wrongSet.has(e)).length; if (ok / its.length >= 0.75) r.stage = Math.min(REVIEW_STEPS.length - 1, (r.stage || 0) + 1); else r.stage = Math.max(0, (r.stage || 0) - 1); r.due = Date.now() + REVIEW_STEPS[r.stage] * DAY; });
      wrongs.forEach((w) => addMistake({ type: "Gramática", wrong: w.given, right: w.answer, note: w.why || "Repaso", q: w.q }));
      skill("grammar", c, n); markDaily("grammar"); addXP(c * 4);
      m.innerHTML = `<div class="card center"><div class="big">🔁</div><h2>${c} de ${n} correctas</h2><p>${lessons ? "Sigue reforzando estos temas hasta superar el 80%." : "Programé el próximo repaso de cada lección según tu resultado."}</p><button class="btn" id="ok">Continuar</button></div>`;
      $("#ok").onclick = () => render();
    }
  });
}
function levelExam(m, lv) {
  const sections = [
    { name: "Gramática", kind: "ex", items: grammarQuestions(lv, 12) },
    { name: "Vocabulario", kind: "ex", items: vocabQuestions([lv], 8) }
  ];
  if ((READINGS[lv] || []).length) sections.push({ name: "Lectura", kind: "reading", item: pick(ALL_READINGS.filter((r) => r.level === lv)) });
  if ((LISTENING[lv] || []).length) sections.push({ name: "Escucha", kind: "listening", item: pick(ALL_LISTENING.filter((r) => r.level === lv)) });
  const res = []; let si = 0;
  const exit = () => { stopSpeech(); render(); };
  const intro = () => {
    m.innerHTML = `<div class="card"><h1>Examen de nivel ${lv}</h1><p>${sections.map((s, i) => `${i + 1}. <b>${s.name}</b>`).join(" · ")}</p><p class="muted">Sin explicaciones durante el examen. Al final verás tu resultado por sección. Necesitas <b>75% en total</b> y <b>60% en cada sección</b>.</p><div class="row"><button class="btn big-btn" id="go">Empezar</button><button class="btn ghost" id="x">Cancelar</button></div></div>`;
    $("#go").onclick = runS; $("#x").onclick = exit;
  };
  const runS = () => {
    const s = sections[si]; if (!s) return finish();
    const sub = `Examen ${lv} · Sección ${si + 1}/${sections.length}: ${s.name}`;
    const done = (c, n) => { res.push({ name: s.name, c, n }); si++; runS(); };
    if (s.kind === "ex") exerciseRunner(m, s.items, { title: s.name, subtitle: sub, strict: true, onExit: exit, onFinish: (c, n) => done(c, n) });
    else comprehension(m, s.item, { kind: s.kind, exam: true, subtitle: sub, onExit: exit, onFinish: done });
  };
  const finish = () => {
    const C = res.reduce((a, r) => a + r.c, 0), N = res.reduce((a, r) => a + r.n, 0), total = C / N;
    const passed = total >= 0.75 && res.every((r) => r.c / r.n >= 0.6);
    const r = S.exams[lv] || { best: 0, passed: false }; r.best = Math.max(r.best, total); r.placement = false;
    let msg = "";
    if (passed) {
      r.passed = true; const nx = LEVELS[lvlIdx(lv) + 1];
      if (nx) { if (!S.unlocked.includes(nx)) S.unlocked.push(nx); if (lvlIdx(nx) > lvlIdx(S.level)) { S.level = nx; gLevel = nx; vq = null; } msg = `¡Felicitaciones! Subiste a <b>${nx}</b>. Se desbloquearon nuevas lecciones, vocabulario, lecturas, audios, conversaciones y temas de escritura.`; }
      else msg = "¡Completaste el camino hasta C2! Sigue con tarjetas, lecturas y escritura para mantener el nivel.";
    } else msg = "Todavía no. Revisa las secciones más bajas: repite las lecciones con menor puntaje, haz más lecturas o audios del nivel y vuelve a intentarlo.";
    S.exams[lv] = r;
    res.forEach((x) => skill({ Gramática: "grammar", Vocabulario: "vocab", Lectura: "reading", Escucha: "listening" }[x.name], x.c, x.n));
    addXP(C * 5);
    m.innerHTML = `<div class="card center"><div class="big">${passed ? "🎓" : "📚"}</div><h2>${pct(C, N)}% en total</h2>
      <div class="secs">${res.map((x) => `<div class="sec ${x.c / x.n >= 0.6 ? "ok" : "low"}"><b>${x.name}</b><span>${x.c}/${x.n} · ${pct(x.c, x.n)}%</span></div>`).join("")}</div><p>${msg}</p><button class="btn" id="ok">Continuar</button></div>`;
    $("#ok").onclick = () => render();
  };
  intro();
}

// ---------- ESCUCHAR ----------
let lTab = "dialogos", dq = null;
RENDER.escuchar = (m) => {
  if (sub && sub.item) return comprehension(m, sub.item, { kind: "listening", onExit: () => { sub = null; render(); }, onFinish: (c, n) => { S.done.listening[sub.item.id] = Math.max(S.done.listening[sub.item.id] || 0, c / n); skill("listening", c, n); markDaily("listening"); addXP(c * 5); sub = null; render(); } });
  m.innerHTML = `<h1>Escuchar</h1><div class="tabs"><button class="tab ${lTab === "dialogos" ? "on" : ""}" data-t="dialogos">Diálogos</button><button class="tab ${lTab === "dictado" ? "on" : ""}" data-t="dictado">Dictado</button></div><div id="lbody"></div>`;
  $$("[data-t]", m).forEach((b) => b.onclick = () => { lTab = b.dataset.t; render(); });
  const box = $("#lbody");
  if (lTab === "dialogos") {
    const list = ALL_LISTENING.filter((x) => S.unlocked.includes(x.level)).sort((a, b) => (b.level === S.level) - (a.level === S.level) || lvlIdx(b.level) - lvlIdx(a.level));
    box.innerHTML = `<p class="muted">Conversaciones con varias voces. Escucha primero sin leer, responde y al final revisa la transcripción.</p><div class="lessons">${list.map((x) => `<button class="lesson" data-i="${x.id}"><span class="num">${x.level}</span><span><b>${esc(x.title)}</b><small>${x.lines.length} intervenciones · ${x.q.length} preguntas${S.done.listening[x.id] !== undefined ? ` · Mejor: ${Math.round(S.done.listening[x.id] * 100)}%` : ""}</small></span><span class="st">${S.done.listening[x.id] >= 0.75 ? "✅" : ""}</span></button>`).join("")}</div>`;
    $$("[data-i]", box).forEach((b) => b.onclick = () => { sub = { item: ALL_LISTENING.find((x) => x.id === b.dataset.i) }; render(); });
    return;
  }
  if (!dq) dq = { list: shuffle(LEVELS.filter((l) => S.unlocked.includes(l)).flatMap((l) => SENTENCES[l].map((s) => ({ s, l })))).sort((a, b) => (b.l === S.level) - (a.l === S.level)), i: 0, n: 0 };
  const it = dq.list[dq.i % dq.list.length];
  box.innerHTML = `<p class="muted">Escucha y escribe exactamente lo que oyes. Llevas ${dq.n} hoy.</p><div class="card excard"><div class="row center"><button class="btn big-btn" id="play">🔊 Escuchar</button><button class="btn ghost" id="slow">🐢 Lento</button></div><form id="lf"><textarea id="li" rows="2" autocapitalize="off" spellcheck="false" placeholder="Escribe lo que escuchas…"></textarea><button class="btn wide">Comprobar</button></form><div id="fb"></div></div>`;
  $("#play").onclick = () => speak(it.s); $("#slow").onclick = () => speak(it.s, 0.7);
  setTimeout(() => speak(it.s), 300);
  $("#li").onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#lf").requestSubmit(); } };
  $("#lf").onsubmit = (e) => {
    e.preventDefault(); const v = $("#li").value; if (!v.trim() || $("#nx")) return;
    const sc = similarity(it.s, v); const ok = sc >= 0.9;
    skill("listening", ok ? 1 : 0, 1); dq.n++; if (dq.n >= 5) markDaily("listening");
    if (ok) addXP(5); else addMistake({ type: "Dictado", wrong: v, right: it.s, note: "Escucha y escribe" });
    $("#fb").innerHTML = `<div class="feedback ${ok ? "good" : "bad"}"><b>${Math.round(sc * 100)}% de precisión</b><p class="big-text">${diffWords(it.s, v)}</p><p class="muted small">En rojo: palabras que faltaron o escribiste distinto.</p>${csBox(it.s, true)}</div><button class="btn wide" id="nx">Siguiente ⏎</button>`;
    $("#nx").onclick = () => { dq.i++; render(); }; $("#nx").focus();
  };
};

// ---------- LEER ----------
let rTab = "lecturas";
RENDER.leer = (m) => {
  if (sub && sub.text) return readerPage(m, sub.text);
  if (sub && sub.story) return comprehension(m, sub.story, { kind: "reading", subtitle: `${STORY_SERIES.title} · Episodio ${sub.story.ep} · ${sub.story.level}`, onExit: () => { sub = null; render(); }, onFinish: (c, n) => { S.done.story[sub.story.id] = Math.max(S.done.story[sub.story.id] || 0, c / n); skill("reading", c, n); if (extraTask().go === "leer") markDaily("extra"); addXP(c * 5); sub = null; render(); } });
  if (rTab === "historias") { m.innerHTML = `<h1>Leer</h1>${readTabs()}<div id="rbody"></div>`; bindReadTabs(m); return storiesList($("#rbody")); }
  if (rTab === "lector" && !sub) { m.innerHTML = `<h1>Leer</h1>${readTabs()}<div id="rbody"></div>`; bindReadTabs(m); return myTextsView($("#rbody"), m); }
  if (sub && sub.item) return comprehension(m, sub.item, { kind: "reading", onExit: () => { sub = null; render(); }, onFinish: (c, n) => { S.done.reading[sub.item.id] = Math.max(S.done.reading[sub.item.id] || 0, c / n); skill("reading", c, n); if (extraTask().go === "leer") markDaily("extra"); addXP(c * 5); sub = null; render(); } });
  const list = ALL_READINGS.filter((x) => S.unlocked.includes(x.level)).sort((a, b) => (b.level === S.level) - (a.level === S.level) || lvlIdx(b.level) - lvlIdx(a.level));
  m.innerHTML = `<h1>Leer</h1>${readTabs()}<p class="muted">Lee el texto completo sin traducir cada palabra; usa el glosario solo al final. Luego responde las preguntas. Puedes escuchar el texto para practicar pronunciación.</p>
  <div class="lessons">${list.map((x) => `<button class="lesson" data-i="${x.id}"><span class="num">${x.level}</span><span><b>${esc(x.title)}</b><small>~${x.text.split(/\s+/).length} palabras · ${x.q.length} preguntas${S.done.reading[x.id] !== undefined ? ` · Mejor: ${Math.round(S.done.reading[x.id] * 100)}%` : ""}</small></span><span class="st">${S.done.reading[x.id] >= 0.8 ? "✅" : ""}</span></button>`).join("")}</div>
  ${LEVELS.filter((l) => !S.unlocked.includes(l)).length ? `<p class="muted small">Más lecturas se desbloquean al subir de nivel.</p>` : ""}`;
  $$("[data-i]", m).forEach((b) => b.onclick = () => { sub = { item: ALL_READINGS.find((x) => x.id === b.dataset.i) }; render(); });
  bindReadTabs(m);
};
const readTabs = () => `<div class="tabs"><button class="tab ${rTab === "lecturas" ? "on" : ""}" data-rt="lecturas">Lecturas del curso</button><button class="tab ${rTab === "historias" ? "on" : ""}" data-rt="historias">📚 Historias</button><button class="tab ${rTab === "lector" ? "on" : ""}" data-rt="lector">Mi lector (con diccionario)</button></div>`;
function bindReadTabs(m) { $$("[data-rt]", m).forEach((b) => b.onclick = () => { rTab = b.dataset.rt; render(); }); }

// ---------- HABLAR ----------
let hTab = "conversa", hq = null;
function micButton(id) { return dictApi ? `<button class="btn big-btn" id="${id}">🎙️ Toca y habla</button>` : `<p class="muted small">🎙️ El micrófono funciona en Chrome o Edge. Aquí puedes decirlo en voz alta y escribirlo.</p>`; }
function bindMic(btnId, onText, live) {
  if (!dictApi || !$("#" + btnId)) return;
  let text = "", on = false;
  dictH.partial = ({ text: t }) => { if (live) live((text + " " + t).trim()); };
  dictH.final = ({ text: t }) => { text = (text + " " + t).trim(); if (live) live(text); };
  dictH.state = ({ state }) => { on = state === "listening"; const b = $("#" + btnId); if (b) { b.textContent = on ? "⏹️ Terminar" : "🎙️ Toca y habla"; b.classList.toggle("rec", on); } if (!on && text) { const t = text; text = ""; onText(t); } };
  $("#" + btnId).onclick = () => { if (on) { dictApi.stop().catch(() => {}); return; } text = ""; dictApi.start().catch((e) => { if (e && e.code === "not_granted") { toast("Permiso de micrófono denegado"); dictApi = null; render(); } else toast("No se pudo iniciar el micrófono"); }); };
}
RENDER.hablar = (m) => {
  if (sub && sub.rp) return roleplay(m, sub.rp);
  if (sub && sub.pron) return pronPage(m, sub.pron);
  if (sub && sub.cs) return csPage(m, sub.cs);
  if (sub && sub.retell) return retellPage(m, sub.retell, () => { sub = null; render(); });
  m.innerHTML = `<h1>Hablar</h1><div class="tabs"><button class="tab ${hTab === "conversa" ? "on" : ""}" data-t="conversa">Conversaciones guiadas</button><button class="tab ${hTab === "sonidos" ? "on" : ""}" data-t="sonidos">Sonidos</button><button class="tab ${hTab === "cs" ? "on" : ""}" data-t="cs">🔗 Connected speech</button><button class="tab ${hTab === "pron" ? "on" : ""}" data-t="pron">Shadowing</button><button class="tab ${hTab === "min" ? "on" : ""}" data-t="min">⏱️ Habla 1 minuto</button><button class="tab ${hTab === "retell" ? "on" : ""}" data-t="retell">🗣️ Retelling</button></div><div id="hbody"></div>`;
  $$("[data-t]", m).forEach((b) => b.onclick = () => { hTab = b.dataset.t; render(); });
  const box = $("#hbody");
  if (hTab === "sonidos") return pronList(box);
  if (hTab === "cs") return csList(box);
  if (hTab === "min") return speakMinute(box);
  if (hTab === "retell") return retellList(box);
  if (hTab === "conversa") {
    const list = ALL_ROLEPLAY.filter((x) => S.unlocked.includes(x.level)).sort((a, b) => (b.level === S.level) - (a.level === S.level) || lvlIdx(b.level) - lvlIdx(a.level));
    box.innerHTML = `<p class="muted">Situaciones reales: la otra persona te habla, tú respondes en voz alta (o escribiendo) siguiendo la instrucción. Luego comparas con respuestas modelo.</p><div class="lessons">${list.map((x) => `<button class="lesson" data-i="${x.id}"><span class="num">${x.level}</span><span><b>${esc(x.title)}</b><small>${esc(x.intro)}</small></span><span class="st">${S.done.roleplay[x.id] ? "✅" : ""}</span></button>`).join("")}</div>`;
    $$("[data-i]", box).forEach((b) => b.onclick = () => { sub = { rp: ALL_ROLEPLAY.find((x) => x.id === b.dataset.i), t: 0, scores: [] }; render(); });
    return;
  }
  if (!hq) hq = { list: shuffle(LEVELS.filter((l) => S.unlocked.includes(l)).flatMap((l) => SENTENCES[l].map((s) => ({ s, l })))).sort((a, b) => (b.l === S.level) - (a.l === S.level)), i: 0 };
  const it = hq.list[hq.i % hq.list.length];
  box.innerHTML = `<p class="muted"><b>Shadowing:</b> escucha, imita el ritmo y la entonación, y luego dila tú.</p><div class="card excard"><p class="big-text">${esc(it.s)}</p>${csBox(it.s, true)}<div class="row center">${speakBtn(it.s, "🔊 Normal")}<button class="icon-btn" data-speak="${esc(it.s)}" data-rate="0.7">🐢 Lento</button>${recorderHTML("shd" + hq.i)}</div>
    <div class="center">${micButton("rec")}</div><p class="muted center" id="live"></p>${dictApi ? "" : `<form id="sf" class="row"><input id="si" placeholder="Escríbela de memoria"><button class="btn">Comprobar</button></form>`}<div id="fb"></div></div><button class="btn ghost" id="nx">Otra frase →</button>`;
  const evaluate = (said) => {
    const sc = similarity(it.s, said), ok = sc >= 0.85; skill("speaking", ok ? 1 : 0, 1); if (ok) addXP(4);
    $("#fb").innerHTML = `<div class="feedback ${ok ? "good" : "bad"}"><b>${ok ? "¡Muy bien!" : "Sigue practicando"} · ${Math.round(sc * 100)}%</b><p>Se entendió: “${esc(said)}”</p><p class="big-text">${diffWords(it.s, said)}</p>${ok ? "" : `<p class="muted small">Las palabras en rojo no se reconocieron. Escúchalas lento y repite.</p>`}</div>`;
  };
  bindMic("rec", evaluate, (t) => { const l = $("#live"); if (l) l.textContent = t; });
  if ($("#sf")) $("#sf").onsubmit = (e) => { e.preventDefault(); evaluate($("#si").value); };
  bindRecorders(box);
  $("#nx").onclick = () => { hq.i++; render(); };
};
function roleplay(m, rp) {
  const st = sub, turn = rp.turns[st.t];
  if (!turn) {
    const avg = st.scores.length ? st.scores.reduce((a, b) => a + b, 0) / st.scores.length : 0;
    S.done.roleplay[rp.id] = true; skill("speaking", Math.round(avg * st.scores.length), st.scores.length); if (extraTask().go === "hablar") markDaily("extra"); addXP(15);
    m.innerHTML = `<div class="card center"><div class="big">💬</div><h2>¡Conversación completada!</h2><p>Similitud promedio con las respuestas modelo: <b>${Math.round(avg * 100)}%</b>.</p><p class="muted">No tienes que decirlo exactamente igual: lo importante es que la idea, la gramática y el tono sean correctos. Repite la conversación hasta que te salga fluida y sin mirar.</p><div class="row center"><button class="btn" id="again">Repetir</button><button class="btn ghost" id="lst">Otras conversaciones</button></div></div>`;
    $("#again").onclick = () => { sub = { rp, t: 0, scores: [] }; render(); }; $("#lst").onclick = () => { sub = null; render(); };
    return;
  }
  const r = st.res; st.said = st.said || [];
  m.innerHTML = `<div class="row between"><div><h1>${esc(rp.title)}</h1><div class="muted small">${esc(rp.intro)}</div></div><button class="btn ghost small" id="exit">Salir</button></div>
  <div class="bar"><i style="width:${(st.t / rp.turns.length) * 100}%"></i></div>
  <div class="chat">${rp.turns.slice(0, st.t).map((t, k) => `<div class="msg bot">${esc(t[0])}</div><div class="msg me">${esc(st.said[k] || "…")}</div>`).join("")}
    <div class="msg bot">${esc(turn[0])} ${speakBtn(turn[0])}${csBox(turn[0], false)}</div></div>
  <div class="card task-box"><b>Tu turno:</b> ${esc(turn[1])}</div>
  ${r ? `<div class="feedback ${r.s >= 0.6 ? "good" : "bad"}"><b>Dijiste:</b> “${esc(r.said)}”<p><b>Respuesta modelo más cercana</b> (${Math.round(r.s * 100)}%): ${esc(r.m)} ${speakBtn(r.m)}</p>${csBox(r.m, true)}<details><summary>Otras formas de decirlo</summary>${turn[2].filter((x) => x !== r.m).map((x) => `<p>${esc(x)} ${speakBtn(x)}</p>`).join("")}</details></div>
    <div class="row"><button class="btn" id="next">Continuar</button><button class="btn ghost" id="retry">Intentar de nuevo</button></div>`
  : `<div class="center">${micButton("rec")}</div><p class="muted center" id="live"></p><form id="tf" class="row"><input id="ti" placeholder="O escribe tu respuesta en inglés"><button class="btn">Enviar</button></form><button class="btn ghost small" id="help">💡 Ver una respuesta modelo</button>`}`;
  $("#exit").onclick = () => { stopSpeech(); sub = null; render(); };
  if (!r) setTimeout(() => speakLines([[1, turn[0]]]), 200);
  const answer = (said) => { const b = bestMatch(said, turn[2]); st.res = { said, s: b.s, m: b.m }; render(); };
  bindMic("rec", answer, (t) => { const l = $("#live"); if (l) l.textContent = t; });
  if ($("#tf")) $("#tf").onsubmit = (e) => { e.preventDefault(); const v = $("#ti").value.trim(); if (v) answer(v); };
  if ($("#help")) $("#help").onclick = () => { $("#help").outerHTML = `<div class="note card">${esc(turn[2][0])} ${speakBtn(turn[2][0])}<div class="small muted">Escúchala y luego dila tú sin mirar.</div></div>`; };
  if ($("#next")) $("#next").onclick = () => { st.said[st.t] = r.said; st.scores.push(r.s); st.t++; st.res = null; render(); };
  if ($("#retry")) $("#retry").onclick = () => { st.res = null; render(); };
}

// ---------- ESCRIBIR ----------
const FREE_WRITING = { id: "free", level: "Libre", title: "Escritura libre / diario", task: "Escribe lo que quieras: cómo fue tu día, una opinión, un correo real que necesites enviar, un resumen de lo que viste en inglés. Luego pásalo por el corrector.", words: "50–300", phrases: ["Today I...", "I've been thinking about...", "What surprised me was...", "To be honest,...", "Anyway,..."], check: [], model: "" };
RENDER.escribir = (m) => {
  if (sub && sub.w) return writingPage(m, sub.w);
  const list = [FREE_WRITING].concat(ALL_WRITING.filter((x) => S.unlocked.includes(x.level)).sort((a, b) => (b.level === S.level) - (a.level === S.level) || lvlIdx(b.level) - lvlIdx(a.level)));
  m.innerHTML = `<h1>Escribir</h1><p class="muted">Escribe tu texto, revisa la lista de control y luego compáralo con el texto modelo. Copiar expresiones del modelo a tu cuaderno de tarjetas es una de las mejores formas de subir de nivel.</p>
  <div class="lessons">${list.map((x) => { const d = S.done.writing[x.id]; return `<button class="lesson" data-i="${x.id}"><span class="num">${x.level}</span><span><b>${esc(x.title)}</b><small>${esc(x.words)} palabras${d && d.text ? ` · ${d.done ? "Terminado" : "Borrador guardado"}` : ""}</small></span><span class="st">${d && d.done ? "✅" : ""}</span></button>`; }).join("")}</div>`;
  $$("[data-i]", m).forEach((b) => b.onclick = () => { sub = { w: b.dataset.i === "free" ? FREE_WRITING : ALL_WRITING.find((x) => x.id === b.dataset.i) }; render(); });
};
function writingPage(m, w) {
  const d = S.done.writing[w.id] = S.done.writing[w.id] || { text: "", checks: [], done: false };
  const reveal = !!w.model && (sub.reveal || d.done);
  m.innerHTML = `<div class="row between"><h1>${esc(w.title)}</h1><button class="btn ghost small" id="back">← Volver</button></div>
  <div class="card"><p>${esc(w.task)}</p><p class="muted small">Extensión: ${esc(w.words)} palabras${w.model ? " · Nivel " + w.level : ""}</p><div class="label">Expresiones útiles (toca para insertar)</div><div class="chips">${w.phrases.map((p) => `<button class="chipbtn" data-ph="${esc(p)}">${esc(p)}</button>`).join("")}</div></div>
  <textarea id="wt" rows="12" placeholder="Write your text here…" spellcheck="false">${esc(d.text)}</textarea>
  <div class="row between"><span class="muted small" id="wc"></span><div class="row"><button class="btn ghost" id="lt">🔍 Revisar gramática y ortografía</button>${reveal || !w.model ? "" : `<button class="btn" id="fin">Terminé: comparar con el modelo</button>`}</div></div><div id="ltbox"></div>
  ${!w.model ? `<button class="btn wide" id="savefree">Guardar</button>` : ""}
  ${reveal ? `<div class="card"><h2>1. Lista de control</h2><p class="muted small">Revisa tu texto con honestidad y marca lo que cumpliste. Si algo falta, corrígelo arriba.</p>${w.check.map((c, i) => `<label class="cando"><input type="checkbox" data-ck="${i}" ${d.checks[i] ? "checked" : ""}> ${esc(c)}</label>`).join("")}</div>
    <div class="card"><h2>2. Texto modelo</h2><p class="muted small">Compara: ¿qué estructuras o palabras usa el modelo que tú no usaste? Toca una frase para escucharla.</p><div class="model">${w.model.split(/\n+/).map((p) => `<p>${p.split(/(?<=[.!?])\s+/).map((s) => `<span class="sp" data-speak="${esc(s)}">${esc(s)}</span>`).join(" ")}</p>`).join("")}</div>${csEnabled() ? `<details class="csbox"><summary>🔗 Así suena el modelo (connected speech)</summary>${w.model.split(/\n+/).flatMap((p) => p.split(/(?<=[.!?])\s+/)).filter((x) => x.split(/\s+/).length >= 3).map((x) => { const a = csAnnotate(x); return `<div class="csrow">${a.html}</div>`; }).join("")}</details>` : ""}</div>
    <div class="card"><h2>3. Guarda lo que aprendiste</h2><form id="cf" class="row"><input id="cen" placeholder="Expresión del modelo (inglés)"><input id="ces" placeholder="Significado"><button class="btn">+ Tarjeta</button></form></div>
    ${d.done ? "" : `<button class="btn wide big-btn" id="save">Guardar como terminado</button>`}` : ""}`;
  const t = $("#wt");
  const [wmin, wmax] = (w.words.match(/\d+/g) || [0, 9999]).map(Number);
  const count = () => { const n = (t.value.match(/\b[\w'-]+\b/g) || []).length; const el = $("#wc"); el.textContent = `${n} palabras · objetivo ${w.words}${n < wmin ? ` (faltan ${wmin - n})` : n > wmax * 1.15 ? " (te pasaste un poco)" : " ✓"}`; el.style.color = n >= wmin && n <= wmax * 1.15 ? "var(--green)" : ""; };
  count(); let tm; t.oninput = () => { count(); clearTimeout(tm); tm = setTimeout(() => { d.text = t.value; save(); }, 800); };
  $("#back").onclick = () => { d.text = t.value; save(); sub = null; render(); };
  $$("[data-ph]", m).forEach((b) => b.onclick = () => { const p = t.selectionStart, v = t.value; const ins = b.dataset.ph.replace(/\.\.\.$/, " "); t.value = v.slice(0, p) + ins + v.slice(t.selectionEnd); t.focus(); t.setSelectionRange(p + ins.length, p + ins.length); t.oninput(); });
  $("#lt").onclick = ltPanel(m, t, w);
  if ($("#savefree")) $("#savefree").onclick = () => { d.text = t.value; const n = (t.value.match(/\b[\w'-]+\b/g) || []).length; if (n >= 30 && !d.done) { d.done = true; skill("writing", 1, 1); if (extraTask().go === "escribir") markDaily("extra"); addXP(Math.min(20, Math.round(n / 10))); } save(); toast("Guardado"); };
  if ($("#fin")) $("#fin").onclick = () => { const n = (t.value.match(/\b[\w'-]+\b/g) || []).length; if (n < 20) { toast("Escribe al menos 20 palabras"); return; } d.text = t.value; save(); sub.reveal = true; render(); };
  $$("[data-ck]", m).forEach((c) => c.onchange = () => { d.checks[+c.dataset.ck] = c.checked; save(); });
  if ($("#cf")) $("#cf").onsubmit = (e) => { e.preventDefault(); const en = $("#cen").value.trim(), es = $("#ces").value.trim(); if (en && es) { addCustomCard(en, es, ""); $("#cen").value = ""; $("#ces").value = ""; } };
  if ($("#save")) $("#save").onclick = () => { d.text = t.value; d.done = true; const k = d.checks.filter(Boolean).length; skill("writing", k, w.check.length); if (extraTask().go === "escribir") markDaily("extra"); addXP(20); sub = null; render(); };
}

// ---------- ERRORES ----------
function addMistake(x) { if (!x.wrong || !x.right || norm(x.wrong) === norm(x.right)) return; S.mistakes.unshift({ ...x, at: Date.now() }); S.mistakes = S.mistakes.slice(0, 300); save(); }
function addCustomCard(en, es, ex, silent) {
  if (!en || !es) return;
  if (allCards().some((c) => norm(c.en) === norm(en))) { if (!silent) toast("Esa palabra ya está en tus tarjetas"); return; }
  S.custom.push({ id: "MIS-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), level: "MIS", topic: "Mías", en, es, ex: ex || "" }); vq = null; save();
  if (!silent) toast("Agregada a tus tarjetas");
}
function errorsView(m, root) {
  const gm = S.mistakes.filter((x) => x.right && x.right.split(" ").length <= 14);
  m.innerHTML = `<p class="muted">Todo lo que fallaste en gramática, exámenes y dictados. Practícalos: escribir la forma correcta de memoria es lo que los fija.</p>
  ${gm.length ? `<div class="row"><button class="btn" id="prac">✍️ Practicar mis errores (${Math.min(10, gm.length)})</button><button class="btn ghost" id="clr">Borrar lista</button></div>` : `<div class="card center"><p>Sin errores guardados todavía. ¡A practicar!</p></div>`}<div id="cb"></div>
  ${S.mistakes.length ? `<div class="list card">${S.mistakes.map((x, k) => `<div class="li"><div><span class="tag">${esc(x.type)}</span> <s>${esc(x.wrong)}</s> → <b>${esc(x.right)}</b> ${speakBtn(x.right)}<div class="muted small">${esc(x.q && x.q !== x.wrong ? x.q + " · " : "")}${esc(x.note || "")}</div></div><button class="btn ghost small" data-del="${k}" title="Quitar">✕</button></div>`).join("")}</div>` : ""}`;
  $$("[data-del]", m).forEach((b) => b.onclick = () => { S.mistakes.splice(+b.dataset.del, 1); save(); render(); });
  if ($("#clr")) $("#clr").onclick = () => confirmBox($("#cb"), "¿Borrar toda la lista de errores?", () => { S.mistakes = []; save(); render(); });
  if ($("#prac")) $("#prac").onclick = () => {
    const sel = gm.slice(0, 10);
    const items = sel.map((x) => x.q && x.q.includes("___") ? ["fill", x.q, [x.right], x.note] : x.q && x.type === "Gramática" && x.q !== x.right ? ["tr", x.q, [x.right], x.note] : ["tr", `Escribe la forma correcta (antes pusiste: “${x.wrong}”)`, [x.right], x.note]);
    exerciseRunner(root, items, { title: "Practicar mis errores", onExit: () => render(), onFinish: (c, n, wrongs) => {
      const still = new Set(wrongs.map((w) => w.q));
      const fixed = items.map((it, k) => still.has(it[1]) ? null : sel[k]).filter(Boolean);
      S.mistakes = S.mistakes.filter((x) => !fixed.includes(x)); skill("grammar", c, n); addXP(c * 3);
      root.innerHTML = `<div class="card center"><h2>${c} de ${n} corregidos</h2><p>Quité de la lista los ${fixed.length} que ya respondiste bien.</p><button class="btn" id="ok">Continuar</button></div>`; $("#ok").onclick = () => render();
    } });
  };
}

// ---------- AJUSTES ----------
RENDER.ajustes = (m) => {
  const c = Supa.cfg(), s = Supa.session();
  const code = (() => { try { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); } catch (e) { return ""; } })();
  m.innerHTML = `<h1>Ajustes</h1>
  <div class="card"><h2>☁️ Sincronización</h2>
    ${Sync.mode === "claude" ? `<p class="note card">Dentro de Claude tu progreso se guarda en tu cuenta automáticamente.</p>` : ""}
    <p class="muted small">Para usar la app en varios dispositivos (por ejemplo desde GitHub Pages), conecta tu base de datos de Supabase. Las instrucciones están en el README del proyecto.</p>
    <label class="label">URL del proyecto</label><input id="su" placeholder="https://xxxx.supabase.co" value="${esc(c.url)}">
    <label class="label">Clave pública (anon key)</label><input id="sk" placeholder="eyJhbGciOi..." value="${esc(c.key)}">
    ${s ? `<p>✅ Sesión iniciada como <b>${esc(s.email || "")}</b></p><div class="row"><button class="btn" id="snow">Sincronizar ahora</button><button class="btn ghost" id="sout">Cerrar sesión</button></div>`
    : `<label class="label">Tu correo y contraseña</label><div class="row"><input id="se" type="email" placeholder="correo@ejemplo.com" autocomplete="username"><input id="sp" type="password" placeholder="Contraseña" autocomplete="current-password"></div><div class="row"><button class="btn" id="sin">Iniciar sesión</button><button class="btn ghost" id="sup">Crear cuenta</button></div>`}
    <p class="small" id="sres">${esc(Sync.text || "")}</p></div>
  ${voiceSettingsHTML()}
  <div class="card"><h2>🎓 Estudio</h2>
    <label class="label">Velocidad de la voz: <b id="rv">${S.settings.rate}</b></label><input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${S.settings.rate}">
    <label class="label">Tarjetas nuevas por día</label><select id="npd">${[5, 10, 15, 20, 30].map((n) => `<option ${S.settings.newPerDay === n ? "selected" : ""}>${n}</option>`).join("")}</select>
    <label class="label">Nivel de trabajo</label><select id="lvl">${S.unlocked.map((l) => `<option ${l === S.level ? "selected" : ""}>${l}</option>`).join("")}</select>
    <p class="muted small">Puedes bajar a un nivel ya desbloqueado si quieres reforzarlo.</p>
    <label class="cando"><input type="checkbox" id="pronshow" ${S.settings.pronShow === false ? "" : "checked"}> <span>Mostrar <b>cómo se pronuncia</b> cada palabra (a la española, con la sílaba fuerte en MAYÚSCULAS)</span></label>
    <label class="cando"><input type="checkbox" id="ipashow" ${S.settings.ipaShow === false ? "" : "checked"}> <span>Incluir la fonética internacional (IPA)</span></label>
    <label class="cando"><input type="checkbox" id="picsshow" ${S.settings.picsShow === false ? "" : "checked"}> <span>Mostrar <b>imágenes</b> junto a las palabras</span></label>
    <label class="label">Tipo de imagen</label><select id="picstyle"><option value="aras" ${S.settings.picStyle !== "emoji" ? "selected" : ""}>Pictogramas ARASAAC (recomendado)</option><option value="emoji" ${S.settings.picStyle === "emoji" ? "selected" : ""}>Emojis</option></select>
    <p class="muted small">${ARAS_CREDIT} Se guardan en el celular la primera vez que aparecen; luego funcionan sin internet. Si un pictograma no carga, se muestra el emoji.</p>
    <label class="cando"><input type="checkbox" id="photos" ${S.settings.photos === false ? "" : "checked"}> <span>Mostrar <b>fotos reales</b> de objetos y lugares (Wikipedia, necesita internet)</span></label>
    <label class="cando"><input type="checkbox" id="csshow" ${S.settings.csShow === false ? "" : "checked"}> <span>Mostrar <b>🔗 Así suena</b> (connected speech) debajo de las frases</span></label>
    <label class="cando"><input type="checkbox" id="csopen" ${S.settings.csOpen === false ? "" : "checked"}> <span>Abrirlo automáticamente en dictados, shadowing y respuestas modelo</span></label>
    <label class="label">Retención objetivo de las tarjetas</label><select id="ret">${[[0.85, "85% · menos repasos"], [0.9, "90% · recomendado"], [0.95, "95% · más repasos, recuerdas más"]].map(([v, l]) => `<option value="${v}" ${S.settings.retention === v ? "selected" : ""}>${l}</option>`).join("")}</select>
    <button class="btn ghost small" id="redo">Repetir la prueba de ubicación</button></div>
  <div class="card"><h2>📚 Diccionario y traducción</h2><p class="muted small">El lector usa servicios gratuitos: dictionaryapi.dev (definiciones y audio) y MyMemory (traducción, 5.000 caracteres al día). Si escribes tu correo, MyMemory sube el límite a 50.000 al día (no requiere registro).</p><input id="mme" type="email" placeholder="Tu correo (opcional)" value="${esc(S.settings.mmEmail || "")}"></div>
  <div class="card"><h2>💾 Respaldo manual</h2><p class="muted small">Copia este código para mover tu progreso a otro dispositivo sin base de datos.</p>
    <textarea id="bk" rows="3" readonly>${esc(code)}</textarea><button class="btn ghost small" id="copy">Copiar</button>
    <textarea id="rs" rows="2" placeholder="Pega aquí un código de respaldo"></textarea><button class="btn small" id="restore">Restaurar</button> <span id="rres" class="small"></span></div>
  <div class="card"><h2>⚠️ Zona peligrosa</h2><button class="btn red small" id="reset">Borrar todo mi progreso</button><div id="rb"></div></div>`;
  const keep = () => Supa.setCfg($("#su").value.trim(), $("#sk").value.trim());
  $("#su").onchange = keep; $("#sk").onchange = keep;
  const auth = async (fn) => {
    keep(); const e = $("#se").value.trim(), p = $("#sp").value; if (!e || !p) { $("#sres").textContent = "Escribe correo y contraseña."; return; }
    if (!Supa.cfg().url || !Supa.cfg().key) { $("#sres").textContent = "Primero pega la URL y la clave pública."; return; }
    $("#sres").textContent = "Conectando…";
    try { const r = await fn(e, p); if (r === "confirm") { $("#sres").textContent = "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión."; return; } Sync.mode = "supabase"; await Sync.pull(); Sync.status("Progreso sincronizado con tu base de datos"); render(); }
    catch (err) { $("#sres").textContent = "❌ " + err.message; }
  };
  if ($("#sin")) $("#sin").onclick = () => auth((e, p) => Supa.login(e, p));
  if ($("#sup")) $("#sup").onclick = () => auth((e, p) => Supa.signup(e, p));
  if ($("#snow")) $("#snow").onclick = async () => { $("#sres").textContent = "Sincronizando…"; try { Sync.mode = "supabase"; await Sync.pull(); await Sync.push(); $("#sres").textContent = "✅ Sincronizado"; } catch (e) { $("#sres").textContent = "❌ " + e.message; } };
  if ($("#sout")) $("#sout").onclick = () => { Supa.logout(); Sync.mode = "local"; Sync.status("Guardado solo en este navegador"); render(); };
  $("#rate").oninput = (e) => { S.settings.rate = +e.target.value; $("#rv").textContent = S.settings.rate; };
  $("#rate").onchange = () => { save(); speak("This is how fast I will speak."); };
  bindVoiceSettings(m);
  $("#npd").onchange = (e) => { S.settings.newPerDay = +e.target.value; vq = null; save(); };
  $("#lvl").onchange = (e) => { S.level = e.target.value; gLevel = null; vq = null; dq = null; hq = null; save(); renderTop(); toast("Nivel de trabajo: " + S.level); };
  $("#redo").onclick = () => { S.placementDone = false; save(); go("inicio"); };
  $("#ret").onchange = (e) => { S.settings.retention = +e.target.value; save(); };
  $("#csshow").onchange = (e) => { S.settings.csShow = e.target.checked; save(); };
  $("#picstyle").onchange = (e) => { S.settings.picStyle = e.target.value; save(); };
  [["pronshow", "pronShow"], ["ipashow", "ipaShow"], ["picsshow", "picsShow"], ["photos", "photos"]].forEach(([id, k]) => { $("#" + id).onchange = (e) => { S.settings[k] = e.target.checked; save(); }; });
  $("#csopen").onchange = (e) => { S.settings.csOpen = e.target.checked; save(); };
  $("#mme").onchange = (e) => { S.settings.mmEmail = e.target.value.trim(); save(); };
  $("#copy").onclick = () => { navigator.clipboard.writeText($("#bk").value).then(() => toast("Copiado"), () => { $("#bk").select(); toast("Selecciona y copia el texto"); }); };
  $("#restore").onclick = () => { try { const d = JSON.parse(decodeURIComponent(escape(atob($("#rs").value.trim())))); if (!d || !d.level || !d.cards) throw 0; S = migrate(d); vq = null; save(); $("#rres").textContent = "✅ Restaurado"; renderTop(); } catch (e) { $("#rres").textContent = "❌ Código no válido"; } };
  $("#reset").onclick = () => confirmBox($("#rb"), "Esto borra tarjetas, lecciones, exámenes y estadísticas. ¿Seguro?", () => { const set = S.settings; S = defaultState(); S.settings = set; vq = dq = hq = null; save(); go("inicio"); });
};

