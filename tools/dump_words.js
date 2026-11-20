// Vuelca las palabras y frases del curso (para generar pronunciación e imágenes)
const fs = require("fs"), path = require("path");
const src = path.join(__dirname, "..", "src");
const files = ["content.js", ...fs.readdirSync(path.join(src, "levels")).sort().map((f) => "levels/" + f), ...fs.readdirSync(path.join(src, "extras")).sort().filter((f) => !/^(phon|pics)\.js$/.test(f)).map((f) => "extras/" + f)];
const code = files.map((f) => fs.readFileSync(path.join(src, f), "utf8")).join("\n");
eval(code + `
const items = [], texts = [];
LEVELS.forEach((lv) => VOCAB[lv].split("\\n").forEach((line) => { if (!line.includes("|")) return; const [en, es, ex] = line.split("|").map((x) => (x || "").trim()); items.push({ en, es, k: "vocab", lv }); texts.push(ex); }));
Object.values(IRREGULAR).forEach((b) => b.trim().split("\\n").forEach((line) => { const [a, p, pp, es] = line.split("|").map((x) => x.trim()); [a, ...p.split("/"), ...pp.split("/")].forEach((w) => items.push({ en: w, es, k: "irr" })); }));
DEV.vocab.split("\\n").forEach((line) => { if (!line.includes("|")) return; const [en, es, ex] = line.split("|").map((x) => (x || "").trim()); items.push({ en, es, k: "dev" }); texts.push(ex); });
CHUNKS.forEach((g) => g.items.forEach(([en, es, ex]) => { items.push({ en, es, k: "chunk" }); texts.push(ex); }));
LEVELS.forEach((lv) => (READINGS[lv] || []).forEach((r) => { (r.gloss || []).forEach(([en, es]) => items.push({ en, es, k: "gloss" })); texts.push(r.text); }));
STORIES.forEach((s) => { s.gloss.forEach(([en, es]) => items.push({ en, es, k: "gloss" })); texts.push(s.text); });
DEV.readings.forEach((r) => texts.push(r.text));
LEVELS.forEach((lv) => (LISTENING[lv] || []).forEach((d) => d.lines.forEach(([, t]) => texts.push(t))));
LEVELS.forEach((lv) => SENTENCES[lv].forEach((s) => texts.push(s)));
process.stdout.write(JSON.stringify({ items, texts }));
`);
