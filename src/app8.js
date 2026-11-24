// ===== VERBOS AUXILIARES: VISTA, FICHAS, CÓMO SE APLICAN Y PRÁCTICA =====
const auxDrillFor = (cat) => AUX_DRILL.filter((d) => d[0] === cat || (cat === "might" && d[0] === "may"));
const auxCatOf = (id) => (id === "might" ? "may" : id);

function auxPage(m) {
  const best = S.auxBest || {};
  const tile = (a) => { const b = best[auxCatOf(a.id)]; return `<button class="auxtile ${a.group}" data-aux="${a.id}"><b>${esc(a.word.split(" (")[0])}</b><span class="small muted">${esc(a.es)}</span>${b !== undefined ? `<span class="tb">${Math.round(b * 100)}%</span>` : ""}</button>`; };
  m.innerHTML = `<div class="row between"><h1>🧩 Verbos auxiliares</h1><button class="btn ghost small" id="back">← Volver</button></div>
  <div class="card explain"><p>Los auxiliares son los verbos que <b>ayudan</b> al verbo principal a formar tiempos, negativas y preguntas. Hay dos familias:</p>
  <ul><li><b>Primarios: be, do, have.</b> Forman los tiempos (<i>I am working, Did you go?, I have finished</i>) y también pueden ser verbos normales.</li>
  <li><b>Modales: will, would, shall, should, can, could, may, might, must, ought to.</b> Le agregan una idea al verbo: futuro, condición, consejo, capacidad, duda, obligación…</li></ul>
  <p class="small muted">Truco para recordarlos en español: <b>will</b> = -é (iré) · <b>would</b> = -ía (iría) · <b>should</b> = debería · <b>can</b> = puedo · <b>could</b> = podía/podría · <b>may</b> = puede que · <b>must</b> = debo.</p></div>
  <div class="row"><button class="btn" id="mix">⚡ Práctica mixta (20)</button><button class="btn ghost" id="speak">🎙️ Práctica hablada: reacciona (10)</button></div>
  <h2>Primarios</h2><div class="auxgrid">${AUX_LIST.filter((a) => a.group === "primario").map(tile).join("")}</div>
  <h2>Modales</h2><div class="auxgrid">${AUX_LIST.filter((a) => a.group === "modal").map(tile).join("")}</div>
  <div class="card"><h3>Reglas de oro de los modales</h3><div class="list">${AUX_RULES.map(([r, ok, bad]) => `<div class="li col"><b>${esc(r)}</b><span>✅ <i>${esc(ok)}</i></span><span class="small muted">❌ <s>${esc(bad)}</s></span></div>`).join("")}</div>
  <button class="btn ghost small" data-cat="modal">⚡ Practicar las reglas (${auxDrillFor("modal").length})</button></div>
  <h2>Cómo se aplican</h2><p class="small muted">La regla de oro: en cada frase hay un solo auxiliar que «trabaja» (el primero). Ese es el que se niega, se mueve en las preguntas y se repite en las respuestas cortas.</p>
  <div class="lessons">${AUX_USES.map((u) => { const b = best[u.id]; return `<button class="lesson" data-use="${u.id}"><span class="num">${u.title.split(".")[0]}</span><span><b>${esc(u.title.replace(/^\d+\. /, ""))}</b><small>${esc(u.es)}${b !== undefined ? ` · Mejor: ${Math.round(b * 100)}%` : ""}</small></span></button>`; }).join("")}</div>`;
  $("#back").onclick = () => { sub = null; render(); };
  $("#mix").onclick = () => auxDrill(m, shuffle(AUX_DRILL).slice(0, 20), "Práctica mixta", null);
  $("#speak").onclick = () => auxSpeak(m, shuffle(AUX_SPEAK).slice(0, 10), () => { sub = { aux: true }; render(); });
  $$("[data-aux]", m).forEach((b) => b.onclick = () => { sub = { auxw: b.dataset.aux }; render(); window.scrollTo(0, 0); });
  $$("[data-use]", m).forEach((b) => b.onclick = () => { sub = { auxu: b.dataset.use }; render(); window.scrollTo(0, 0); });
  $$("[data-cat]", m).forEach((b) => b.onclick = () => auxDrill(m, shuffle(auxDrillFor(b.dataset.cat)), AUX_CATS[b.dataset.cat], null));
}

