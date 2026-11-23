// ===== CONVERSACIONES: RAMIFICACIONES, CORRECCIÓN, MAPA Y RESULTADOS =====

// Convierte una conversación lineal (turns) al formato de nodos
function convoNodes(item) {
  if (item.nodes) return { start: item.start, nodes: item.nodes };
  const nodes = {};
  item.turns.forEach((t, i) => { nodes["t" + i] = { npc: t[0], task: t[1], opts: [{ label: "", say: t[2], next: i + 1 < item.turns.length ? "t" + (i + 1) : null }] }; });
  return { start: "t0", nodes };
}
const allConvos = () => SCENES.concat(ALL_ROLEPLAY, typeof DEV_RP !== "undefined" ? DEV_RP : []);
const convoById = (id) => allConvos().find((c) => c.id === id);
const convoOK = (c) => c.level === "TI" || S.unlocked.includes(c.level);

// ---------- Corrección gramatical de lo que dices (LanguageTool) ----------
const LT_IGNORE_CAT = new Set(["CASING", "TYPOGRAPHY", "PUNCTUATION", "STYLE", "REDUNDANCY"]);
const LT_IGNORE_RULE = new Set(["UPPERCASE_SENTENCE_START", "PUNCTUATION_PARAGRAPH_END", "COMMA_PARENTHESIS_WHITESPACE", "WHITESPACE_RULE", "EN_QUOTES", "SENTENCE_WHITESPACE", "I_LOWERCASE"]);
async function checkSpoken(said) {
  let t = said.trim(); if (!t) return [];
  t = t[0].toUpperCase() + t.slice(1); if (!/[.!?]$/.test(t)) t += ".";
  const ms = await languageTool(t);
  return ms.filter((m) => !LT_IGNORE_CAT.has((m.rule.category || {}).id) && !LT_IGNORE_RULE.has(m.rule.id)).map((m) => ({ bad: t.substr(m.offset, m.length), msg: m.message, fix: (m.replacements[0] || {}).value || "" }));
}
function ltHTML(res) {
  if (res.lt === undefined) return `<p class="small muted">⏳ Revisando gramática…</p>`;
  if (res.lt === null) return `<p class="small muted">El corrector de gramática no está disponible ahora (necesita internet).</p>`;
  if (!res.lt.length) return `<p class="small">✅ <b>Gramática:</b> no se encontraron errores.</p>`;
  return `<div class="ltspoken"><b>Gramática: ${res.lt.length} posible(s) error(es)</b>${res.lt.map((e) => `<div class="ltm"><mark>${esc(e.bad)}</mark>${e.fix ? ` → <b>${esc(e.fix)}</b>` : ""}<div class="small muted">${esc(e.msg)}</div></div>`).join("")}</div>`;
}

