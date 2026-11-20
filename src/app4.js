// ===== PRONUNCIACIÓN ESCRITA E IMÁGENES EN TODA LA APP =====

// ---------- Pronunciación ----------
const PHON_TIPS = {
  silent_k: "La «k» inicial es muda (knife = <i>naif</i>).", silent_w: "La «w» inicial es muda (write = <i>rait</i>).", silent_b: "La «b» no suena (climb = <i>klaim</i>).",
  silent_p: "La «p» inicial es muda.", silent_h: "La «h» es muda en esta palabra.", silent_t: "La «t» no suena (listen = <i>lisen</i>).", silent_l: "La «l» no suena (walk = <i>uok</i>).",
  silent_gh: "La «gh» no suena.", silent_s: "La «s» no suena (island = <i>ailend</i>).", silent_d: "La primera «d» no suena.", silent_g: "La «g» no suena.",
  ed_t: "La terminación -ed suena como «t», sin agregar sílaba.", ed_d: "La terminación -ed suena como «d», sin agregar sílaba.", ed_id: "Aquí la -ed sí se dice como sílaba aparte: «id».",
  s_cons: "No digas «e» al principio: es <i>school</i>, no <i>eschool</i>.",
  th: "«th» (θ): la lengua entre los dientes y sopla, como la «z» de España.", dh: "«th» suave (ð): la lengua entre los dientes, vibrando, como la «d» de «cada».",
  v: "La «v» se dice con los dientes de arriba sobre el labio de abajo; no es «b».", z: "La «z» zumba como una abeja (zzz); no es «s».",
  ih: "La «i» es corta y relajada, casi una «e» (ship, sit).", iy: "La «i» es larga y tensa (sheep, seat): estira los labios.", ae: "La «a» (æ) es abierta, entre «a» y «e»: abre la boca y sonríe.",
  schwa: "Las vocales sin acento se reducen a un sonido débil (ə), como una «e» muy corta.", sh: "«sh» (ʃ): como cuando pides silencio, ¡shh!", jh: "«j/g» (dʒ): como «ll» fuerte, «yo» bien pronunciado.",
  zh: "«ʒ»: como «sh» pero con vibración (vision, usually).", h: "La «h» se aspira suave, como una «j» muy suave.", r: "La «r» no vibra: enrosca la lengua hacia atrás sin tocar el paladar.",
  ng: "«ng» (ŋ): la «g» final casi no se oye; el sonido sale por la nariz.", final: "Pronuncia las consonantes finales, no las cortes.",
};
const syl = (c) => c.startsWith("syl") ? `Se dice en ${c.slice(3)} sílaba${c.slice(3) === "1" ? "" : "s"}, menos de las que parece por la escritura.` : "";
const phonKey = (w) => w.toLowerCase().replace(/[’‘]/g, "'").replace(/^'+|'+$/g, "");
function phonFor(text) {
  const clean = String(text || "").replace(/\(.*?\)|\.\.\.|…|\+.*$/g, " ").replace(/\//g, " ").trim();
  const ws = clean.match(/[A-Za-z]+(?:['’][a-z]+)?/g);
  if (!ws || ws.length > 7) return null;
  const ps = ws.map((w) => PHON[phonKey(w)]);
  if (ps.some((p) => !p)) return null;
  const tips = [];
  ps.forEach((p) => p[2].split(",").filter(Boolean).forEach((c) => { if (!tips.includes(c)) tips.push(c); }));
  const prio = (c) => c.startsWith("silent") || c.startsWith("syl") || c.startsWith("ed_") || c === "s_cons" ? 0 : 1;
  tips.sort((a, b) => prio(a) - prio(b));
  return { ipa: ps.map((p) => p[0]).join(" "), es: ps.map((p) => p[1]).join(" "), tips: tips.slice(0, ws.length > 1 ? 2 : 3), one: ws.length === 1 };
}
const tipText = (c) => PHON_TIPS[c] || syl(c);
function pronHTML(text, o = {}) {
  if (S.settings.pronShow === false) return "";
  const p = phonFor(text); if (!p) return "";
  const ipa = S.settings.ipaShow !== false;
  return `<div class="pron ${o.big ? "big" : ""}">${ipa ? `<span class="ipa">/${esc(p.ipa)}/</span>` : ""}${ipa ? " · " : ""}<span class="resp" title="Pronunciación a la española. MAYÚSCULAS = sílaba fuerte">${esc(p.es)}</span>${o.tips && p.tips.length ? `<ul class="ptips">${p.tips.map((c) => `<li>${tipText(c)}</li>`).join("")}</ul>` : ""}</div>`;
}

// ---------- Imágenes ----------
function picFor(text) {
  if (S.settings.picsShow === false) return "";
  const k = String(text || "").toLowerCase().trim();
  return PICS[k] || (globalThis.PIC_VISUAL || {})[k] || PICS[k.replace(/\s*\(.*?\)/g, "")] || "";
}
// Fotos (Pixabay) para lo concreto y las acciones; imágenes 3D (Fluent) para todo lo demás; emoji si nada carga.
const PHOTOS = typeof PX_PHOTOS !== "undefined" ? PX_PHOTOS : {};
const photoKey = (text) => { const k = String(text || "").toLowerCase().trim(); return PHOTOS[k] ? k : PHOTOS[k.replace(/^to /, "")] ? k.replace(/^to /, "") : ""; };
const flSeg = typeof Intl !== "undefined" && Intl.Segmenter ? new Intl.Segmenter("es", { granularity: "grapheme" }) : null;
const graphemes = (s) => flSeg ? [...flSeg.segment(s)].map((x) => x.segment) : [...s];
function fl3dHTML(emo, cls) {
  const gs = graphemes(emo).filter((g) => g.trim());
  if (!gs.length) return "";
  return `<span class="fl3d ${cls}" aria-hidden="true">${gs.map((g) => FL3D[g] ? `<img src="img/fl/${FL3D[g]}.webp" alt="" loading="lazy" data-emo="${esc(g)}">` : `<i>${esc(g)}</i>`).join("")}</span>`;
}
function picHTML(text, cls = "") {
  if (S.settings.picsShow === false) return "";
  const style = S.settings.picStyle || "photo", emo = picFor(text);
  const pk = style === "photo" ? photoKey(text) : "";
  if (pk) return `<img class="pxphoto ${cls}" src="img/px/${PHOTOS[pk][0]}.webp" alt="${esc(text)}" loading="lazy" data-emo="${esc(emo)}">`;
  if (!emo) return "";
  if (style === "emoji") return `<span class="pic ${cls}" aria-hidden="true">${emo}</span>`;
  return fl3dHTML(emo, cls);
}
document.addEventListener("error", (e) => {
  const t = e.target; if (!t || t.tagName !== "IMG" || !t.isConnected) return;
  if (t.parentElement && t.parentElement.classList.contains("fl3d")) { const i = document.createElement("i"); i.textContent = t.dataset.emo || ""; t.replaceWith(i); return; }
  if (t.classList.contains("pxphoto")) { const cls = [...t.classList].filter((c) => c !== "pxphoto").join(" "); const emo = t.dataset.emo || ""; if (!emo) { t.remove(); return; } const w = document.createElement("span"); w.innerHTML = fl3dHTML(emo, cls); t.replaceWith(w.firstChild || ""); }
}, true);
const hasPic = (text) => S.settings.picsShow !== false && !!(photoKey(text) || picFor(text));


// ---------- Guía: cómo leer la pronunciación ----------
const pronGuide = () => `<details class="card pguide"><summary><b>🔤 Cómo leer la pronunciación</b></summary>
  <p>Cada palabra muestra dos cosas: la <b>fonética internacional</b> (IPA, entre barras, la que usan los diccionarios) y la <b>pronunciación a la española</b>, escrita con letras que ya sabes leer. La sílaba en <b>MAYÚSCULAS</b> es la que lleva la fuerza.</p>
  <div class="list">${[["comfortable", "3 sílabas, no 4"], ["island", "s muda"], ["thought", "th con la lengua entre los dientes"], ["walked", "-ed suena «t»"], ["vegetable", "v con dientes y labio"]].map(([w, n]) => `<div class="li"><div><b>${picHTML(w)} ${w}</b> <span class="muted small">— ${n}</span>${pronHTML(w)}</div>${speakBtn(w)}</div>`).join("")}</div>
  <h3>Lo que significan las letras «a la española»</h3>
  <ul class="small"><li><b>ii</b> = i larga (sheep = <i>shiip</i>); <b>i</b> = i corta y relajada (ship = <i>ship</i>).</li><li><b>uu</b> = u larga (food = <i>fuud</i>).</li><li><b>e</b> en sílabas débiles = la vocal neutra ə, muy corta.</li><li><b>z</b> = th como la z de España (think = <i>zink</i>); la <b>d</b> de <i>the</i> es suave.</li><li><b>s</b> puede ser una z que zumba: revisa el consejo de cada palabra.</li><li><b>sh</b> = como pedir silencio; <b>y</b> = la j de <i>job</i> (dʒ), como «yo» fuerte.</li><li><b>j</b> = h aspirada suave (house = <i>jaus</i>).</li><li><b>r</b> = r inglesa: no vibra.</li></ul>
  <h3>Símbolos IPA más útiles</h3>
  <div class="ipagrid">${[["i", "sheep"], ["ɪ", "ship"], ["æ", "cat"], ["ʌ", "cup"], ["ɑ", "hot"], ["ɔ", "thought"], ["ʊ", "book"], ["u", "food"], ["ə", "about"], ["ɝ", "bird"], ["eɪ", "day"], ["aɪ", "my"], ["oʊ", "go"], ["aʊ", "now"], ["θ", "think"], ["ð", "this"], ["ʃ", "she"], ["ʒ", "vision"], ["tʃ", "chair"], ["dʒ", "job"], ["ŋ", "sing"], ["j", "yes"], ["ˈ", "acento fuerte"]].map(([s, w]) => `<span><b>${s}</b> ${w}</span>`).join("")}</div>
  <p class="small muted">Fotos de Pixabay e imágenes 3D de Microsoft Fluent Emoji. Pronunciación estadounidense, según el diccionario CMU. ${S && S.settings ? "Puedes ocultar la IPA o todo esto en Ajustes." : ""}</p></details>`;

// ---------- Quiz con imágenes ----------
function visualPool() {
  const levelOKv = (c) => c.level === "DEV" || (LEVELS.includes(c.level) && lvlIdx(c.level) <= lvlIdx(S.level));
  return allCards().filter((c) => !c.irr && hasPic(c.en) && levelOKv(c));
}
function visualQuiz(m, onExit) {
  const pool = visualPool();
  if (pool.length < 8) { toast("Todavía no hay suficientes palabras con imagen en tu nivel"); return; }
  const concrete = pool.filter((c) => photoKey(c.en));
  const base = concrete.length >= 12 ? concrete : pool;
  const picks = shuffle(base.slice()).filter((x, i, arr) => arr.findIndex((y) => y.en === x.en) === i).slice(0, 12);
  const items = picks.map((w, k) => {
    const others = shuffle(base.filter((x) => x.en !== w.en && x.es !== w.es)).slice(0, 3), opts = shuffle([w, ...others]);
    let ex; if (k % 2) { ex = ["mc", "¿Qué palabra es?", opts.map((x) => x.en), opts.indexOf(w), `${w.en} = ${w.es}`]; ex.pic = picHTML(w.en, "quiz"); return ex; }
    ex = ["mc", `¿Qué imagen corresponde a «${w.en}»?`, opts.map((x) => x.es), opts.indexOf(w), `${w.en} = ${w.es}`]; ex.optHTML = opts.map((x) => picHTML(x.en, "opt")); return ex;
  });
  exerciseRunner(m, items, { title: "🖼️ Quiz con imágenes", subtitle: "Asocia la palabra con su imagen", onExit, onFinish: (c, n) => {
    skill("vocab", c, n); addXP(c * 2);
    m.innerHTML = `<div class="card center"><div class="big">🖼️</div><h2>${c} de ${n}</h2><p class="muted">Asociar cada palabra con una imagen la fija en la memoria mucho mejor que una traducción sola.</p><div class="row center"><button class="btn" id="again">Otra ronda</button><button class="btn ghost" id="back">Volver</button></div></div>`;
    $("#again").onclick = () => visualQuiz(m, onExit); $("#back").onclick = onExit;
  } });
}