function auxDetail(m, id) {
  const a = AUX_LIST.find((x) => x.id === id), cat = auxCatOf(id), items = auxDrillFor(cat);
  const i = AUX_LIST.indexOf(a), prev = AUX_LIST[i - 1], next = AUX_LIST[i + 1];
  const say = (s) => `${esc(s)} ${speakBtn(s)}`;
  m.innerHTML = `<div class="row between"><div><h1>${esc(a.word)}</h1><div class="muted small">${a.group === "modal" ? "Modal" : "Auxiliar primario"} · ${esc(a.es)} · ${a.level}</div></div><button class="btn ghost small" id="back">← Auxiliares</button></div>
  <div class="card"><p>${esc(a.what)}</p></div>
  <div class="card"><h3>Ejemplos</h3>${a.ex.map(([en, es]) => `<div class="auxex"><p class="exs"><b>${say(en)}</b> <span class="muted">→ ${esc(es)}</span></p>${pronHTML(en)}${csBox(en, false)}</div>`).join("")}</div>
  <div class="card"><h3>Negativa, pregunta y respuesta corta</h3><div class="list">
    <div class="li col"><b>❌ Negativa</b><i>${say(a.neg)}</i></div>
    <div class="li col"><b>❓ Pregunta</b><i>${say(a.q)}</i></div>
    <div class="li col"><b>💬 Respuesta corta</b><i>${a.short.map(say).join(" · ")}</i></div></div></div>
  <div class="card note"><h3>⚠️ Ojo</h3><p>${esc(a.note)}</p></div>
  <div class="row">${items.length ? `<button class="btn" id="drill">⚡ Practicar ${esc(a.word.split(" (")[0])} (${items.length})</button>` : ""}<button class="btn ghost" id="speak">🎙️ Práctica hablada</button></div>
  <div class="row between">${prev ? `<button class="btn ghost small" data-aux="${prev.id}">← ${esc(prev.word.split(" (")[0])}</button>` : "<span></span>"}${next ? `<button class="btn ghost small" data-aux="${next.id}">${esc(next.word.split(" (")[0])} →</button>` : ""}</div>`;
  $("#back").onclick = () => { sub = { aux: true }; render(); };
  if ($("#drill")) $("#drill").onclick = () => auxDrill(m, shuffle(items), a.word.split(" (")[0], { auxw: id });
  $("#speak").onclick = () => auxSpeak(m, shuffle(AUX_SPEAK).slice(0, 10), () => { sub = { auxw: id }; render(); });
  $$("[data-aux]", m).forEach((b) => b.onclick = () => { sub = { auxw: b.dataset.aux }; render(); window.scrollTo(0, 0); });
}

function auxUseDetail(m, id) {
  const u = AUX_USES.find((x) => x.id === id), items = auxDrillFor(id), sp = AUX_SPEAK.filter((s) => s.cat === id);
  const i = AUX_USES.indexOf(u), prev = AUX_USES[i - 1], next = AUX_USES[i + 1];
  m.innerHTML = `<div class="row between"><div><h1>${esc(u.title)}</h1><div class="muted small">Verbos auxiliares · cómo se aplican</div></div><button class="btn ghost small" id="back">← Auxiliares</button></div>
  <div class="card explain"><p>${esc(u.es)}</p><p class="pattern"><b>Fórmula:</b> ${esc(u.pattern)}</p></div>
  <div class="card"><h3>Ejemplos</h3>${u.ex.map((e) => `<p class="exs">${esc(e)} ${speakBtn(e.replace(/— /g, ""))}</p>`).join("")}</div>
  <div class="card note"><h3>💡 Consejo</h3><p>${esc(u.tip)}</p></div>
  <div class="row">${items.length ? `<button class="btn" id="drill">⚡ Practicar (${items.length})</button>` : ""}${sp.length ? `<button class="btn ghost" id="speak">🎙️ Practicar hablando (${sp.length})</button>` : ""}</div>
  <div class="row between">${prev ? `<button class="btn ghost small" data-use="${prev.id}">← ${esc(prev.title.replace(/^\d+\. /, ""))}</button>` : "<span></span>"}${next ? `<button class="btn ghost small" data-use="${next.id}">${esc(next.title.replace(/^\d+\. /, ""))} →</button>` : ""}</div>`;
  $("#back").onclick = () => { sub = { aux: true }; render(); };
  if ($("#drill")) $("#drill").onclick = () => auxDrill(m, shuffle(items), u.title.replace(/^\d+\. /, ""), { auxu: id });
  if ($("#speak")) $("#speak").onclick = () => auxSpeak(m, shuffle(sp), () => { sub = { auxu: id }; render(); });
  $$("[data-use]", m).forEach((b) => b.onclick = () => { sub = { auxu: b.dataset.use }; render(); window.scrollTo(0, 0); });
}