// ---------- Motor de conversación ----------
function runConvo(m, item, back) {
  if (!sub.cv) { const g = convoNodes(item); sub.cv = { g, node: g.start, log: [], res: null, shown: Date.now(), hints: {} }; }
  const cv = sub.cv, node = cv.g.nodes[cv.node];
  if (!node || node.end) return convoEnd(m, item, back, node);
  const r = cv.res;
  const branching = !!item.nodes;
  m.innerHTML = `<div class="row between"><div><h1>${esc(item.title)}</h1><div class="muted small">${esc(item.intro)}${branching ? " · 🔀 La conversación cambia según lo que digas" : ""}</div></div><button class="btn ghost small" id="exit">Salir</button></div>
  <div class="chat">${cv.log.map((l) => `<div class="msg bot">${esc(l.npc)}</div><div class="msg me">${esc(l.said)}</div>`).join("")}
    <div class="msg bot">${esc(node.npc)} ${speakBtn(node.npc)}${csBox(node.npc, false)}</div></div>
  ${node.task ? `<div class="card task-box"><b>Tu turno:</b> ${esc(node.task)}</div>` : ""}
  ${r ? `<div class="feedback ${r.s >= 0.6 ? "good" : "bad"}"><b>Dijiste:</b> “${esc(r.said)}”
      ${r.s < 0.3 ? `<p>🤔 No quedó muy claro. Prueba con una de las ideas de abajo o dilo de otra forma.</p>` : ""}
      <p><b>Frase modelo más cercana</b> (${Math.round(r.s * 100)}%): ${esc(r.model)} ${speakBtn(r.model)}</p>${csBox(r.model, false)}
      ${branching && r.opt.label ? `<p class="small muted">Camino elegido: ${esc(r.opt.label)}</p>` : ""}
      <div id="ltres">${ltHTML(r)}</div></div>
    <div class="row"><button class="btn" id="next">Continuar</button><button class="btn ghost" id="retry">Intentar de nuevo</button></div>`
  : `<div class="center">${micButton("rec")}</div><p class="muted center" id="live"></p><form id="tf" class="row"><input id="ti" placeholder="O escribe tu respuesta en inglés" autocapitalize="off"><button class="btn">Enviar</button></form>
    <details class="card hints"><summary>💡 ${node.opts.length > 1 ? "Ideas de qué decir" : "Ver una respuesta posible"}</summary>${node.opts.map((o, k) => `<div class="hint">${o.label ? `<b>${esc(o.label)}</b>` : ""} <button class="btn ghost small" data-h="${k}">Ver frase</button><div id="h${k}"></div></div>`).join("")}<p class="small muted">Escucha la frase y luego dila tú sin mirar.</p></details>`}`;
  $("#exit").onclick = () => { stopSpeech(); back(); };
  if (!r) setTimeout(() => speakLines([[1, node.npc]]), 200);
  const answer = (said) => {
    let best = { s: -1 };
    node.opts.forEach((o) => o.say.forEach((x) => { const s = similarity(x, said); if (s > best.s) best = { s, model: x, opt: o }; }));
    cv.res = { said, s: Math.max(0, best.s), model: best.model, opt: best.opt, secs: Math.round((Date.now() - cv.shown) / 1000), lt: undefined };
    const res = cv.res; render();
    checkSpoken(said).then((lt) => { res.lt = lt; }).catch(() => { res.lt = null; }).then(() => { const b = $("#ltres"); if (b && cv.res === res) b.innerHTML = ltHTML(res); });
  };
  bindMic("rec", answer, (t) => { const l = $("#live"); if (l) l.textContent = t; });
  if ($("#tf")) $("#tf").onsubmit = (e) => { e.preventDefault(); const v = $("#ti").value.trim(); if (v) answer(v); };
  $$("[data-h]", m).forEach((b) => b.onclick = () => { const o = node.opts[+b.dataset.h], x = o.say[0]; $("#h" + b.dataset.h).innerHTML = `<p>${esc(x)} ${speakBtn(x)}</p>`; b.remove(); cv.hints[cv.node] = true; });
  if ($("#next")) $("#next").onclick = () => { cv.log.push({ npc: node.npc, said: r.said, model: r.model, s: r.s, secs: r.secs, lt: r.lt || [], task: node.task || "", hint: !!cv.hints[cv.node] }); cv.node = r.opt.next; cv.res = null; cv.shown = Date.now(); render(); };
  if ($("#retry")) $("#retry").onclick = () => { cv.res = null; cv.shown = Date.now(); render(); };
}

function convoEnd(m, item, back, endNode) {
  const cv = sub.cv;
  if (endNode && endNode.end && !cv.closed) {
    m.innerHTML = `<div class="row between"><h1>${esc(item.title)}</h1></div><div class="chat">${cv.log.map((l) => `<div class="msg bot">${esc(l.npc)}</div><div class="msg me">${esc(l.said)}</div>`).join("")}<div class="msg bot">${esc(endNode.npc)} ${speakBtn(endNode.npc)}</div></div><button class="btn wide" id="res">Ver mi resultado</button>`;
    setTimeout(() => speakLines([[1, endNode.npc]]), 200);
    $("#res").onclick = () => { cv.closed = true; render(); };
    return;
  }
  convoResults(m, item, back);
}

