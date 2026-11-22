// ===== LOS 12 TIEMPOS VERBALES: VISTA, LÍNEAS DE TIEMPO Y PRÁCTICA =====
const TENSE_LESSONS = { ps: ["Presente simple vs. continuo"], pc: ["Presente simple vs. continuo"], pp: ["Presente perfecto (introducción)", "Presente perfecto vs. pasado simple"], ppc: ["Presente perfecto continuo"], pas: ["Pasado simple", "Presente perfecto vs. pasado simple"], pasc: ["Pasado continuo"], pap: ["Pasado perfecto (had + participio)"], papc: ["Tiempos narrativos avanzados"], fs: ["Futuro: going to vs. will"], fc: ["Futuro continuo y perfecto"], fp: ["Futuro continuo y perfecto"], fpc: ["Futuro perfecto continuo"] };
const lessonByTitle = (t) => ALL_LESSONS.find((l) => l.title === t);

// Línea de tiempo en SVG
function tlSVG(tl, big) {
  const W = 320, H = big ? 120 : 64, Y = big ? 70 : 38, X = (p) => 12 + (p / 100) * (W - 24);
  const parts = [];
  parts.push(`<line x1="8" y1="${Y}" x2="${W - 8}" y2="${Y}" class="tl-axis"/><polygon points="${W - 8},${Y - 5} ${W},${Y} ${W - 8},${Y + 5}" class="tl-head"/>`);
  parts.push(`<line x1="${X(50)}" y1="${Y - (big ? 26 : 16)}" x2="${X(50)}" y2="${Y + (big ? 26 : 16)}" class="tl-now"/>`);
  if (big) parts.push(`<text x="${X(50)}" y="${Y + 44}" class="tl-lbl now">ahora</text><text x="${X(8)}" y="${Y + 44}" class="tl-lbl">pasado</text><text x="${X(92)}" y="${Y + 44}" class="tl-lbl">futuro</text>`);
  if (tl.ref !== 50) parts.push(`<line x1="${X(tl.ref)}" y1="${Y - (big ? 22 : 14)}" x2="${X(tl.ref)}" y2="${Y + (big ? 22 : 14)}" class="tl-ref"/>${big ? `<text x="${X(tl.ref)}" y="${Y - 28}" class="tl-lbl ref">${esc(tl.refLabel)}</text>` : ""}`);
  tl.marks.forEach((mk) => {
    if (mk[0] === "x") { const x = X(mk[1]), s = big ? 7 : 5; parts.push(`<path d="M${x - s} ${Y - s} L${x + s} ${Y + s} M${x + s} ${Y - s} L${x - s} ${Y + s}" class="tl-x"/>`); }
    if (mk[0] === "bar") { const a = X(mk[1]), b = X(mk[2]), amp = big ? 5 : 3.5, step = big ? 10 : 7; let d = `M${a} ${Y}`; for (let x = a, k = 0; x < b; x += step / 2, k++) d += ` L${Math.min(b, x + step / 2)} ${Y + (k % 2 ? amp : -amp)}`; parts.push(`<path d="${d}" class="tl-bar"/>`); }
    if (mk[0] === "arr") { const a = X(mk[1]), b = X(mk[2]), up = big ? 22 : 13; parts.push(`<path d="M${a} ${Y - 4} Q${(a + b) / 2} ${Y - up - 8} ${b - 2} ${Y - 6}" class="tl-arr"/><polygon points="${b - 2},${Y - 6} ${b - 9},${Y - 9} ${b - 6},${Y - 1}" class="tl-arrh"/>`); }
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="tl ${big ? "big" : ""}" role="img" aria-label="${esc(tl.note)}">${parts.join("")}</svg>`;
}

let tenseBest = {};
function tensesPage(m) {
  const grid = ["simple", "continuous", "perfect", "perfect continuous"];
  const cols = [["past", "Pasado"], ["present", "Presente"], ["future", "Futuro"]];
  const aspectEs = { simple: "Simple", continuous: "Continuo", perfect: "Perfecto", "perfect continuous": "Perfecto continuo" };
  const best = S.tenseBest || {};
  m.innerHTML = `<div class="row between"><h1>🕒 Los 12 tiempos verbales</h1><button class="btn ghost small" id="back">← Volver</button></div>
  <div class="card explain"><p>En inglés hay <b>3 momentos</b> (pasado, presente y futuro) y <b>4 aspectos</b>: <b>simple</b> (el hecho), <b>continuo</b> (en progreso: be + -ing), <b>perfecto</b> (antes de un momento: have + participio) y <b>perfecto continuo</b> (duración hasta un momento: have been + -ing). 3 × 4 = 12.</p>
  <p class="small muted">En cada línea: ✕ = acción puntual, 〰 = en progreso, ↷ = conexión con el momento de referencia, línea azul = ahora, línea naranja = otro momento de referencia.</p></div>
  <div class="row"><button class="btn" id="mix">⚡ Práctica mixta: ¿qué tiempo va aquí? (15)</button></div>
  <div class="tgrid"><div></div>${cols.map(([, n]) => `<div class="th">${n}</div>`).join("")}
    ${grid.map((a) => `<div class="th side">${aspectEs[a]}</div>${cols.map(([g]) => { const t = TENSES.find((x) => x.group === g && x.aspect === a); const b = best[t.id]; return `<button class="tcell" data-tense="${t.id}"><b>${esc(t.name.replace(" (will / going to)", ""))}</b>${tlSVG(t.tl, false)}<span class="small muted">${esc(t.form.aff[0].split("·")[0])}</span>${b !== undefined ? `<span class="tb">${Math.round(b * 100)}%</span>` : ""}</button>`; }).join("")}`).join("")}
  </div>
  <div class="card"><h3>¿Cómo elegir el tiempo?</h3><ol class="steps">
    <li><b>¿Cuándo pasa?</b> Pasado, presente o futuro.</li>
    <li><b>¿Es un hecho completo o algo en progreso?</b> En progreso → continuo (be + -ing).</li>
    <li><b>¿Pasa antes de otro momento y se conecta con él?</b> → perfecto (have/had/will have + participio).</li>
    <li><b>¿Importa cuánto tiempo lleva o llevaba?</b> (for, since, how long) → perfecto continuo.</li>
    <li><b>Verbos de estado</b> (know, like, want, need, believe, own) casi nunca van en continuo.</li></ol></div>`;
  $("#back").onclick = () => { sub = null; render(); };
  $("#mix").onclick = () => tenseDrill(m, shuffle(TENSE_DRILL.slice()).slice(0, 15), "Práctica mixta", null);
  $$("[data-tense]", m).forEach((b) => b.onclick = () => { sub = { tense: b.dataset.tense }; render(); window.scrollTo(0, 0); });
}
function tenseDetail(m, id) {
  const t = TENSES.find((x) => x.id === id), items = TENSE_DRILL.filter((d) => d[0] === id);
  const i = TENSES.indexOf(t), prev = TENSES[i - 1], next = TENSES[i + 1];
  const lessons = (TENSE_LESSONS[id] || []).map(lessonByTitle).filter(Boolean);
  const say = (s) => `${esc(s)} ${speakBtn(s)}`;
  m.innerHTML = `<div class="row between"><div><h1>${esc(t.name)}</h1><div class="muted small">${esc(t.es)} · se ve desde ${t.level}</div></div><button class="btn ghost small" id="back">← Los 12</button></div>
  <div class="card center">${tlSVG(t.tl, true)}<p class="small muted">${esc(t.tl.note)}</p></div>
  <div class="card"><h3>Cómo se forma</h3><div class="list">
    <div class="li col"><b>✅ Afirmativa:</b> <span>${esc(t.form.aff[0])}</span><i>${say(t.form.aff[1])}</i>${pronHTML(t.form.aff[1])}</div>
    <div class="li col"><b>❌ Negativa:</b> <span>${esc(t.form.neg[0])}</span><i>${say(t.form.neg[1])}</i></div>
    <div class="li col"><b>❓ Pregunta:</b> <span>${esc(t.form.q[0])}</span><i>${say(t.form.q[1])}</i></div></div></div>
  <div class="card"><h3>Cuándo se usa</h3><ul>${t.uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul><p><b>Palabras que lo delatan:</b> <i>${esc(t.signals)}</i></p></div>
  <div class="card"><h3>Ejemplos</h3>${t.examples.map((e) => `<p class="exs">${say(e)}</p>${csBox(e, false)}`).join("")}</div>
  <div class="card note"><h3>⚠️ Error típico</h3><p><s>${esc(t.mistake[0])}</s></p><p>✅ <b>${say(t.mistake[1])}</b></p><p class="small">${esc(t.mistake[2])}</p></div>
  <div class="row"><button class="btn" id="drill">⚡ Practicar este tiempo (${items.length})</button>${lessons.map((l) => `<button class="btn ghost" data-les="${l.id}">📘 Lección: ${esc(l.title)}</button>`).join("")}</div>
  <div class="row between">${prev ? `<button class="btn ghost small" data-tense="${prev.id}">← ${esc(prev.name)}</button>` : "<span></span>"}${next ? `<button class="btn ghost small" data-tense="${next.id}">${esc(next.name)} →</button>` : ""}</div>`;
  $("#back").onclick = () => { sub = { tenses: true }; render(); };
  $("#drill").onclick = () => tenseDrill(m, items.concat(shuffle(TENSE_DRILL.filter((d) => d[0] === "mix")).slice(0, 2)), t.name, id);
  $$("[data-les]", m).forEach((b) => b.onclick = () => { sub = { lesson: ALL_LESSONS.find((l) => l.id === b.dataset.les) }; render(); });
  $$("[data-tense]", m).forEach((b) => b.onclick = () => { sub = { tense: b.dataset.tense }; render(); window.scrollTo(0, 0); });
}
function tenseDrill(m, items, title, id) {
  exerciseRunner(m, items.map((d) => d[1]), { title: "🕒 " + title, subtitle: "Elige o escribe el tiempo correcto", onExit: () => { sub = id ? { tense: id } : { tenses: true }; render(); },
    onFinish: (c, n, wrongs) => {
      S.tenseBest = S.tenseBest || {};
      // guardar el resultado por tiempo
      const per = {}; items.forEach((d) => { per[d[0]] = per[d[0]] || [0, 0]; per[d[0]][1]++; });
      const wrongQ = new Set(wrongs.map((w) => w.q));
      items.forEach((d) => { if (!wrongQ.has(d[1][1])) per[d[0]][0]++; });
      Object.entries(per).forEach(([k, [ok, tot]]) => { if (k !== "mix") S.tenseBest[k] = Math.max(S.tenseBest[k] || 0, ok / tot); });
      skill("grammar", c, n); addXP(c * 3); save();
      const weak = Object.entries(per).filter(([k, [ok, tot]]) => k !== "mix" && ok / tot < 0.7).map(([k]) => TENSES.find((t) => t.id === k));
      m.innerHTML = `<div class="card center"><div class="big">🕒</div><h2>${c} de ${n} correctas</h2>${weak.length ? `<p>Repasa: ${weak.map((t) => `<button class="btn ghost small" data-tense="${t.id}">${esc(t.name)}</button>`).join(" ")}</p>` : `<p class="muted">¡Muy bien! Dominas estos tiempos.</p>`}
        ${wrongs.length ? `<div class="list left">${wrongs.map((w) => `<div class="li"><div><b>${esc(w.answer)}</b><div class="small muted">${esc(w.q)}</div></div>${speakBtn(w.answer)}</div>`).join("")}</div>` : ""}
        <div class="row center"><button class="btn" id="again">Otra ronda</button><button class="btn ghost" id="back2">Volver</button></div></div>`;
      $$("[data-tense]", m).forEach((b) => b.onclick = () => { sub = { tense: b.dataset.tense }; render(); window.scrollTo(0, 0); });
      $("#again").onclick = () => tenseDrill(m, id ? items : shuffle(TENSE_DRILL.slice()).slice(0, 15), title, id);
      $("#back2").onclick = () => { sub = id ? { tense: id } : { tenses: true }; render(); };
    } });
}

// Integración con Gramática
(() => {
  const base = RENDER.gramatica;
  RENDER.gramatica = (m) => {
    if (sub && sub.tenses) return tensesPage(m);
    if (sub && sub.tense) return tenseDetail(m, sub.tense);
    base(m);
    if (sub) return;
    const h = $("h1", m); if (!h) return;
    h.insertAdjacentHTML("afterend", `<button class="card tenses-banner" id="tenses"><span class="tbic">🕒</span><span><b>Los 12 tiempos verbales</b><small>Tabla comparativa, líneas de tiempo, errores típicos y práctica mixta</small></span><span>→</span></button>`);
    $("#tenses").onclick = () => { sub = { tenses: true }; render(); window.scrollTo(0, 0); };
  };
})();