function auxDrill(m, items, title, ret) {
  const back = () => { sub = ret || { aux: true }; render(); };
  exerciseRunner(m, items.map((d) => d[1]), { title: "🧩 " + title, subtitle: "Verbos auxiliares", onExit: back,
    onFinish: (c, n, wrongs) => {
      S.auxBest = S.auxBest || {};
      const per = {}, wrongQ = new Set(wrongs.map((w) => w.q));
      items.forEach((d) => { per[d[0]] = per[d[0]] || [0, 0]; per[d[0]][1]++; if (!wrongQ.has(d[1][1])) per[d[0]][0]++; });
      Object.entries(per).forEach(([k, [ok, tot]]) => { S.auxBest[k] = Math.max(S.auxBest[k] || 0, ok / tot); });
      skill("grammar", c, n); addXP(c * 3); save();
      const weak = Object.entries(per).filter(([, [ok, tot]]) => ok / tot < 0.7).map(([k]) => k);
      const link = (k) => AUX_USES.some((u) => u.id === k) ? `data-use="${k}"` : AUX_LIST.some((a) => a.id === k) ? `data-aux="${k}"` : `data-auxhome="1"`;
      m.innerHTML = `<div class="card center"><div class="big">🧩</div><h2>${c} de ${n} correctas</h2>${weak.length ? `<p>Repasa: ${weak.map((k) => `<button class="btn ghost small" ${link(k)}>${esc(AUX_CATS[k] || k)}</button>`).join(" ")}</p>` : `<p class="muted">¡Muy bien! Manejas estos auxiliares.</p>`}
        ${wrongs.length ? `<div class="list left">${wrongs.map((w) => `<div class="li"><div><b>${esc(w.answer)}</b><div class="small muted">${esc(w.q)}</div></div>${speakBtn(w.answer)}</div>`).join("")}</div>` : ""}
        <div class="row center"><button class="btn" id="again">Otra ronda</button><button class="btn ghost" id="back2">Volver</button></div></div>`;
      $$("[data-aux]", m).forEach((b) => b.onclick = () => { sub = { auxw: b.dataset.aux }; render(); });
      $$("[data-use]", m).forEach((b) => b.onclick = () => { sub = { auxu: b.dataset.use }; render(); });
      $$("[data-auxhome]", m).forEach((b) => b.onclick = () => { sub = { aux: true }; render(); });
      $("#again").onclick = () => auxDrill(m, shuffle(ret ? items : AUX_DRILL).slice(0, ret ? items.length : 20), title, ret);
      $("#back2").onclick = back;
    } });
}

