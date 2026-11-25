// Extrae los textos del curso que se convierten en audio de alta calidad.
// Uso: node tools/audio_texts.js [--all] > audio/texts.json
//   Sin --all: palabras, frases, diálogos, conversaciones, verbos irregulares y pronunciación.
//   Con --all: además ejemplos del vocabulario, ejemplos de las lecciones, lecturas y textos modelo.
const fs = require("fs"), path = require("path");
const src = path.join(__dirname, "..", "src");
const files = ["content.js", ...fs.readdirSync(path.join(src, "levels")).sort().map((f) => "levels/" + f), ...fs.readdirSync(path.join(src, "extras")).sort().map((f) => "extras/" + f)];
const code = files.map((f) => fs.readFileSync(path.join(src, f), "utf8")).join("\n");
const all = process.argv.includes("--all");
const out = new Map();
const add = (v, t, cat) => { t = String(t || "").trim(); if (!t || t.length > 4000) return; const k = v + "|" + t; if (!out.has(k)) out.set(k, { v, t, cat }); };
eval(code + `
LEVELS.forEach((lv) => VOCAB[lv].split("\\n").forEach((line) => { if (!line.includes("|")) return; const [en, es, ex] = line.split("|").map((x) => (x || "").trim()); add("A", en, "word"); if (${all}) add("A", ex, "example"); }));
Object.values(IRREGULAR).forEach((block) => block.trim().split("\\n").forEach((line) => { const [b, p, pp] = line.split("|").map((x) => x.trim()); add("A", b, "word"); add("A", b + ", " + p.split("/")[0] + ", " + pp.split("/")[0], "irregular"); [p, pp].forEach((f) => add("A", f.split("/")[0].trim(), "word")); }));
LEVELS.forEach((lv) => SENTENCES[lv].forEach((s) => add("A", s, "sentence")));
LEVELS.forEach((lv) => (LISTENING[lv] || []).forEach((d) => d.lines.forEach(([sp, t]) => add(sp === "A" ? "A" : sp === "B" ? "B" : "C", t, "dialogue"))));
LEVELS.forEach((lv) => (ROLEPLAY[lv] || []).forEach((r) => r.turns.forEach(([p, task, models]) => { add("B", p, "roleplay"); models.forEach((x) => add("A", x, "model")); })));
// Inglés para desarrolladores y connected speech
DEV.vocab.split("\\n").forEach((line) => { if (!line.includes("|")) return; const [en, es, ex] = line.split("|").map((x) => (x || "").trim()); add("A", en, "dev"); add("A", ex, "dev"); });
DEV.lessons.forEach((l) => { l.phrases.forEach(([en]) => add("A", en, "dev")); (l.explain.match(/<i>([^<]+)<\\/i>/g) || []).forEach((m) => add("A", m.replace(/<\\/?i>/g, ""), "dev")); l.ex.forEach((ex) => { const t = ex[0], answer = t === "mc" ? ex[2][ex[3]] : t === "ord" ? ex[2] : ex[2][0]; add("A", t === "fill" ? ex[1].replace(/_{2,}/, answer).replace(/\\s*\\([^)]*\\)/g, "").trim() : t === "mc" ? (ex[1].includes("___") ? ex[1].replace(/_{2,}/, answer) : answer) : answer, "dev"); }); });
TENSES.forEach((t) => { t.examples.forEach((x) => add("A", x, "example")); [t.form.aff[1], t.form.neg[1], t.form.q[1], t.mistake[1]].forEach((x) => x.split(" · ").forEach((y) => add("A", y, "example"))); });
SCENES.forEach((sc) => Object.values(sc.nodes).forEach((n) => { add("B", n.npc, "roleplay"); (n.opts || []).forEach((o) => o.say.forEach((x) => add("A", x, "model"))); }));
DEV.roleplays.forEach((r) => r.turns.forEach(([p, task, models]) => { add("B", p, "dev"); models.forEach((x) => add("A", x, "dev")); }));
DEV.listening.forEach((d) => d.lines.forEach(([sp, t]) => add(sp === "A" ? "A" : sp === "B" ? "B" : "C", t, "dev")));
DEV.interview.forEach((x) => { add("A", x.q, "dev"); add("A", x.model, "dev"); });
DEV.pron.forEach(([term, say]) => add("A", say, "dev"));
if (${all}) {
  DEV.readings.forEach((r) => add("A", r.text, "reading"));
  DEV.writing.forEach((w) => w.model.split(/\\n+/).forEach((p) => p.split(/(?<=[.!?])\\s+/).forEach((s) => add("A", s, "model"))));
}
// Chunks, historias graduadas y temas para hablar
CHUNKS.forEach((g) => { g.items.forEach(([en, es, ex]) => { add("A", en, "chunk"); add("A", ex, "chunk"); }); g.drills.forEach((d) => { if (d[0] === "sub") add("A", d[3][0], "chunk"); else if (d[0] === "blocks") add("A", d[2].join(" "), "chunk"); else if (d[0] === "mc" && d[1].includes("___")) add("A", d[1].replace(/_{2,}/, d[2][d[3]]), "chunk"); }); });
STORIES.forEach((s) => { add("A", s.text, "story"); s.gloss.forEach(([en]) => add("A", en, "word")); });
Object.values(SPEAK_PROMPTS).forEach((l) => l.forEach(([t]) => add("A", t, "prompt")));
CS_UNITS.forEach((u) => { u.examples.forEach(([w]) => add("A", w, "cs")); u.practice.forEach((p) => add("A", p, "cs")); (u.explain.match(/<i>([^<]+)<\\/i>/g) || []).forEach((m) => add("A", m.replace(/<\\/?i>/g, ""), "cs")); });
PRON.forEach((u) => { (u.pairs || []).forEach((p) => p.forEach((w) => add("A", w, "pron"))); (u.items || []).forEach((it) => add("A", String(it[0]).replace(/\\s*\\(.*\\)/, ""), "pron")); (u.lines || []).forEach((l) => add("A", l, "pron")); });
if (${all}) {
  LEVELS.forEach((lv) => (READINGS[lv] || []).forEach((r) => add("A", r.text, "reading")));
  LEVELS.forEach((lv) => LESSONS[lv].forEach((l) => (l.explain.match(/<i>([^<]+)<\\/i>/g) || []).forEach((m) => add("A", m.replace(/<\\/?i>/g, ""), "lesson"))));
  LEVELS.forEach((lv) => (WRITING[lv] || []).forEach((w) => w.model.split(/\\n+/).forEach((p) => p.split(/(?<=[.!?])\\s+/).forEach((s) => add("A", s, "model")))));
  LEVELS.forEach((lv) => (READINGS[lv] || []).forEach((r) => (r.gloss || []).forEach(([en]) => add("A", en, "word"))));
  LEVELS.forEach((lv) => LESSONS[lv].forEach((l) => l.ex.forEach((ex) => {
    const t = ex[0], answer = t === "mc" ? ex[2][ex[3]] : t === "ord" ? ex[2] : ex[2][0];
    const full = t === "fill" ? ex[1].replace(/_{2,}/, answer).replace(/\\s*\\([^)]*\\)/g, "").trim() : t === "mc" ? (ex[1].includes("___") ? ex[1].replace(/_{2,}/, answer) : answer) : answer;
    add("A", full, "exercise");
  })));
  Object.values(IRREGULAR).forEach((block) => block.trim().split("\\n").forEach((line) => { const [b, p, pp] = line.split("|").map((x) => x.trim()); add("A", b + " – " + p.split("/")[0] + " – " + pp.split("/")[0], "irregular"); }));
}
`);
process.stdout.write(JSON.stringify([...out.values()]));