// ---------- Resultado completo ----------
const STOP = new Set("i you he she it we they a an the and or but to of in on at for with is are was were be been am do does did have has had my your our their this that these those me him her us them so if then not no yes can could would will just very".split(" "));
function convoResults(m, item, back) {
  const cv = sub.cv, L = cv.log, n = L.length || 1;
  if (!cv.stats) {
    const acc = L.reduce((a, l) => a + l.s, 0) / n;
    const errs = L.reduce((a, l) => a + l.lt.length, 0);
    const words = L.map((l) => (l.said.match(/[A-Za-z']+/g) || []).length);
    const avgW = words.reduce((a, b) => a + b, 0) / n;
    const avgT = L.reduce((a, l) => a + l.secs, 0) / n;
    const hints = L.filter((l) => l.hint).length;
    const toks = [...new Set(L.flatMap((l) => (l.said.toLowerCase().match(/[a-z']+/g) || [])))];
    const known = new Set(allCards().map((c) => c.en.toLowerCase()).filter((w) => !w.includes(" ")));
    const courseWords = toks.filter((w) => known.has(w) && !STOP.has(w));
    const flu = Math.min(1, avgW / 7) * (avgT <= 20 ? 1 : avgT <= 35 ? 0.8 : 0.6);
    const gram = Math.max(0, 1 - errs / n / 1.5);
    const score = acc * 0.55 + gram * 0.25 + flu * 0.2 - Math.min(0.15, hints * 0.03);
    const stars = score >= 0.78 ? 3 : score >= 0.58 ? 2 : score >= 0.35 ? 1 : 0;
    cv.stats = { acc, errs, avgW, avgT, hints, toks, courseWords, flu, gram, stars, score };
    const prev = (S.rpStars || {})[item.id] || 0;
    S.rpStars = S.rpStars || {}; S.rpStars[item.id] = Math.max(prev, stars);
    S.done.roleplay[item.id] = true;
    skill("speaking", Math.round(acc * n), n); if (extraTask().go === "hablar") markDaily("extra"); addXP(10 + stars * 5); save();
  }
  const st = cv.stats, pct = (x) => Math.round(x * 100);
  const review = L.filter((l) => l.s < 0.7 || l.lt.length);
  const meter = (label, v, note) => `<div class="meter"><div class="row between"><b>${label}</b><span>${pct(v)}%</span></div><div class="bar"><i style="width:${pct(v)}%"></i></div><div class="small muted">${note}</div></div>`;
  m.innerHTML = `<div class="card center"><div class="stars">${[1, 2, 3].map((i) => `<span class="${i <= st.stars ? "on" : ""}">★</span>`).join("")}</div>
    <h2>${["Sigue practicando", "¡Bien!", "¡Muy bien!", "¡Excelente!"][st.stars]}</h2><p class="muted">${esc(item.title)} · ${L.length} respuestas</p></div>
  <div class="card">${meter("Precisión", st.acc, "Qué tanto se pareció lo que dijiste a una frase natural para esa situación.")}
    ${meter("Gramática", st.gram, st.errs ? `${st.errs} posible(s) error(es) encontrados por el corrector.` : "El corrector no encontró errores.")}
    ${meter("Fluidez", st.flu, `${st.avgW.toFixed(1)} palabras por respuesta · ${Math.round(st.avgT)} s en responder, en promedio${st.hints ? ` · usaste ${st.hints} pista(s)` : ""}.`)}
    <div class="meter"><b>Vocabulario</b><div class="small muted">${st.toks.length} palabras distintas${st.courseWords.length ? `, ${st.courseWords.length} del curso:` : "."}</div>${st.courseWords.length ? `<div class="chips">${st.courseWords.slice(0, 20).map((w) => `<span class="chip">${esc(w)}</span>`).join("")}</div>` : ""}</div></div>
  ${review.length ? `<div class="card"><h3>Frases para repasar</h3>${review.map((l, k) => `<div class="li col"><div class="small muted">${esc(l.npc)}</div><div>Dijiste: “${esc(l.said)}”</div><div><b>Mejor así:</b> ${esc(l.lt.length && l.s >= 0.7 ? fixWith(l.said, l.lt) : l.model)} ${speakBtn(l.model)}</div><button class="btn ghost small" data-add="${k}">➕ Añadir a mis tarjetas</button></div>`).join("")}</div>` : `<div class="feedback good">Ninguna frase para repasar. ¡Muy bien!</div>`}
  <div class="row center"><button class="btn" id="again">Repetir${item.nodes ? " (prueba otro camino)" : ""}</button><button class="btn ghost" id="lst">Volver</button></div>`;
  $$("[data-add]", m).forEach((b) => b.onclick = () => { const l = review[+b.dataset.add]; addCustomCard(l.model, l.task || item.title, l.npc); b.textContent = "✓ Añadida"; b.disabled = true; });
  $("#again").onclick = () => { sub = { rp: item }; render(); };
  $("#lst").onclick = back;
}
function fixWith(said, lt) { let t = said; lt.forEach((e) => { if (e.fix && e.bad) t = t.replace(e.bad, e.fix); }); return t; }

// La conversación vieja se reemplaza por el motor nuevo (también en Inglés TI)
roleplay = function (m, rp) { runConvo(m, rp, () => { stopSpeech(); sub = null; render(); }); };

// ---------- Mapa de situaciones ----------
let mapPlace = null;
function placeConvos(pid) { return SCENES.filter((s) => s.place === pid).concat((MAP_EXTRA[pid] || []).map(convoById).filter(Boolean)); }
const starsOf = (id) => (S.rpStars || {})[id] || 0;
function situationsMap(box) {
  const total = allConvos().length, got = allConvos().reduce((a, c) => a + starsOf(c.id), 0);
  box.innerHTML = `<p class="muted">Recorre la ciudad: entra a un lugar, elige una situación y habla con las personas. Las conversaciones con 🔀 cambian según lo que respondas. Gana hasta 3 estrellas en cada una.</p>
  <div class="small muted">⭐ ${got} de ${total * 3} estrellas</div>
  <div class="citymap"><svg viewBox="0 0 100 100" preserveAspectRatio="none" class="roads"><path d="M0 30 H100 M0 58 H100 M0 86 H100 M27 0 V100 M52 0 V100 M76 0 V100" /></svg>
    ${MAP_PLACES.map((p) => { const cs = placeConvos(p.id), ok = cs.some(convoOK), st = cs.reduce((a, c) => a + starsOf(c.id), 0); return `<button class="place ${ok ? "" : "locked"} ${mapPlace === p.id ? "sel" : ""}" style="left:${p.x}%;top:${p.y}%" data-place="${p.id}">${fl3dHTML(p.icon, "map")}<span class="pn">${esc(p.name)}</span><span class="ps">${ok ? `★${st}/${cs.length * 3}` : "🔒"}</span></button>`; }).join("")}
  </div><div id="placebox"></div>`;
  $$("[data-place]", box).forEach((b) => b.onclick = () => { mapPlace = b.dataset.place; situationsMap(box); $("#placebox").scrollIntoView({ behavior: "smooth", block: "start" }); });
  if (mapPlace) {
    const p = MAP_PLACES.find((x) => x.id === mapPlace), cs = placeConvos(mapPlace);
    $("#placebox").innerHTML = `<h2>${p.icon} ${esc(p.name)}</h2><div class="lessons">${cs.map((c) => { const ok = convoOK(c), s = starsOf(c.id); return `<button class="lesson ${ok ? "" : "dim"}" data-cv="${c.id}" ${ok ? "" : "disabled"}><span class="num">${c.level}</span><span><b>${c.nodes ? "🔀 " : ""}${esc(c.title)}</b><small>${esc(c.intro)}${ok ? "" : " · 🔒 Se desbloquea en " + c.level}</small></span><span class="st">${"★".repeat(s)}${"☆".repeat(3 - s)}</span></button>`; }).join("")}</div>`;
    $$("[data-cv]", box).forEach((b) => b.onclick = () => { sub = { rp: convoById(b.dataset.cv) }; render(); });
  }
}