// Práctica hablada: la app dice una frase y tú reaccionas usando el auxiliar correcto
function auxSpeak(m, list, back) {
  let k = 0, ok = 0, res = null; const misses = [];
  const isEs = (s) => /^Di en inglés/.test(s.say);
  const draw = () => {
    const it = list[k];
    if (!it) {
      skill("speaking", ok, list.length); addXP(ok * 3); save();
      m.innerHTML = `<div class="card center"><div class="big">🎙️</div><h2>${ok} de ${list.length} bien</h2>
        ${misses.length ? `<p class="small muted">Repite estas en voz alta:</p><div class="list left">${misses.map((x) => `<div class="li"><div><b>${esc(x.ans[0])}</b><div class="small muted">${esc(x.say)}</div></div>${speakBtn(x.ans[0])}</div>`).join("")}</div>` : `<p class="muted">¡Excelente! Reaccionas con naturalidad.</p>`}
        <div class="row center"><button class="btn" id="again">Otra ronda</button><button class="btn ghost" id="back2">Volver</button></div></div>`;
      $("#again").onclick = () => auxSpeak(m, shuffle(AUX_SPEAK).slice(0, 10), back);
      $("#back2").onclick = () => { stopSpeech(); back(); };
      return;
    }
    m.innerHTML = `<div class="row between"><div><h1>🎙️ Reacciona</h1><div class="muted small">${k + 1} de ${list.length} · ${esc(AUX_CATS[it.cat] || "")}</div></div><button class="btn ghost small" id="exit">Salir</button></div>
      <div class="chat"><div class="msg bot">${esc(it.say)} ${isEs(it) ? "" : speakBtn(it.say)}</div>${res ? `<div class="msg me">${esc(res.said)}</div>` : ""}</div>
      <div class="card task-box"><b>Tu turno:</b> ${esc(it.task)}</div>
      ${res ? `<div class="feedback ${res.ok ? "good" : "bad"}"><b>${res.ok ? "✅ ¡Bien!" : "Casi."}</b> ${res.ok && norm(res.best) === norm(res.said) ? "" : `Respuesta modelo: <b>${esc(res.best)}</b> ${speakBtn(res.best)}`}
          ${it.ans.length > 1 ? `<p class="small muted">También vale: ${it.ans.filter((x) => x !== res.best).map(esc).join(" · ")}</p>` : ""}</div>
        <div class="row"><button class="btn" id="next">Siguiente</button>${res.ok ? "" : `<button class="btn ghost" id="retry">Intentar de nuevo</button>`}</div>`
      : `<div class="center">${micButton("rec")}</div><p class="muted center" id="live"></p>
        <form id="tf" class="row"><input id="ti" placeholder="O escríbelo en inglés" autocapitalize="off"><button class="btn">Enviar</button></form>
        <details class="card hints"><summary>💡 Ver la respuesta</summary><p>${esc(it.ans[0])} ${speakBtn(it.ans[0])}</p><p class="small muted">Escúchala y luego dila tú sin mirar.</p></details>`}`;
    $("#exit").onclick = () => { stopSpeech(); back(); };
    if (!res && !isEs(it)) setTimeout(() => speakLines([[1, it.say]]), 200);
    const answer = (said) => {
      const b = bestMatch(said, it.ans), good = it.ans.some((a) => norm(a) === norm(said)) || b.s >= 0.8;
      if (!res) { if (good) ok++; else misses.push(it); }
      res = { said, ok: good, best: b.m }; draw();
    };
    bindMic("rec", answer, (t) => { const l = $("#live"); if (l) l.textContent = t; });
    if ($("#tf")) $("#tf").onsubmit = (e) => { e.preventDefault(); const v = $("#ti").value.trim(); if (v) answer(v); };
    if ($("#next")) $("#next").onclick = () => { k++; res = null; draw(); window.scrollTo(0, 0); };
    if ($("#retry")) $("#retry").onclick = () => { res = null; draw(); };
  };
  draw();
}

// Integración con Gramática (botón junto a «Los 12 tiempos verbales»)
(() => {
  const base = RENDER.gramatica;
  RENDER.gramatica = (m) => {
    if (sub && sub.aux) return auxPage(m);
    if (sub && sub.auxw) return auxDetail(m, sub.auxw);
    if (sub && sub.auxu) return auxUseDetail(m, sub.auxu);
    base(m);
    if (sub) return;
    const anchor = $("#tenses", m) || $("h1", m); if (!anchor) return;
    anchor.insertAdjacentHTML("afterend", `<button class="card tenses-banner" id="auxb"><span class="tbic">🧩</span><span><b>Verbos auxiliares</b><small>be, do, have y modales (will, would, can, could, should, may, must…): respuestas cortas, question tags, so/neither y práctica hablada</small></span><span>→</span></button>`);
    $("#auxb").onclick = () => { sub = { aux: true }; render(); window.scrollTo(0, 0); };
  };
})();
