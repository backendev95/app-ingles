// ===== MÓDULOS ADICIONALES =====

// ---------- Grabadora (comparar tu voz con el modelo) ----------
let recState = { rec: null, chunks: [], blobs: {}, active: null, stream: null };
const recorderHTML = (k, max) => `<span class="recbox"><button class="icon-btn" data-rec="${k}" ${max ? `data-max="${max}"` : ""} title="Grabarme">⏺️ Grabar</button><button class="icon-btn" data-play="${k}" ${recState.blobs[k] ? "" : "hidden"} title="Escuchar mi voz">▶️ Mi voz</button></span>`;
function bindRecorders(box) {
  $$("[data-rec]", box).forEach((b) => b.onclick = async () => {
    const k = b.dataset.rec;
    if (recState.active === k && recState.rec) { recState.rec.stop(); return; }
    if (recState.rec) { toast("Termina la grabación actual primero"); return; }
    try {
      if (!recState.stream) recState.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(recState.stream); recState.rec = r; recState.chunks = []; recState.active = k;
      r.ondataavailable = (e) => recState.chunks.push(e.data);
      r.onstop = () => { recState.blobs[k] = new Blob(recState.chunks, { type: r.mimeType || "audio/webm" }); recState.rec = null; recState.active = null; b.textContent = "⏺️ Grabar"; b.classList.remove("on"); const p = $(`[data-play="${CSS.escape(k)}"]`, box); if (p) { p.hidden = false; } playBlob(k); };
      r.start(); b.textContent = "⏹️ Detener"; b.classList.add("on");
      setTimeout(() => { if (recState.active === k && recState.rec) recState.rec.stop(); }, (+b.dataset.max || 15) * 1000);
    } catch (e) { toast("No se pudo usar el micrófono para grabar (funciona en Chrome desde tu versión publicada)"); }
  });
  $$("[data-play]", box).forEach((b) => b.onclick = () => playBlob(b.dataset.play));
}
function playBlob(k) { const bl = recState.blobs[k]; if (!bl) return; try { const a = new Audio(URL.createObjectURL(bl)); a.play().catch(() => {}); } catch (e) {} }

// ---------- PROGRESO (diagnóstico + errores) ----------
let pTab = "diagnostico";
function weakLessons() {
  return ALL_LESSONS.filter((l) => S.unlocked.includes(l.level) && S.exStats[l.id] && S.exStats[l.id][1] >= 4)
    .map((l) => ({ l, rate: S.exStats[l.id][0] / S.exStats[l.id][1], n: S.exStats[l.id][1] }))
    .sort((a, b) => a.rate - b.rate);
}
RENDER.progreso = (m) => {
  m.innerHTML = `<h1>Progreso</h1><div class="tabs"><button class="tab ${pTab === "diagnostico" ? "on" : ""}" data-t="diagnostico">Diagnóstico</button><button class="tab ${pTab === "errores" ? "on" : ""}" data-t="errores">Mis errores (${S.mistakes.length})</button></div><div id="pbody"></div>`;
  $$("[data-t]", m).forEach((b) => b.onclick = () => { pTab = b.dataset.t; render(); });
  const box = $("#pbody");
  if (pTab === "errores") return errorsView(box, m);
  const weak = weakLessons(), strong = weak.slice().reverse().filter((x) => x.rate >= 0.85).slice(0, 3);
  const skillNames = { vocab: "Vocabulario", grammar: "Gramática", listening: "Escucha", reading: "Lectura", speaking: "Habla", writing: "Escritura" };
  const cards = Object.entries(S.cards), now = Date.now();
  const lapses = cards.reduce((a, [, c]) => a + (c.lapses || 0), 0), reviews = cards.reduce((a, [, c]) => a + (c.reps || 0) + (c.lapses || 0), 0);
  const mistakeTypes = S.mistakes.reduce((a, x) => { a[x.type] = (a[x.type] || 0) + 1; return a; }, {});
  const imm = S.immersion.reduce((a, x) => a + x.min, 0);
  const skillsSorted = Object.entries(S.skills).filter(([, v]) => v[1] >= 5).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
  box.innerHTML = `
  ${weak.length ? `<div class="card hero"><h2>🎯 Lo que más te cuesta</h2><p class="muted small">Basado en tus respuestas en lecciones, repasos y exámenes.</p>
    <div class="list">${weak.slice(0, 6).map((x) => `<div class="li"><div><b>${esc(x.l.title)}</b> <span class="tag">${x.l.level}</span><div class="bar"><i style="width:${x.rate * 100}%;background:${x.rate < 0.6 ? "var(--red)" : x.rate < 0.8 ? "var(--orange)" : "var(--green)"}"></i></div><small class="muted">${Math.round(x.rate * 100)}% de acierto · ${x.n} respuestas</small></div><button class="btn ghost small" data-l="${x.l.id}">Practicar</button></div>`).join("")}</div>
    <button class="btn" id="focus">🔁 Repaso enfocado en mis temas más débiles</button></div>` : `<div class="card note">Responde algunas lecciones y aquí verás un diagnóstico de tus puntos débiles.</div>`}
  ${strong.length ? `<div class="card"><h2>💪 Tus fortalezas</h2>${strong.map((x) => `<span class="tag big-tag">${esc(x.l.title)} · ${Math.round(x.rate * 100)}%</span>`).join(" ")}</div>` : ""}
  <div class="card"><h2>Por habilidad</h2><div class="skills">${Object.entries(skillNames).map(([k, n]) => { const [c, t] = S.skills[k]; return `<div class="sk"><span>${n}</span><div class="bar"><i style="width:${pct(c, t)}%"></i></div><small>${t ? pct(c, t) + "% · " + t + " resp." : "Sin datos"}</small></div>`; }).join("")}</div>
    ${skillsSorted.length ? `<p class="small">👉 Tu habilidad más débil ahora es <b>${skillNames[skillsSorted[0][0]]}</b>. Dale prioridad esta semana.</p>` : ""}</div>
  <div class="card"><h2>Por tipo de ejercicio</h2><div class="skills">${Object.entries(TYPE_NAMES).map(([k, n]) => { const [c, t] = S.typeStats[k] || [0, 0]; return `<div class="sk"><span>${n}</span><div class="bar"><i style="width:${pct(c, t)}%"></i></div><small>${t ? pct(c, t) + "% · " + t : "Sin datos"}</small></div>`; }).join("")}</div>
    <p class="muted small">Si traducir o corregir te cuesta más que la opción múltiple, es normal: producir es más difícil que reconocer. Es justo lo que más hace subir de nivel.</p></div>
  <div class="stats"><div class="card stat"><b>${cards.filter(([k, c]) => !k.endsWith(":r") && c.reps >= 2).length}</b><small>Palabras aprendidas</small></div><div class="card stat"><b>${cards.filter(([, c]) => c.due <= now).length}</b><small>Tarjetas pendientes</small></div><div class="card stat"><b>${reviews ? Math.round((1 - lapses / reviews) * 100) + "%" : "–"}</b><small>Retención en tarjetas</small></div><div class="card stat"><b>${(imm / 60).toFixed(1)} h</b><small>Inmersión registrada</small></div></div>
  <div class="card"><h2>Exámenes</h2><div class="list">${LEVELS.map((lv) => { const e = S.exams[lv]; return `<div class="li"><div><b>Nivel ${lv}</b></div><span class="tag">${e ? (e.placement ? "Ubicación" : Math.round(e.best * 100) + "%") : "—"}</span><span>${e && e.passed ? "✅" : ""}</span></div>`; }).join("")}${MOCKS.map((x) => { const r = S.mocks[x.id]; return `<div class="li"><div><b>${esc(x.title)}</b></div><span class="tag">${r ? Math.round(r.best * 100) + "%" : "—"}</span><span>${r && r.best >= 0.6 ? "✅" : ""}</span></div>`; }).join("")}</div></div>
  ${Object.keys(mistakeTypes).length ? `<div class="card"><h2>Errores guardados por tipo</h2>${Object.entries(mistakeTypes).map(([k, v]) => `<span class="tag big-tag">${esc(k)}: ${v}</span>`).join(" ")}</div>` : ""}`;
  $$("[data-l]", box).forEach((b) => b.onclick = () => grammarReview(m, [ALL_LESSONS.find((l) => l.id === b.dataset.l)], "Práctica enfocada"));
  if ($("#focus")) $("#focus").onclick = () => grammarReview(m, weak.slice(0, 3).map((x) => x.l), "Repaso enfocado");
};

// ---------- EXÁMENES Y SIMULACROS ----------
RENDER.examenes = (m) => {
  if (sub && sub.mock) return mockRunner(m);
  m.innerHTML = `<h1>Exámenes</h1>
  <h2>Exámenes de nivel</h2><p class="muted">Gramática, vocabulario, lectura y escucha del nivel. Aprobarlo te sube al siguiente.</p>
  <div class="lessons">${LEVELS.map((lv) => { const e = S.exams[lv], u = S.unlocked.includes(lv); return `<button class="lesson ${u ? "" : "dim"}" data-lv="${lv}"><span class="num">${lv}</span><span><b>Examen de nivel ${lv}</b><small>${e ? (e.placement ? "Aprobado por ubicación" : "Mejor: " + Math.round(e.best * 100) + "%") : u ? "Sin presentar" : "Bloqueado"}</small></span><span class="st">${e && e.passed ? "✅" : u ? "" : "🔒"}</span></button>`; }).join("")}</div>
  <h2>Simulacros tipo Cambridge</h2><p class="muted">Formato de la sección <i>Use of English</i> de los exámenes B2 First y C1 Advanced: 4 partes con tiempo. Úsalos para medirte frente a un examen internacional.</p>
  <div class="lessons">${MOCKS.map((x) => { const r = S.mocks[x.id]; return `<button class="lesson" data-mock="${x.id}"><span class="num">${x.level}</span><span><b>${esc(x.title)}</b><small>${x.minutes} min sugeridos · 30 preguntas${r ? ` · Mejor: ${Math.round(r.best * 100)}%` : ""}${lvlIdx(x.level) > lvlIdx(S.level) ? " · Por encima de tu nivel actual" : ""}</small></span><span class="st">${r && r.best >= 0.6 ? "✅" : ""}</span></button>`; }).join("")}</div>
  <p class="muted small">En los exámenes reales se aprueba con cerca del 60% en el conjunto del examen. Aquí, un 60% en Use of English indica que vas bien encaminado.</p>`;
  $$("[data-lv]", m).forEach((b) => b.onclick = () => { const lv = b.dataset.lv; if (!S.unlocked.includes(lv)) { toast(`Primero aprueba el examen de ${LEVELS[lvlIdx(lv) - 1]}`); return; } levelExam(m, lv); });
  $$("[data-mock]", m).forEach((b) => b.onclick = () => { sub = { mock: MOCKS.find((x) => x.id === b.dataset.mock), part: 0, res: [], start: Date.now(), checked: false, vals: {} }; render(); });
};
let mockTimer = null;
function mockRunner(m) {
  const st = sub, mk = st.mock, part = mk.parts[st.part];
  clearInterval(mockTimer);
  if (!part) {
    const C = st.res.reduce((a, r) => a + r.c, 0), N = st.res.reduce((a, r) => a + r.n, 0), p = C / N;
    const r = S.mocks[mk.id] || { best: 0, tries: 0 }; r.best = Math.max(r.best, p); r.tries++; r.last = Date.now(); S.mocks[mk.id] = r;
    skill("grammar", C, N); addXP(C * 5);
    const mins = Math.round((Date.now() - st.start) / 60000);
    m.innerHTML = `<div class="card center"><div class="big">${p >= 0.6 ? "🎓" : "📚"}</div><h2>${mk.title}: ${pct(C, N)}%</h2><p class="muted">Tiempo: ${mins} min (sugerido: ${mk.minutes})</p>
      <div class="secs">${st.res.map((x, i) => `<div class="sec ${x.c / x.n >= 0.6 ? "ok" : "low"}"><b>${MOCK_PART_INFO[mk.parts[i].type].title}</b><span>${x.c}/${x.n}</span></div>`).join("")}</div>
      <p>${p >= 0.75 ? "¡Excelente! Este nivel de Use of English está dominado." : p >= 0.6 ? "Buen resultado: estás en zona de aprobado. Revisa las partes más bajas." : "Todavía no. Repasa las lecciones de gramática y vocabulario del nivel y vuelve a intentarlo en unas semanas."}</p>
      <p class="muted small">Tus fallos quedaron en Progreso → Mis errores.</p><button class="btn" id="ok">Volver</button></div>`;
    $("#ok").onclick = () => { sub = null; render(); };
    return;
  }
  const info = MOCK_PART_INFO[part.type], ck = st.checked, vals = st.vals;
  const tag = (i) => `${st.part}-${i}`;
  const fieldCls = (i, ok) => ck ? (ok ? "okf" : "badf") : "";
  const okOf = (i) => {
    const v = vals[tag(i)] ?? "";
    if (part.type === "mcc") return +v === part.gaps[i][1] && v !== "";
    if (part.type === "kwt") return part.items[i][3].some((a) => norm(a) === norm(v));
    const ans = part.type === "wf" ? part.gaps[i][1] : part.gaps[i];
    return ans.some((a) => norm(a) === norm(v));
  };
  let body = "";
  if (part.type === "kwt") body = part.items.map((it, i) => `<div class="kwt card"><p>${i + 1}. ${esc(it[0])}</p><p class="key">${esc(it[1])}</p><p>${esc(it[2]).replace("___", `<input class="gap wide-gap ${fieldCls(i, okOf(i))}" data-g="${i}" value="${esc(vals[tag(i)] || "")}" ${ck ? "disabled" : ""} autocomplete="off" autocapitalize="off" spellcheck="false">`)}</p>${ck && !okOf(i) ? `<p class="small">✔ ${esc(it[3][0])}${st.ovr && st.ovr[tag(i)] ? " · contada como correcta" : ` <button class="btn ghost small" data-ovr="${i}">Mi respuesta es válida</button>`}</p>` : ""}</div>`).join("");
  else {
    const html = esc(part.text).replace(/\{(\d+)\}/g, (_, n) => {
      const i = +n - 1, v = vals[tag(i)] ?? "", ok = okOf(i);
      let ctl;
      if (part.type === "mcc") ctl = `<select class="gap ${fieldCls(i, ok)}" data-g="${i}" ${ck ? "disabled" : ""}><option value="">(${n})</option>${part.gaps[i][0].map((o, j) => `<option value="${j}" ${String(j) === String(v) ? "selected" : ""}>${"ABCD"[j]}) ${esc(o)}</option>`).join("")}</select>`;
      else ctl = `<input class="gap ${fieldCls(i, ok)}" data-g="${i}" placeholder="(${n})${part.type === "wf" ? " " + part.gaps[i][0] : ""}" value="${esc(v)}" ${ck ? "disabled" : ""} autocomplete="off" autocapitalize="off" spellcheck="false">`;
      const fix = ck && !ok ? `<span class="fixans">${esc(part.type === "mcc" ? part.gaps[i][0][part.gaps[i][1]] : part.type === "wf" ? part.gaps[i][1][0] : part.gaps[i][0])}</span>` : "";
      return `${ctl}${part.type === "wf" && !ck ? "" : ""}${fix}`;
    });
    body = `${part.type === "wf" ? `<div class="stems">${part.gaps.map((g, i) => `<span class="tag">(${i + 1}) ${esc(g[0])}</span>`).join(" ")}</div>` : ""}<div class="card mocktext">${html.split(/\n+/).map((p) => `<p>${p}</p>`).join("")}</div>`;
  }
  const count = part.type === "kwt" ? part.items.length : part.gaps.length;
  const correct = [...Array(count)].filter((_, i) => okOf(i) || (st.ovr && st.ovr[tag(i)])).length;
  m.innerHTML = `<div class="row between"><div><h1>${esc(mk.title)}</h1><div class="muted small">${info.title} · Parte ${st.part + 1} de ${mk.parts.length}</div></div><div class="row"><span class="chip" id="timer">⏱️ 0:00</span><button class="btn ghost small" id="exit">Salir</button></div></div>
  <div class="bar"><i style="width:${(st.part / mk.parts.length) * 100}%"></i></div>
  <div class="card note">${esc(info.instr)}</div>${body}
  ${ck ? `<div class="card center"><b>${correct} de ${count} correctas en esta parte</b></div><button class="btn wide" id="next">${st.part + 1 < mk.parts.length ? "Siguiente parte →" : "Ver resultado"}</button>` : `<button class="btn wide" id="check">Comprobar esta parte</button>`}`;
  const tick = () => { const s2 = Math.floor((Date.now() - st.start) / 1000); const el = $("#timer"); if (!el) return clearInterval(mockTimer); el.textContent = `⏱️ ${Math.floor(s2 / 60)}:${String(s2 % 60).padStart(2, "0")} / ${mk.minutes}:00`; el.classList.toggle("late", s2 > mk.minutes * 60); };
  tick(); mockTimer = setInterval(tick, 1000);
  $("#exit").onclick = () => { clearInterval(mockTimer); sub = null; render(); };
  $$("[data-g]", m).forEach((el) => { el.oninput = el.onchange = () => { vals[tag(+el.dataset.g)] = el.value; }; });
  $$("[data-ovr]", m).forEach((b) => b.onclick = () => { st.ovr = st.ovr || {}; st.ovr[tag(+b.dataset.ovr)] = true; const y = window.scrollY; render(); window.scrollTo(0, y); });
  if ($("#check")) $("#check").onclick = () => {
    st.checked = true;
    [...Array(count)].forEach((_, i) => { if (!okOf(i)) { const v = vals[tag(i)] || "(vacío)"; const right = part.type === "kwt" ? part.items[i][3][0] : part.type === "mcc" ? part.gaps[i][0][part.gaps[i][1]] : part.type === "wf" ? part.gaps[i][1][0] : part.gaps[i][0]; addMistake({ type: "Simulacro", wrong: part.type === "mcc" ? (part.gaps[i][0][+v] || "(vacío)") : v, right, note: `${mk.title} · ${info.title}${part.type === "kwt" ? " · " + part.items[i][0] : ""}` }); } });
    const y = window.scrollY; render(); window.scrollTo(0, y);
  };
  if ($("#next")) $("#next").onclick = () => { st.res.push({ c: correct, n: count }); st.part++; st.checked = false; render(); };
}

// ---------- INMERSIÓN ----------
let iTab = "plan";
const suggestedPhase = () => ({ A2: 1, B1: 3, B2: 4, C1: 5, C2: 5 }[S.level] || 1);
const curPhase = () => IMM_PHASES.find((p) => p.n === (S.immPhase || suggestedPhase())) || IMM_PHASES[0];
function weekBounds() { const now = new Date(), ws = new Date(now); ws.setDate(now.getDate() - ((now.getDay() + 6) % 7)); ws.setHours(0, 0, 0, 0); return ws; }
RENDER.inmersion = (m) => {
  m.innerHTML = `<h1>Inmersión</h1><p class="muted">La app te da la base; la inmersión (series, podcasts, lecturas y conversaciones reales) es lo que te lleva a C1. Sigue tu plan por fases y registra tu tiempo.</p>
  <div class="tabs">${[["plan", "Mi plan"], ["registro", "Registro"], ["guia", "Guía completa"], ["recursos", "Recursos"]].map(([k, l]) => `<button class="tab ${iTab === k ? "on" : ""}" data-t="${k}">${l}</button>`).join("")}</div><div id="ibody"></div>`;
  $$("[data-t]", m).forEach((b) => b.onclick = () => { iTab = b.dataset.t; render(); });
  const box = $("#ibody");
  ({ plan: immPlan, registro: immLog, guia: immGuide, recursos: immResources })[iTab](box, m);
};
function immLogForm() {
  return `<form id="imf" class="card"><h2>Registrar actividad</h2><div class="row"><select id="imt">${IMMERSION_TYPES.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select><select id="imd">${IMM_MODES.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select><input id="imm" type="number" min="1" max="600" placeholder="Minutos" required style="max-width:120px"></div><input id="imn" placeholder="¿Qué fue? (ej.: Friends T2E3, podcast de ciencia…)"><button class="btn">Guardar</button></form>`;
}
function bindLogForm(box) {
  $("#imf", box).onsubmit = (e) => { e.preventDefault(); const min = Math.max(1, Math.min(600, +$("#imm").value || 0)); if (!min) return; S.immersion.unshift({ d: Date.now(), type: $("#imt").value, mode: $("#imd").value, min, title: $("#imn").value.trim() }); S.immersion = S.immersion.slice(0, 500); addXP(Math.min(30, Math.round(min / 2))); render(); };
}
function immPlan(box) {
  const ph = curPhase(), ws = weekBounds();
  const week = S.immersion.filter((x) => new Date(x.d) >= ws);
  const weekMin = week.reduce((a, x) => a + x.min, 0), goal = ph.minutes * 7;
  const days = [...Array(7)].map((_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); const k = d.toDateString(); const min = week.filter((x) => new Date(x.d).toDateString() === k).reduce((a, x) => a + x.min, 0); return { l: d.toLocaleDateString("es-CO", { weekday: "narrow" }), min, today: k === new Date().toDateString() }; });
  if (!S.immDaily || S.immDaily.day !== today()) S.immDaily = { day: today(), done: [] };
  const crit = (S.immCrit && S.immCrit[ph.n]) || [];
  const allCrit = ph.criteria.every((_, i) => crit[i]);
  const next = IMM_PHASES.find((p) => p.n === ph.n + 1);
  box.innerHTML = `
  <div class="card hero"><div class="row between"><div><div class="muted small">${esc(ph.level)} · ${esc(ph.weeks)}</div><h2 style="margin:4px 0">${esc(ph.title)}</h2></div><span class="chip lvl">${ph.minutes} min/día</span></div>
    <p>${esc(ph.goal)}</p>
    <div class="label">Esta semana: ${weekMin} de ${goal} minutos</div><div class="bar big"><i style="width:${Math.min(100, (weekMin / goal) * 100)}%"></i></div>
    <div class="weekdots">${days.map((d) => `<div class="wd ${d.min >= ph.minutes ? "full" : d.min ? "part" : ""} ${d.today ? "today" : ""}" title="${d.min} min"><span>${d.l}</span><small>${d.min || ""}</small></div>`).join("")}</div>
    ${S.immPhase ? "" : `<p class="muted small">Fase sugerida según tu nivel (${S.level}). Puedes cambiarla abajo.</p>`}</div>
  <div class="card"><h2>✅ Tu rutina de hoy</h2><p class="muted small">Haz estos pasos en orden; marca cada uno al terminarlo.</p>
    ${ph.routine.map((r, i) => `<label class="cando"><input type="checkbox" data-r="${i}" ${S.immDaily.done[i] ? "checked" : ""}> <span><b>Paso ${i + 1}.</b> ${esc(r)}</span></label>`).join("")}</div>
  ${immLogForm()}
  <div class="card"><h2>📺 Qué ver, escuchar y leer en esta fase</h2><ul>${ph.content.map((c) => `<li>${esc(c)}</li>`).join("")}</ul><button class="btn ghost small" data-go2="recursos">Ver recursos gratuitos con enlaces</button></div>
  <div class="card note"><h3 style="margin-top:0">💡 Claves de esta fase</h3><ul>${ph.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
  <div class="card"><h2>🚀 ¿Listo para la siguiente fase?</h2><p class="muted small">Marca solo lo que de verdad ya puedes hacer. Cuando cumplas todo, pasa a la siguiente fase.</p>
    ${ph.criteria.map((c, i) => `<label class="cando"><input type="checkbox" data-c="${i}" ${crit[i] ? "checked" : ""}> ${esc(c)}</label>`).join("")}
    ${next ? `<button class="btn" id="nextph" ${allCrit ? "" : "disabled"}>Pasar a ${esc(next.title.split(" · ")[0])}</button>` : `<p><b>🏁 Estás en la fase final.</b> Mantén el hábito: el inglés de C1 se conserva usándolo todos los días.</p>`}
    <div class="row"><label class="small muted">Cambiar de fase manualmente:</label><select id="phsel" style="max-width:280px">${IMM_PHASES.map((p) => `<option value="${p.n}" ${p.n === ph.n ? "selected" : ""}>${esc(p.title)}</option>`).join("")}</select></div></div>`;
  $$("[data-r]", box).forEach((c) => c.onchange = () => {
    S.immDaily.done[+c.dataset.r] = c.checked;
    if (ph.routine.every((_, i) => S.immDaily.done[i]) && !S.immDaily.rewarded) { S.immDaily.rewarded = true; addXP(10); toast("🎉 Rutina de inmersión completada"); } else save();
  });
  $$("[data-c]", box).forEach((c) => c.onchange = () => { S.immCrit = S.immCrit || {}; S.immCrit[ph.n] = S.immCrit[ph.n] || []; S.immCrit[ph.n][+c.dataset.c] = c.checked; save(); const y = window.scrollY; render(); window.scrollTo(0, y); });
  if ($("#nextph")) $("#nextph").onclick = () => { S.immPhase = next.n; S.immDaily = { day: today(), done: [] }; addXP(30); save(); toast("🚀 ¡Nueva fase de inmersión!"); render(); };
  $("#phsel").onchange = (e) => { S.immPhase = +e.target.value; save(); render(); };
  $$("[data-go2]", box).forEach((b) => b.onclick = () => { iTab = b.dataset.go2; render(); });
  bindLogForm(box);
}
function immLog(box) {
  const ws = weekBounds();
  const week = S.immersion.filter((x) => new Date(x.d) >= ws).reduce((a, x) => a + x.min, 0);
  const total = S.immersion.reduce((a, x) => a + x.min, 0);
  const by = (key, list) => { const acc = S.immersion.reduce((a, x) => { if (x[key]) a[x[key]] = (a[x[key]] || 0) + x.min; return a; }, {}); return list.filter(([k]) => acc[k]).map(([k, l]) => `<div class="sk"><span>${l}</span><div class="bar"><i style="width:${(acc[k] / total) * 100}%"></i></div><small>${acc[k]} min</small></div>`).join(""); };
  box.innerHTML = `<div class="stats"><div class="card stat"><b>${week}</b><small>Minutos esta semana</small></div><div class="card stat"><b>${(total / 60).toFixed(1)}</b><small>Horas totales</small></div><div class="card stat"><b>${S.immersion.length}</b><small>Registros</small></div></div>
  ${immLogForm()}
  ${total ? `<div class="card"><h2>Por tipo de contenido</h2>${by("type", IMMERSION_TYPES)}</div><div class="card"><h2>Por técnica</h2>${by("mode", IMM_MODES) || `<p class="muted small">Elige la técnica al registrar para ver aquí cómo repartes tu tiempo.</p>`}<p class="muted small">Ideal: mezcla técnicas activas (3 pasadas, shadowing, resumen) con mucha escucha relajada.</p></div>` : ""}
  ${S.immersion.length ? `<h2>Últimos registros</h2><div class="card list">${S.immersion.slice(0, 30).map((x, i) => `<div class="li"><div><b>${esc((IMMERSION_TYPES.find((t) => t[0] === x.type) || ["", x.type])[1])}</b> · ${x.min} min${x.mode ? ` · <span class="tag">${esc((IMM_MODES.find((t) => t[0] === x.mode) || ["", x.mode])[1])}</span>` : ""}<div class="muted small">${new Date(x.d).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}${x.title ? " · " + esc(x.title) : ""}</div></div><button class="btn ghost small" data-del="${i}">✕</button></div>`).join("")}</div>` : ""}`;
  bindLogForm(box);
  $$("[data-del]", box).forEach((b) => b.onclick = () => { S.immersion.splice(+b.dataset.del, 1); save(); render(); });
}
function immGuide(box) {
  const cur = curPhase().n;
  box.innerHTML = `<div class="card note"><b>La idea general:</b> empiezas con contenido para estudiantes y subtítulos en inglés, vas quitando el apoyo poco a poco y terminas viviendo en inglés. Cada fase dura semanas o meses: avanza cuando cumplas los criterios, no por calendario.</div>
  <h2>Las 5 fases</h2>${IMM_PHASES.map((p) => `<details class="card phase ${p.n === cur ? "curph" : ""}" ${p.n === cur ? "open" : ""}><summary><b>${esc(p.title)}</b> <span class="tag">${esc(p.level)}</span> <span class="muted small">${esc(p.weeks)} · ${p.minutes} min/día</span>${p.n === cur ? ` <span class="tag">← estás aquí</span>` : ""}</summary>
    <p>${esc(p.goal)}</p><h3>Rutina diaria</h3><ol>${p.routine.map((r) => `<li>${esc(r)}</li>`).join("")}</ol><h3>Contenido</h3><ul>${p.content.map((c) => `<li>${esc(c)}</li>`).join("")}</ul><h3>Pasas a la siguiente fase cuando…</h3><ul>${p.criteria.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></details>`).join("")}
  <h2>Técnicas</h2>${IMM_TECHNIQUES.map((t) => `<details class="card"><summary><b>${esc(t.title)}</b></summary><p>${esc(t.body)}</p></details>`).join("")}`;
}
function immResources(box) {
  const lvls = [S.level, LEVELS[lvlIdx(S.level) + 1]].filter(Boolean);
  box.innerHTML = `${lvls.map((lv) => `<h2>Para ${lv}</h2><div class="lessons">${(RESOURCES[lv] || []).map((r) => `<div class="lesson static"><span class="num">${esc(r.type.slice(0, 2))}</span><span><b>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a>` : esc(r.name)}</b><small>${esc(r.desc)}</small></span></div>`).join("")}</div>`).join("")}
  <div class="card note"><b>Consejos:</b><ul><li>Subtítulos en <b>inglés</b>, nunca en español.</li><li>Mejor 20 minutos todos los días que 3 horas el domingo.</li><li>Elige contenido que te guste de verdad.</li><li>Pega transcripciones o artículos en <b>Leer → Mi lector</b> para sacar vocabulario.</li></ul></div>`;
}

// ---------- LECTOR CON DICCIONARIO ----------
let lookupCache = {};
try { lookupCache = JSON.parse(localStorage.getItem("ingles-lookup") || "{}"); } catch (e) {}
function cacheLookup(k, v) { lookupCache[k] = v; try { const keys = Object.keys(lookupCache); if (keys.length > 400) keys.slice(0, 100).forEach((x) => delete lookupCache[x]); localStorage.setItem("ingles-lookup", JSON.stringify(lookupCache)); } catch (e) {} }
async function translateText(q) {
  const k = "tr:" + q.toLowerCase(); if (lookupCache[k]) return lookupCache[k];
  const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|es${S.settings.mmEmail ? "&de=" + encodeURIComponent(S.settings.mmEmail) : ""}`);
  const d = await r.json();
  if (d.responseStatus && +d.responseStatus !== 200) throw new Error(String(d.responseDetails || "Límite diario de traducción alcanzado"));
  const t = d.responseData && d.responseData.translatedText; if (!t) throw new Error("Sin traducción");
  cacheLookup(k, t); return t;
}
async function defineWord(w) {
  const k = "df:" + w; if (lookupCache[k]) return lookupCache[k];
  const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`);
  if (r.status === 404) { cacheLookup(k, { none: true }); return { none: true }; }
  const d = await r.json(); const e = d[0] || {};
  const out = { phonetic: e.phonetic || (e.phonetics || []).map((p) => p.text).find(Boolean) || "", audio: ((e.phonetics || []).find((p) => p.audio) || {}).audio || "", meanings: (e.meanings || []).slice(0, 3).map((mm) => ({ pos: mm.partOfSpeech, defs: mm.definitions.slice(0, 2).map((x) => ({ d: x.definition, ex: x.example })) })) };
  cacheLookup(k, out); return out;
}
const POS_ES = { noun: "sustantivo", verb: "verbo", adjective: "adjetivo", adverb: "adverbio", preposition: "preposición", conjunction: "conjunción", pronoun: "pronombre", interjection: "interjección" };
function closeLookup() { const p = $("#lookup"); if (p) p.remove(); }
function sentenceOf(text, idx) { const before = text.lastIndexOf(".", idx), b2 = Math.max(before, text.lastIndexOf("!", idx), text.lastIndexOf("?", idx), text.lastIndexOf("\n", idx)); const after = text.slice(idx).search(/[.!?\n]/); return text.slice(b2 + 1, after < 0 ? undefined : idx + after + 1).trim(); }
function knownSet() { const s = new Set(); allCards().forEach((c) => { if (S.cards[c.id]) c.en.toLowerCase().split(/\s+/).length === 1 && s.add(c.en.toLowerCase()); }); return s; }
function readerHTML(text) {
  const known = knownSet(); let pos = 0;
  return text.split(/\n+/).map((para) => {
    const start = text.indexOf(para, pos); pos = start + para.length;
    return `<p>${para.replace(/([A-Za-z][A-Za-z'’-]*)|([^A-Za-z]+)/g, (mt, w, o, off) => w ? `<span class="rw ${known.has(w.toLowerCase().replace(/[’']s$/, "")) ? "known" : ""}" data-i="${start + off}">${esc(w)}</span>` : esc(o))}</p>`;
  }).join("");
}
async function openLookup(word, sentence) {
  closeLookup();
  const w = word.toLowerCase().replace(/[’']s$/, "").replace(/[’']/g, "'");
  const local = allCards().find((c) => c.en.toLowerCase() === w);
  const el = document.createElement("div"); el.id = "lookup"; el.className = "lookup";
  el.innerHTML = `<div class="row between"><div>${picHTML(local ? local.en : w, "lst")}<b class="lw">${esc(w)}</b> <span id="lph" class="muted"></span> ${speakBtn(w)} <button class="icon-btn" id="lau" hidden>🔈 Audio real</button></div><button class="icon-btn" id="lx">✕</button></div>${pronHTML(w, { tips: true })}${photoHTML(local ? local.en : w)}
    <div id="les" class="les">${local ? `<b>${esc(local.es)}</b> <span class="tag">${local.level === "MIS" ? "tus tarjetas" : local.level}</span>` : `<span class="muted">Traduciendo…</span>`}</div>
    <div id="ldef" class="small"></div>
    <div class="row"><button class="btn small" id="ladd">+ Tarjeta</button><button class="btn ghost small" id="lsent">Traducir la frase</button></div><div id="lsout" class="small"></div>`;
  document.body.appendChild(el);
  $("#lx").onclick = closeLookup;
  let es = local ? local.es : "";
  $("#ladd").onclick = () => { if (local) { toast("Ya está en tus tarjetas"); return; } addCustomCard(w, es || "(ver definición)", sentence); $("#ladd").textContent = "✓ Agregada"; $("#ladd").disabled = true; };
  $("#lsent").onclick = async () => { $("#lsout").textContent = "Traduciendo…"; try { $("#lsout").innerHTML = `<i>${esc(sentence)}</i><br>→ ${esc(await translateText(sentence))}${csBox(sentence, true)}`; } catch (e) { $("#lsout").textContent = "No se pudo traducir: " + e.message; } };
  if (inClaude()) { $("#ldef").innerHTML = `<span class="muted">El diccionario en línea funciona en tu versión publicada (GitHub Pages). Aquí solo se muestran las palabras de la app.</span>`; if (!local) $("#les").innerHTML = ""; return; }
  if (!local) translateText(w).then((t) => { es = t; if ($("#les")) $("#les").innerHTML = `<b>${esc(t)}</b> <span class="muted small">(traducción automática)</span>`; }).catch((e) => { if ($("#les")) $("#les").innerHTML = `<span class="muted">Sin traducción: ${esc(e.message)}</span>`; });
  try {
    const d = await defineWord(w); if (!$("#ldef")) return;
    if (d.none) { $("#ldef").innerHTML = `<span class="muted">No está en el diccionario (puede ser un nombre propio o una forma conjugada; prueba con la forma base).</span>`; return; }
    if (d.phonetic && !phonFor(w)) $("#lph").textContent = d.phonetic;
    if (d.audio) { const b = $("#lau"); b.hidden = false; b.onclick = () => { try { new Audio(d.audio).play(); } catch (e) {} }; }
    $("#ldef").innerHTML = d.meanings.map((mm) => `<div><span class="tag">${esc(POS_ES[mm.pos] || mm.pos)}</span> ${mm.defs.map((x) => `${esc(x.d)}${x.ex ? ` <i class="muted">“${esc(x.ex)}”</i>` : ""}`).join("<br>")}</div>`).join("");
  } catch (e) { if ($("#ldef")) $("#ldef").innerHTML = `<span class="muted">Diccionario no disponible (¿sin internet?).</span>`; }
}
function readerPage(m, t) {
  m.innerHTML = `<div class="row between"><h1>${esc(t.title)}</h1><button class="btn ghost small" id="back">← Mis textos</button></div>
  <p class="muted small">Toca cualquier palabra para ver su significado, escucharla y agregarla a tus tarjetas. Las <span class="rw known">subrayadas en verde</span> ya están en tus tarjetas.</p>
  <div class="card reading reader">${speakBtn(t.text.slice(0, 1900), "🔊 Escuchar")}${readerHTML(t.text)}</div>
  <div class="row"><button class="btn" id="done">✓ Terminé de leer</button><button class="btn ghost small" id="del">Borrar texto</button></div><div id="cb"></div>`;
  $("#back").onclick = () => { closeLookup(); sub = null; render(); };
  $$(".reader .rw", m).forEach((s) => s.onclick = () => { $$(".reader .rw.sel", m).forEach((x) => x.classList.remove("sel")); s.classList.add("sel"); openLookup(s.textContent, sentenceOf(t.text, +s.dataset.i)); });
  $("#done").onclick = () => { if (!t.read) { t.read = true; skill("reading", 1, 1); if (extraTask().go === "leer") markDaily("extra"); addXP(Math.min(25, Math.round(t.text.split(/\s+/).length / 25))); } closeLookup(); sub = null; render(); };
  $("#del").onclick = () => confirmBox($("#cb"), "¿Borrar este texto?", () => { S.texts = S.texts.filter((x) => x !== t); save(); closeLookup(); sub = null; render(); });
}
function myTextsView(box, m) {
  const used = S.texts.reduce((a, x) => a + x.text.length, 0);
  box.innerHTML = `<p class="muted">Pega cualquier texto en inglés (una noticia, un artículo, la letra de una canción tuya, un correo del trabajo) y léelo con diccionario integrado. Es la forma de llevar tu vocabulario a nivel C1.</p>
  <form id="nf" class="card"><input id="nt" placeholder="Título" maxlength="80"><textarea id="nx" rows="6" placeholder="Pega aquí el texto en inglés…"></textarea><button class="btn">Abrir en el lector</button><span class="muted small"> Espacio usado: ${Math.round(used / 1000)}k de 120k caracteres</span></form>
  ${S.texts.length ? `<div class="lessons">${S.texts.map((x, i) => `<button class="lesson" data-i="${i}"><span class="num">📄</span><span><b>${esc(x.title)}</b><small>~${x.text.split(/\s+/).length} palabras${x.read ? " · Leído" : ""}</small></span><span class="st">${x.read ? "✅" : ""}</span></button>`).join("")}</div>` : ""}`;
  $("#nf").onsubmit = (e) => {
    e.preventDefault(); const text = $("#nx").value.trim().slice(0, 15000); if (text.length < 20) { toast("Pega un texto un poco más largo"); return; }
    if (used + text.length > 120000) { toast("Sin espacio: borra algún texto antiguo"); return; }
    const t = { id: Date.now(), title: $("#nt").value.trim() || text.split(/\s+/).slice(0, 6).join(" ") + "…", text, at: Date.now() };
    S.texts.unshift(t); save(); sub = { text: t }; render();
  };
  $$("[data-i]", box).forEach((b) => b.onclick = () => { sub = { text: S.texts[+b.dataset.i] }; render(); });
}

// ---------- CORRECTOR (LanguageTool) ----------
async function languageTool(text) {
  const r = await fetch("https://api.languagetool.org/v2/check", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ text, language: "en-US", motherTongue: "es" }) });
  if (r.status === 429) throw new Error("Demasiadas revisiones seguidas. Espera un minuto.");
  if (!r.ok) throw new Error("El corrector no respondió (" + r.status + ")");
  return (await r.json()).matches || [];
}
function ltPanel(m, t, w) {
  const box = $("#ltbox"); let matches = [];
  const draw = () => {
    if (!matches.length) { box.innerHTML = `<div class="feedback good"><b>✓ El corrector no encontró errores.</b> <span class="small">Ojo: revisa gramática y ortografía, no si el texto es natural o tiene buen estilo. Compáralo también con el modelo.</span></div>`; return; }
    box.innerHTML = `<div class="card"><h3>El corrector encontró ${matches.length} posible(s) problema(s)</h3>${matches.map((mt, i) => { const ctx = mt.context; const bad = ctx.text.substr(ctx.offset, ctx.length); return `<div class="ltm"><div>…${esc(ctx.text.slice(0, ctx.offset))}<mark>${esc(bad)}</mark>${esc(ctx.text.slice(ctx.offset + ctx.length))}…</div><div class="small">${esc(mt.message)}</div>${mt.replacements.length ? `<div class="row">${mt.replacements.slice(0, 3).map((r, j) => `<button class="btn ghost small" data-fix="${i}" data-r="${j}">→ ${esc(r.value || "(borrar)")}</button>`).join("")}<button class="btn ghost small" data-ign="${i}">Ignorar</button></div>` : `<button class="btn ghost small" data-ign="${i}">Ignorar</button>`}</div>`; }).join("")}</div>`;
    $$("[data-fix]", box).forEach((b) => b.onclick = () => {
      const i = +b.dataset.fix, mt = matches[i], rep = mt.replacements[+b.dataset.r].value, v = t.value;
      if (v.substr(mt.offset, mt.length) !== mt.context.text.substr(mt.context.offset, mt.context.length)) { toast("El texto cambió; vuelve a revisar"); return; }
      t.value = v.slice(0, mt.offset) + rep + v.slice(mt.offset + mt.length);
      const delta = rep.length - mt.length; matches.splice(i, 1); matches.forEach((x) => { if (x.offset > mt.offset) x.offset += delta; });
      t.oninput && t.oninput(); draw();
    });
    $$("[data-ign]", box).forEach((b) => b.onclick = () => { matches.splice(+b.dataset.ign, 1); draw(); });
  };
  return async () => {
    const text = t.value.trim(); if (text.split(/\s+/).length < 5) { toast("Escribe algo primero"); return; }
    if (inClaude()) { box.innerHTML = `<div class="card note">El corrector automático funciona en tu versión publicada (GitHub Pages). Dentro de Claude no puede conectarse a servicios externos.</div>`; return; }
    const btn = $("#lt"); btn.disabled = true; box.innerHTML = `<p class="muted">Revisando…</p>`;
    try {
      matches = (await languageTool(t.value)).filter((x) => x.rule && x.rule.issueType !== "whitespace");
      matches.filter((x) => x.replacements.length).slice(0, 8).forEach((x) => addMistake({ type: "Escritura", wrong: t.value.substr(x.offset, x.length), right: x.replacements[0].value, note: x.message }));
      skill("writing", matches.length ? 0 : 1, 1); draw();
    } catch (e) { box.innerHTML = `<p class="err">${esc(e.message)}</p>`; }
    setTimeout(() => { if ($("#lt")) $("#lt").disabled = false; }, 4000);
  };
}

// ---------- SONIDOS (pronunciación) ----------
function pronList(box) {
  box.innerHTML = `<p class="muted">Los sonidos que más les cuestan a los hispanohablantes. Escucha, distingue y luego grábate para compararte con el modelo.</p>
  <div class="lessons">${PRON.map((u) => { const r = S.pron[u.id]; return `<button class="lesson" data-u="${u.id}"><span class="num">${{ pairs: "👂", class: "🔤", stress: "📢", shadow: "🗣️" }[u.type]}</span><span><b>${esc(u.title)}</b><small>${{ pairs: "Pares mínimos", class: "Clasificar sonidos", stress: "Acento", shadow: "Escucha y repite" }[u.type]}${r !== undefined ? ` · Mejor: ${Math.round(r * 100)}%` : ""}</small></span><span class="st">${r >= 0.8 ? "✅" : ""}</span></button>`; }).join("")}</div>`;
  $$("[data-u]", box).forEach((b) => b.onclick = () => { sub = { pron: PRON.find((u) => u.id === b.dataset.u) }; render(); });
}
function pronPage(m, u) {
  let extra = "";
  if (u.type === "pairs") extra = `<div class="card"><h3>Escucha cada par</h3><div class="pairs">${u.pairs.map(([a, b], i) => `<div class="pair">${speakBtn(a, esc(a))}<span class="muted">vs</span>${speakBtn(b, esc(b))}${recorderHTML("pp" + i)}</div>`).join("")}</div></div>`;
  if (u.type === "class") extra = `<div class="card"><h3>Ejemplos</h3><div class="chips">${u.items.slice(0, 9).map(([w, k]) => `<button class="chipbtn" data-speak="${esc(w)}">${esc(w)} <small class="muted">${u.options[k].split(" ")[0]}</small></button>`).join("")}</div></div>`;
  if (u.type === "stress") extra = `<div class="card"><h3>Ejemplos</h3><div class="chips">${u.items.slice(0, 8).map(([w, syl, k]) => `<button class="chipbtn" data-speak="${esc(w.replace(/\s*\(.*\)/, ""))}">${syl.map((x, j) => j === k ? `<b>${esc(x.toUpperCase())}</b>` : esc(x)).join("·")}</button>`).join("")}</div></div>`;
  if (u.type === "shadow") extra = `<div class="card"><h3>Escucha, repite y grábate</h3>${u.lines.map((l, i) => `<div class="li shadowline"><div>${esc(l)}${csBox(l, false)}</div><div class="row">${speakBtn(l)}<button class="icon-btn" data-speak="${esc(l)}" data-rate="0.7">🐢</button>${recorderHTML("sh" + i)}</div></div>`).join("")}<p class="muted small">Graba, escúchate y compara con el modelo: ¿el ritmo y la entonación se parecen? Repite hasta que suene natural.</p></div>`;
  m.innerHTML = `<div class="row between"><h1>${esc(u.title)}</h1><button class="btn ghost small" id="back">← Sonidos</button></div><div class="card explain">${u.explain}</div>${extra}
  ${u.type !== "shadow" ? `<button class="btn big-btn" id="quiz">Practicar: ¿lo distingues? (${u.type === "pairs" ? 12 : Math.min(12, u.items.length)} preguntas)</button>` : `<button class="btn" id="done">✓ Practiqué esta unidad</button>`}`;
  $("#back").onclick = () => { sub = null; render(); };
  $$(".explain i", m).forEach((it) => { it.classList.add("sp"); it.onclick = () => speak(it.textContent); });
  bindRecorders(m);
  if ($("#done")) $("#done").onclick = () => { S.pron[u.id] = 1; skill("speaking", 1, 1); addXP(8); sub = null; render(); };
  if ($("#quiz")) $("#quiz").onclick = () => pronQuiz(m, u);
}
function pronQuiz(m, u) {
  let qs = [];
  if (u.type === "pairs") qs = [...Array(12)].map(() => { const p = pick(u.pairs), say = pick(p); return { prompt: "¿Qué palabra escuchaste?", say, options: p, ans: p.indexOf(say) }; });
  if (u.type === "class") qs = shuffle(u.items).slice(0, 12).map(([w, k]) => ({ prompt: `“${w}”: ¿cómo suena la terminación?`, say: w, options: u.options, ans: k }));
  if (u.type === "stress") qs = shuffle(u.items).slice(0, 12).map(([w, syl, k]) => ({ prompt: `¿Qué sílaba lleva el acento en “${w}”?`, say: w.replace(/\s*\(.*\)/, ""), options: syl.map((x) => x.toUpperCase()), ans: k }));
  let i = 0, c = 0;
  const show = () => {
    const q = qs[i];
    if (!q) { const p = c / qs.length; S.pron[u.id] = Math.max(S.pron[u.id] || 0, p); skill("listening", c, qs.length); addXP(c * 2);
      m.innerHTML = `<div class="card center"><div class="big">${p >= 0.8 ? "👂✨" : "👂"}</div><h2>${c} de ${qs.length}</h2><p>${p >= 0.8 ? "¡Tu oído distingue bien estos sonidos!" : "Escucha otra vez los pares, exagera las diferencias al repetir y vuelve a intentarlo."}</p><div class="row center"><button class="btn" id="again">Repetir</button><button class="btn ghost" id="back">Volver</button></div></div>`;
      $("#again").onclick = () => pronQuiz(m, u); $("#back").onclick = () => render(); return; }
    m.innerHTML = `<div class="row between"><h1>${esc(u.title)}</h1><button class="btn ghost small" id="exit">Salir</button></div><div class="bar"><i style="width:${(i / qs.length) * 100}%"></i></div><div class="muted small">${i + 1}/${qs.length}</div>
    <div class="card excard center"><p class="q">${esc(q.prompt)}</p><div class="row center"><button class="btn big-btn" id="play">🔊 Escuchar</button><button class="btn ghost" id="slow">🐢</button></div><div class="opts">${q.options.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div><div id="fb"></div></div>`;
    $("#exit").onclick = () => render();
    $("#play").onclick = () => speak(q.say); $("#slow").onclick = () => speak(q.say, 0.65);
    setTimeout(() => speak(q.say), 250);
    let done = false;
    $$(".opt", m).forEach((b) => b.onclick = () => {
      if (done) return; done = true; const k = +b.dataset.k, ok = k === q.ans; if (ok) c++;
      b.classList.add(ok ? "right" : "wrong"); $$(".opt", m)[q.ans].classList.add("right");
      $("#fb").innerHTML = `<div class="feedback ${ok ? "good" : "bad"}"><b>${ok ? "¡Correcto!" : "Era: " + esc(q.options[q.ans])}</b> ${u.type === "pairs" ? q.options.map((o) => speakBtn(o, "🔊 " + esc(o))).join(" ") : speakBtn(q.say)}</div><button class="btn wide" id="nx">Continuar</button>`;
      $("#nx").onclick = () => { i++; show(); };
    });
  };
  show();
}

// ---------- VERBOS IRREGULARES ----------
function irrCard(m, it, key, isNew) {
  const v = it.c, r = vq.typed;
  const nextCard = (q) => { grade(key, q); vq.done++; if (q < 3) vq.list.push(it); vq.i++; vq.flipped = false; vq.typed = null; render(); };
  m.innerHTML = `<div class="row between"><h1>Tarjetas</h1><button class="btn ghost small" id="lst">📚 Ver todas</button></div><div class="muted small">${vq.i + 1}/${vq.list.length} · ${isNew ? "Nuevo" : "Repaso"} · Verbo irregular · ${v.level}</div>
  <div class="flash rev"><div class="label">Escribe el pasado y el participio</div>${picHTML(v.base, "big")}<div class="word">${esc(v.base)}</div>${speakBtn(v.base)}${pronHTML(v.base)}<div class="muted">${esc(v.es)}</div>
  ${r ? `<div class="irrres"><span class="${r.okP ? "ok" : "miss"}">${r.okP ? "✓" : "✗"} ${esc(v.past.replace("/", " / "))}</span><span class="${r.okPP ? "ok" : "miss"}">${r.okPP ? "✓" : "✗"} ${esc(v.pp.replace("/", " / "))}</span></div>` :
  `<form id="irf" class="irrform"><label>Pasado<input id="irp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="pasado"></label><label>Participio<input id="irpp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="participio"></label><button class="btn">Comprobar</button></form><button class="btn ghost small" id="idk">No lo sé</button>`}</div>
  ${r ? `<div class="feedback ${r.okP && r.okPP ? "good" : "bad"}"><b>${esc(irrForms(v))}</b> ${speakBtn(irrSay(v), "🔊 Escuchar las 3 formas")}${pronHTML([v.base, firstForm(v.past), firstForm(v.pp)].join(" "))}${!(r.okP && r.okPP) && r.given ? `<div class="small">Escribiste: ${esc(r.given)}</div>` : ""}<div class="small muted">Patrón: ${esc(IRR_PATTERNS[irrPattern(v)])}</div></div>
    ${r.okP && r.okPP ? `<div class="grades three"><button class="btn orange" data-q="3">Difícil<small>${intervalLabel(key, 3)}</small></button><button class="btn" data-q="4">Bien<small>${intervalLabel(key, 4)}</small></button><button class="btn green" data-q="5">Fácil<small>${intervalLabel(key, 5)}</small></button></div>` : `<div class="row"><button class="btn" data-q="1">Continuar</button><button class="btn ghost small" data-q="3">Lo tenía bien (error de tipeo)</button></div>`}` : ""}`;
  $("#lst").onclick = () => { sub = "list"; vlFilter.lv = "IRR"; render(); };
  document.onkeydown = null;
  if (!r) {
    $("#irp").focus();
    $("#irf").onsubmit = (e) => {
      e.preventDefault(); const p = $("#irp").value.trim(), pp = $("#irpp").value.trim();
      if (!p || !pp) { (!p ? $("#irp") : $("#irpp")).focus(); return; }
      vq.typed = { okP: formOK(v.past, p), okPP: formOK(v.pp, pp), given: `${p} – ${pp}` };
      if (!(vq.typed.okP && vq.typed.okPP)) addMistake({ type: "Verbos irregulares", wrong: `${v.base} – ${p} – ${pp}`, right: irrForms(v).replace(/ \/ [^ ]+/g, ""), note: v.es });
      render(); speak(irrSay(v));
    };
    $("#idk").onclick = () => { vq.typed = { okP: false, okPP: false, given: "" }; render(); speak(irrSay(v)); };
  }
  $$("[data-q]", m).forEach((b) => b.onclick = () => nextCard(+b.dataset.q));
}
function irrList(m) {
  const tabs = `<div class="tabs">${LEVELS.map((l) => `<button class="tab" data-l="${l}">${l}${S.unlocked.includes(l) ? "" : " 🔒"}</button>`).join("")}<button class="tab" data-l="MIS">Mías (${S.custom.length})</button><button class="tab on" data-l="IRR">Irregulares (${IRREG.length})</button></div>`;
  const avail = IRREG.filter((v) => lvlIdx(v.level) <= lvlIdx(S.level));
  const learned = avail.filter((v) => S.cards[v.id] && S.cards[v.id].reps >= 2).length;
  const groups = Object.keys(IRR_PATTERNS).map((p) => [p, IRREG.filter((v) => irrPattern(v) === p)]);
  m.innerHTML = `<div class="row between"><h1>Vocabulario</h1><button class="btn ghost small" id="back">← Repasar</button></div>${tabs}
  <div class="card hero"><h2>Verbos irregulares</h2><p class="muted small">Cada día entran ${IRR_NEW_PER_DAY} verbos nuevos a tus tarjetas: ves el verbo y escribes el pasado y el participio. Aprenderlos por <b>patrones</b> (abajo) es mucho más fácil que de memoria uno por uno.</p>
    <div class="bar"><i style="width:${pct(learned, avail.length)}%"></i></div><div class="small muted">${learned} de ${avail.length} aprendidos hasta ${S.level}${avail.length < IRREG.length ? ` · ${IRREG.length - avail.length} más al subir de nivel` : ""}</div>
    <div class="row"><button class="btn" id="quick">⚡ Práctica rápida (12)</button></div></div>
  ${groups.map(([p, list]) => `<h2>${esc(IRR_PATTERNS[p])}</h2><div class="card list">${list.map((v) => { const st = S.cards[v.id], ok = lvlIdx(v.level) <= lvlIdx(S.level); return `<div class="li ${ok ? "" : "dim"}">${picHTML(v.base, "lst")}<div><b>${esc(irrForms(v))}</b>${pronHTML([v.base, firstForm(v.past), firstForm(v.pp)].join(" "))}<div class="muted small">${esc(v.es)}</div></div>${speakBtn(irrSay(v))}<span class="tag">${v.level}</span><span class="tag">${st ? (st.reps >= 2 ? "Aprendido" : "En curso") : "Nuevo"}</span></div>`; }).join("")}</div>`).join("")}`;
  $("#back").onclick = () => { sub = null; vlFilter.lv = null; render(); };
  $$("[data-l]", m).forEach((b) => b.onclick = () => { vlFilter = { q: vlFilter.q, lv: b.dataset.l, topic: "" }; render(); });
  $("#quick").onclick = () => {
    const pool = shuffle(avail).slice(0, 12);
    const items = pool.map((v, k) => k % 2 ? ["fill", `${v.base} – ${firstForm(v.past)} – ___ (${v.es})`, v.pp.split("/"), `Participio · ${irrForms(v)}`] : ["fill", `${v.base} – ___ – ${firstForm(v.pp)} (${v.es})`, v.past.split("/"), `Pasado · ${irrForms(v)}`]);
    exerciseRunner(m, items, { title: "Verbos irregulares", subtitle: "Escribe la forma que falta", onExit: () => render(), onFinish: (c, n, wrongs) => {
      wrongs.forEach((w) => addMistake({ type: "Verbos irregulares", wrong: w.given, right: w.answer, note: w.why }));
      skill("grammar", c, n); addXP(c * 2);
      m.innerHTML = `<div class="card center"><div class="big">${c / n >= 0.8 ? "💪" : "🔁"}</div><h2>${c} de ${n}</h2><p>${c / n >= 0.8 ? "¡Muy bien!" : "Repasa los patrones y vuelve a intentarlo."}</p><button class="btn" id="ok">Volver</button></div>`; $("#ok").onclick = () => render();
    } });
  };
}

// ---------- AJUSTES DE VOZ ----------
const ACCENTS = { US: "Estados Unidos", GB: "Reino Unido", AU: "Australia", CA: "Canadá", IE: "Irlanda", IN: "India", NZ: "Nueva Zelanda", ZA: "Sudáfrica", SC: "Escocia" };
const accentOf = (lang) => { const m = String(lang).match(/[-_]([A-Za-z]{2})/); return m ? ACCENTS[m[1].toUpperCase()] || m[1].toUpperCase() : "Inglés"; };
const VOICE_ROLES = [["A", "Voz principal", "Palabras, frases, ejercicios y la persona A de los diálogos"], ["B", "Segunda voz", "Persona B de los diálogos y tu interlocutor en las conversaciones guiadas"], ["C", "Tercera voz", "Persona C de los diálogos"]];
function voiceSettingsHTML() {
  const vs = rankedVoices(), pref = voicePrefs();
  const hqN = audioIndex ? audioIndex.size : 0;
  return `<div class="card"><h2>🔊 Voz y audio</h2>
    <label class="cando"><input type="checkbox" id="hq" ${S.settings.hq === false ? "" : "checked"}> <span><b>Usar audios de alta calidad</b> (voz neuronal pregrabada para palabras, frases, diálogos, conversaciones, verbos irregulares y pronunciación). ${inClaude() ? "<span class='muted small'>No disponible dentro de Claude: funciona en tu versión publicada.</span>" : hqN ? `<span class="muted small">${hqN} audios disponibles.</span>` : "<span class='muted small'>Todavía no hay audios en esta versión.</span>"}</span></label>
    <p class="muted small">Lo que no tenga audio pregrabado (tus textos, tus palabras propias) usa las voces de tu dispositivo. Elige aquí las que mejor suenen; se guardan en este dispositivo.</p>
    ${vs.length ? VOICE_ROLES.map(([k, title, desc]) => `<label class="label">${title} <span class="muted">· ${desc}</span></label><div class="row"><select data-vsel="${k}" style="flex:1"><option value="">Automática (la mejor disponible)</option>${vs.map((v) => `<option value="${esc(v.voiceURI)}" ${pref[k] === v.voiceURI ? "selected" : ""}>${voiceScore(v) >= 6 ? "★ " : ""}${esc(v.name)} — ${esc(accentOf(v.lang))}</option>`).join("")}</select><button class="btn ghost small" data-vtest="${k}">▶ Probar</button></div>`).join("") : `<p class="note card">Tu navegador todavía no informa sus voces. Si no aparecen en unos segundos, prueba con Chrome, Edge o Safari.</p>`}
    <p class="muted small">★ = voz de alta calidad (natural, neuronal o mejorada). Ahora mismo se usaría: <b>${esc((voiceFor(0) || {}).name || "la voz por defecto")}</b>.</p>
    <details><summary><b>Cómo conseguir voces más naturales en tu dispositivo</b></summary>
      <p><b>💻 Computador:</b> abre la app en <b>Microsoft Edge</b>: trae voces "Natural" de Microsoft (Aria, Jenny, Guy, Sonia, Ryan…) que suenan casi humanas. En Chrome aparecen las voces de Google (Google US English, Google UK English). En Windows también puedes agregar voces en Configuración → Hora e idioma → Voz.</p>
      <p><b>🤖 Android:</b> Ajustes → Sistema → Idiomas → Salida de texto a voz → motor de Google → ⚙️ → Instalar datos de voz → English (United States / United Kingdom) y elige la voz que más te guste. Luego vuelve aquí y pruébalas.</p>
      <p><b>🍎 iPhone/iPad:</b> Configuración → Accesibilidad → Contenido leído → Voces → Inglés → descarga voces marcadas como "Mejorada" o "Premium" (por ejemplo Ava, Zoe, Evan, Nathan). Después cierra y vuelve a abrir la app.</p>
    </details></div>`;
}
function bindVoiceSettings(m) {
  if ($("#hq", m)) $("#hq", m).onchange = (e) => { S.settings.hq = e.target.checked; save(); };
  $$("[data-vsel]", m).forEach((sel) => sel.onchange = () => { setVoicePref(sel.dataset.vsel, sel.value); const y = window.scrollY; render(); window.scrollTo(0, y); });
  $$("[data-vtest]", m).forEach((b) => b.onclick = () => {
    const k = b.dataset.vtest, i = VOICE_KEYS.indexOf(k);
    const samples = { A: "Hello! I'm going to help you practise your English every day.", B: "Good morning. How can I help you today?", C: "That sounds like a great plan. Let's do it!" };
    stopSpeech(); const token = speakToken; ttsLine(i, samples[k], S.settings.rate, token);
  });
}

// ---------- CONNECTED SPEECH: anotador automático ----------
// Guía aproximada (inglés americano) basada en reglas: uniones, formas débiles, reducciones, asimilación, elisión y T americana.
const CS_WEAK = { a: "ə", an: "ən", the: "thə", to: "tə", for: "fər", from: "frəm", of: "əv", and: "ən", or: "ər", but: "bət", at: "ət", as: "əz", can: "kən", was: "wəz", were: "wər", are: "ər", am: "əm", some: "səm", than: "thən", them: "əm", him: "im", her: "ər", you: "yə", your: "yər", do: "də", does: "dəz", have: "əv", has: "əz", had: "əd" };
const CS_DETS = new Set(["the", "a", "an", "my", "your", "his", "her", "our", "their", "this", "that", "these", "those", "school", "work", "bed", "church", "town", "class", "university", "hospital", "office", "beach", "park", "gym", "market", "airport", "doctor", "dentist", "bank", "party", "cinema", "store", "shop", "concert", "meeting", "it"]);
const CS_RED = [
  [["going", "to"], "gonna", (n) => n && !CS_DETS.has(n)], [["want", "to"], "wanna"], [["got", "to"], "gotta"], [["have", "to"], "hafta", (n) => n && !CS_DETS.has(n)], [["has", "to"], "hasta", (n) => n && !CS_DETS.has(n)],
  [["used", "to"], "useta", (n) => n && !CS_DETS.has(n)], [["ought", "to"], "oughta"], [["kind", "of"], "kinda"], [["sort", "of"], "sorta"], [["out", "of"], "outta"], [["lot", "of"], "lotta"],
  [["let", "me"], "lemme"], [["give", "me"], "gimme"], [["don't", "know"], "dunno"], [["what", "do", "you"], "whaddya"], [["what", "are", "you"], "whatcha"], [["do", "you"], "d'you", (n) => n && n !== "?"]
];
const CS_YU = /^(u(s|ni|ti|r[aeiou])|eu|ewe|one\b|once\b)/i;
const CS_SILENT_H = /^(hour|honest|honou?r|heir)/i;
const isVowelStart = (w) => (/^[aeiou]/i.test(w) && !CS_YU.test(w)) || CS_SILENT_H.test(w);
function endsConsonantSound(w) {
  const l = w.toLowerCase().replace(/[’']/g, "'");
  if (/n't$/.test(l)) return true;
  if (/(augh|ough)$/.test(l)) return /(laugh|enough|rough|tough|cough)$/.test(l);
  if (/[aeiouwy]$/.test(l) || /h$/.test(l) && !/(sh|ch|th|gh)$/.test(l)) return /(sh|ch|th)$/.test(l);
  if (/e$/.test(l)) return l.length > 2 && !/^(the|be|me|he|she|we|see|free|three|tree|agree)$/.test(l) && !/[aeiou]e$/.test(l);
  return true;
}
function glideAfter(w) { const l = w.toLowerCase(); if (/(i|y|ee|ey|ay|oy)$/.test(l) || /^(the|be|me|he|she|we|see|free|three)$/.test(l)) return "y"; if (/(o|u|w|oo)$/.test(l)) return "w"; return ""; }
function csTokens(text) {
  const raw = String(text).match(/[A-Za-z][A-Za-z'’]*|\s+|[^A-Za-z\s]+/g) || [];
  return raw.map((t) => ({ t, word: /^[A-Za-z]/.test(t), space: /^\s+$/.test(t) }));
}
function csAnalyze(text) {
  const tk = csTokens(text);
  const words = tk.map((x, i) => x.word ? i : -1).filter((i) => i >= 0);
  const lw = (i) => tk[i].t.toLowerCase().replace(/’/g, "'");
  const adjacent = (a, b) => b === a + 2 && tk[a + 1] && tk[a + 1].space;
  const nextWordAfter = (k) => { const j = words[k + 1]; if (j === undefined) return null; const between = tk.slice(words[k] + 1, j).map((x) => x.t).join(""); return /^\s+$/.test(between) ? lw(j) : null; };
  // reducciones y asimilación
  const red = {}; // índice de palabra inicial -> {len, text, orig}
  for (let k = 0; k < words.length; k++) {
    for (const [pat, rep, cond] of CS_RED) {
      if (k + pat.length > words.length) continue;
      let ok = true;
      for (let p = 0; p < pat.length; p++) { if (lw(words[k + p]) !== pat[p] || (p > 0 && !adjacent(words[k + p - 1], words[k + p]))) { ok = false; break; } }
      if (!ok) continue;
      if (cond && !cond(nextWordAfter(k + pat.length - 1))) continue;
      red[k] = { len: pat.length, text: rep, orig: pat.join(" ") }; break;
    }
    if (red[k]) { k += red[k].len - 1; continue; }
    const n = words[k + 1];
    if (n !== undefined && adjacent(words[k], n) && /^(you|your|yourself)$/.test(lw(n))) {
      const w = lw(words[k]).replace(/'/g, "");
      if (/t$/.test(w) && w.length > 1) red[k] = { len: 2, text: w + (lw(n) === "you" ? "cha" : "chor"), orig: lw(words[k]) + " " + lw(n) };
      else if (/d$/.test(w) && w.length > 1) red[k] = { len: 2, text: w + (lw(n) === "you" ? "ja" : "jor"), orig: lw(words[k]) + " " + lw(n) };
      if (red[k]) k++;
    }
  }
  return { tk, words, red, lw, adjacent };
}
function csWordHTML(word, opts) {
  let h = esc(word);
  if (opts.flapFinal) h = esc(word.slice(0, -1)) + `<span class="cs-flap" title="T que suena como una d rápida">t</span>`;
  else if (opts.elide) h = esc(word.slice(0, -1)) + `<span class="cs-elide" title="Casi no suena">${esc(word.slice(-1))}</span>`;
  else if (opts.elideEd) h = esc(word.slice(0, -2)) + `<span class="cs-elide" title="Casi no suena">${esc(word.slice(-2))}</span>`;
  else h = h.replace(/([aeiou])(tt?)(er|y|ing|le|ed|ies|ier|iest|en|ity|ar|or|o|a)(?=s?$)/i, (m, v, t, s) => `${v}<span class="cs-flap" title="T que suena como una d rápida">${t}</span>${s}`);
  if (opts.weak) h = `<span class="cs-weak" title="Forma débil">${h}<sub>${esc(opts.weak)}</sub></span>`;
  return h;
}
function csRespellWord(word, opts) {
  let w = word;
  if (opts.weak) return opts.weak;
  if (opts.flapFinal) return w.slice(0, -1) + "d";
  if (opts.elide) return w.slice(0, -1);
  if (opts.elideEd) return w.slice(0, -2);
  return w.replace(/([aeiou])(tt?)(er|y|ing|le|ed|ies|ier|iest|en|ity|ar|or|o|a)(?=s?$)/i, (m, v, t, s) => v + "d" + s);
}
function csAnnotate(text) {
  const { tk, words, red, lw, adjacent } = csAnalyze(text);
  const opts = {}; // por índice de token
  words.forEach((ti, k) => {
    const w = lw(ti), next = words[k + 1], nw = next !== undefined && adjacent(ti, next) ? lw(next) : null;
    const prevPunct = k === 0 || !adjacent(words[k - 1], ti);
    const o = (opts[ti] = {});
    if (CS_WEAK[w] && nw) {
      const aux = { have: 1, has: 1, had: 1 }[w] ? /(ed|en|been|got|gone|done|seen|made|had|left|said|told|known|taken|given|written)$/.test(nw) : true;
      const doAux = { do: 1, does: 1 }[w] ? /^(you|i|we|they|he|she|it|your|the)$/.test(nw) : true;
      if (aux && doAux && !(w === "you" && k === 0)) o.weak = w === "the" && isVowelStart(nw) ? "thi" : w === "to" && isVowelStart(nw) ? "tu" : w === "a" && k === 0 && prevPunct ? null : CS_WEAK[w];
      if (!o.weak) delete o.weak;
    }
    if (nw) {
      const rl = tk[ti].t.toLowerCase().replace(/’/g, "'");
      if (/[aeiou]t$/.test(rl) && isVowelStart(nw)) o.flapFinal = true;
      else if (!CS_WEAK[w] && !isVowelStart(nw)) {
        if (/(k|p|s|sh|ch|f|x)ed$/.test(rl) && rl.length > 4) o.elideEd = true;
        else if (/[bcfgjklmnpqsvxz][td]$/.test(rl) || /n't$/.test(rl)) o.elide = true;
      }
    }
  });
  let html = "", say = "";
  let k = 0;
  for (let i = 0; i < tk.length; i++) {
    const x = tk[i];
    const wk = words.indexOf(i);
    if (wk >= 0 && red[wk]) {
      const r = red[wk], last = words[wk + r.len - 1];
      const orig = tk.slice(i, last + 1).map((y) => y.t).join("");
      const disp = /^[A-Z]/.test(x.t) ? r.text[0].toUpperCase() + r.text.slice(1) : r.text;
      html += `<span class="cs-red" title="Se escribe: ${esc(orig)}"><b>${esc(disp)}</b><small>${esc(orig)}</small></span>`;
      say += disp; i = last; continue;
    }
    if (x.word) { const o = opts[i] || {}; html += csWordHTML(x.t, o); say += csRespellWord(x.t, o); continue; }
    if (x.space) {
      const pw = tk[i - 1], nx = tk[i + 1];
      if (pw && nx && pw.word && nx.word) {
        const pi = i - 1;
        let red0 = null; for (let q = 0; q < words.length; q++) if (red[q] && words[q] <= pi && words[q + red[q].len - 1] >= pi) red0 = red[q];
        const effective = red0 ? red0.text : pw.t;
        if (isVowelStart(nx.t)) {
          if (endsConsonantSound(effective)) { html += `<span class="cs-link" title="Se unen">‿</span>`; say += "‿"; continue; }
          const g = glideAfter(effective);
          if (g) { html += `<span class="cs-link" title="Se unen con un sonido ${g}">‿<sup>${g}</sup></span>`; say += "‿"; continue; }
        }
      }
      html += " "; say += " "; continue;
    }
    html += esc(x.t); say += x.t;
  }
  return { html, say: say.replace(/\s+/g, " ").trim() };
}
const csEnabled = () => S.settings.csShow !== false;
function csBox(text, open) {
  if (!csEnabled()) return "";
  const t = String(text || "").trim(); if (t.split(/\s+/).length < 3) return "";
  const parts = t.length > 260 ? t.split(/(?<=[.!?])\s+/) : [t];
  const rows = parts.map((p) => { const a = csAnnotate(p); return `<div class="csrow">${a.html}</div><div class="cssay">Suena como: <i>${esc(a.say)}</i> <button class="icon-btn" data-speak="${esc(p)}" data-rate="1.05">🔊</button></div>`; }).join("");
  return `<details class="csbox" ${open ?? S.settings.csOpen !== false ? "open" : ""}><summary>🔗 Así suena</summary>${rows}<div class="cslegend"><span class="cs-link">‿</span> se unen · <span class="cs-weak">to<sub>tə</sub></span> forma débil · <span class="cs-red"><b>gonna</b></span> reducción · <span class="cs-elide">t</span> casi no suena · <span class="cs-flap">t</span> suena como d rápida</div></details>`;
}

// ---------- CONNECTED SPEECH: curso ----------
function csList(box) {
  box.innerHTML = `<p class="muted">Aprende cómo suenan las frases cuando los nativos hablan rápido: así entenderás series, podcasts y reuniones, y sonarás más natural. Cada unidad termina con un dictado a velocidad natural.</p>
  <div class="lessons">${CS_UNITS.map((u, i) => { const r = S.cs && S.cs[u.id]; return `<button class="lesson" data-cs="${u.id}"><span class="num">${i + 1}</span><span><b>${esc(u.title)}</b><small>${u.examples.length} ejemplos · ${u.practice.length} frases de dictado${r !== undefined ? ` · Mejor: ${Math.round(r * 100)}%` : ""}</small></span><span class="st">${r >= 0.8 ? "✅" : ""}</span></button>`; }).join("")}</div>`;
  $$("[data-cs]", box).forEach((b) => b.onclick = () => { sub = { cs: CS_UNITS.find((u) => u.id === b.dataset.cs) }; render(); });
}
function csPage(m, u) {
  m.innerHTML = `<div class="row between"><h1>${esc(u.title)}</h1><button class="btn ghost small" id="back">← Connected speech</button></div>
  <div class="card explain">${u.explain}</div>
  <div class="card"><h2>Ejemplos</h2><p class="muted small">Escucha a velocidad normal y lenta, lee cómo suena y grábate imitándolo.</p>
  ${u.examples.map(([w, sounds, note], i) => `<div class="csex"><div><b>${esc(w)}</b>${note ? ` <span class="tag">${esc(note)}</span>` : ""}<div class="cssay">Suena como: <i>${esc(sounds)}</i></div></div><div class="row">${speakBtn(w, "🔊")}<button class="icon-btn" data-speak="${esc(w)}" data-rate="0.7">🐢</button>${recorderHTML("cs" + i)}</div></div>`).join("")}</div>
  <button class="btn big-btn" id="dict">🎧 Dictado a velocidad natural (${u.practice.length})</button>`;
  $("#back").onclick = () => { sub = null; render(); };
  $$(".explain i", m).forEach((it) => { it.classList.add("sp"); it.onclick = () => speak(it.textContent); });
  bindRecorders(m);
  $("#dict").onclick = () => csDictation(m, u);
}
function csDictation(m, u) {
  const items = shuffle(u.practice); let i = 0, total = 0;
  const show = () => {
    const s = items[i];
    if (!s) { const p = total / items.length; S.cs = S.cs || {}; S.cs[u.id] = Math.max(S.cs[u.id] || 0, p); skill("listening", Math.round(total), items.length); addXP(Math.round(total * 5));
      m.innerHTML = `<div class="card center"><div class="big">${p >= 0.8 ? "👂✨" : "👂"}</div><h2>${Math.round(p * 100)}% de precisión</h2><p>${p >= 0.8 ? "¡Tu oído ya reconoce estos sonidos!" : "Vuelve a escuchar los ejemplos, fíjate en el recuadro «Así suena» y repite el dictado."}</p><div class="row center"><button class="btn" id="again">Repetir</button><button class="btn ghost" id="back">Volver</button></div></div>`;
      $("#again").onclick = () => csDictation(m, u); $("#back").onclick = () => csPage(m, u); return; }
    m.innerHTML = `<div class="row between"><h1>Dictado: ${esc(u.title)}</h1><button class="btn ghost small" id="exit">Salir</button></div><div class="bar"><i style="width:${(i / items.length) * 100}%"></i></div><div class="muted small">${i + 1}/${items.length} · Velocidad natural: escribe la frase completa (con las palabras «escondidas»).</div>
    <div class="card excard"><div class="row center"><button class="btn big-btn" id="play">🔊 Escuchar</button><button class="btn ghost" id="slow">🐢</button></div><form id="cf"><textarea id="ci" rows="2" autocapitalize="off" spellcheck="false" placeholder="Escribe lo que escuchas…"></textarea><button class="btn wide">Comprobar</button></form><div id="fb"></div></div>`;
    $("#exit").onclick = () => csPage(m, u);
    $("#play").onclick = () => speak(s, 1.1); $("#slow").onclick = () => speak(s, 0.7);
    setTimeout(() => speak(s, 1.1), 250);
    $("#ci").onkeydown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#cf").requestSubmit(); } };
    $("#cf").onsubmit = (e) => { e.preventDefault(); if ($("#nx")) return; const v = $("#ci").value; if (!v.trim()) return; const sc = similarity(s, v); total += sc;
      $("#fb").innerHTML = `<div class="feedback ${sc >= 0.9 ? "good" : "bad"}"><b>${Math.round(sc * 100)}%</b><p class="big-text">${diffWords(s, v)}</p>${csBox(s, true)}</div><button class="btn wide" id="nx">Siguiente ⏎</button>`;
      $("#nx").onclick = () => { i++; show(); }; $("#nx").focus(); };
  };
  show();
}

// ---------- INGLÉS PARA DESARROLLADORES ----------
const DEV_VOCAB = (() => { const out = []; let topic = "General", i = 0; DEV.vocab.split("\n").forEach((raw) => { const line = raw.trim(); if (line.startsWith("#")) { topic = line.replace(/^#\s*/, ""); return; } if (!line.includes("|")) return; const [en, es, ex] = line.split("|").map((x) => (x || "").trim()); out.push({ id: "DEV-" + i++, level: "DEV", topic, en, es, ex }); }); return out; })();
const DEV_RP = DEV.roleplays.map((x, i) => ({ ...x, id: "dev-p" + i, level: "TI" }));
const DEV_LI = DEV.listening.map((x, i) => ({ ...x, id: "dev-l" + i, level: "TI" }));
const DEV_RD = DEV.readings.map((x, i) => ({ ...x, id: "dev-r" + i, level: "TI" }));
const DEV_WR = DEV.writing.map((x, i) => ({ ...x, id: "dev-w" + i, level: "TI" }));
const DEV_NEW_PER_DAY = 5;
let devTab = "lecciones";
const DEV_TABS = [["lecciones", "📘 Situaciones"], ["vocab", "🗂️ Vocabulario"], ["conversa", "💬 Conversaciones"], ["escuchar", "🎧 Escuchar"], ["leer", "📖 Leer"], ["escribir", "✍️ Escribir"], ["entrevistas", "🎯 Entrevistas"], ["pron", "🗣️ Pronunciación técnica"]];
RENDER.ti = (m) => {
  if (sub && sub.devLesson) return devLessonPage(m, sub.devLesson);
  if (sub && sub.rp) return roleplay(m, sub.rp);
  if (sub && sub.w) return writingPage(m, sub.w);
  if (sub && sub.item) { const kind = sub.kind; return comprehension(m, sub.item, { kind, subtitle: "Inglés para desarrolladores", onExit: () => { sub = null; render(); }, onFinish: (c, n) => { (kind === "reading" ? S.done.reading : S.done.listening)[sub.item.id] = Math.max((kind === "reading" ? S.done.reading : S.done.listening)[sub.item.id] || 0, c / n); skill(kind === "reading" ? "reading" : "listening", c, n); addXP(c * 5); sub = null; render(); } }); }
  m.innerHTML = `<h1>💻 Inglés para desarrolladores</h1><p class="muted">El inglés que usarás en tu trabajo: dailies, code reviews, bugs, planning, documentación, entrevistas y comunicación escrita con equipos internacionales.</p>
  <div class="tabs">${DEV_TABS.map(([k, l]) => `<button class="tab ${devTab === k ? "on" : ""}" data-dt="${k}">${l}</button>`).join("")}</div><div id="dbody"></div>`;
  $$("[data-dt]", m).forEach((b) => b.onclick = () => { devTab = b.dataset.dt; render(); });
  const box = $("#dbody");
  const listItems = (arr, done, extra) => `<div class="lessons">${arr.map((x) => `<button class="lesson" data-i="${x.id}"><span class="num">💻</span><span><b>${esc(x.title)}</b><small>${extra(x)}${done && done[x.id] !== undefined ? (typeof done[x.id] === "number" ? ` · Mejor: ${Math.round(done[x.id] * 100)}%` : " · Hecho") : ""}</small></span><span class="st">${done && (done[x.id] === true || done[x.id] >= 0.75 || (done[x.id] && done[x.id].done)) ? "✅" : ""}</span></button>`).join("")}</div>`;
  if (devTab === "lecciones") {
    box.innerHTML = `<div class="lessons">${DEV.lessons.map((l) => { const r = S.lessons[l.id]; return `<button class="lesson" data-l="${l.id}"><span class="num">${l.icon}</span><span><b>${esc(l.title)}</b><small>${l.phrases.length} frases clave · ${l.ex.length} ejercicios${r ? ` · Mejor: ${Math.round(r.best * 100)}%` : ""}</small></span><span class="st">${r && r.best >= 0.7 ? "✅" : ""}</span></button>`; }).join("")}</div>`;
    $$("[data-l]", box).forEach((b) => b.onclick = () => { sub = { devLesson: DEV.lessons.find((l) => l.id === b.dataset.l) }; render(); });
  }
  if (devTab === "vocab") {
    const learned = DEV_VOCAB.filter((v) => S.cards[v.id] && S.cards[v.id].reps >= 2).length;
    const topics = [...new Set(DEV_VOCAB.map((v) => v.topic))];
    box.innerHTML = `<div class="card hero"><label class="cando"><input type="checkbox" id="devcards" ${S.settings.devCards === false ? "" : "checked"}> <span><b>Incluir en mis tarjetas diarias</b> (${DEV_NEW_PER_DAY} palabras técnicas nuevas por día, con repaso espaciado)</span></label><div class="bar"><i style="width:${pct(learned, DEV_VOCAB.length)}%"></i></div><div class="small muted">${learned} de ${DEV_VOCAB.length} aprendidas</div><button class="btn" id="quiz">⚡ Práctica rápida (12)</button></div>
    ${topics.map((t) => `<h2>${esc(t)}</h2><div class="card list">${DEV_VOCAB.filter((v) => v.topic === t).map((v) => { const st = S.cards[v.id]; return `<div class="li">${picHTML(v.en, "lst")}<div><b>${esc(v.en)}</b> — ${esc(v.es)}${pronHTML(v.en)}<div class="muted small">${esc(v.ex)}</div></div>${speakBtn(v.en)}${v.ex ? speakBtn(v.ex, "💬") : ""}<span class="tag">${st ? (st.reps >= 2 ? "Aprendida" : "En curso") : "Nueva"}</span></div>`; }).join("")}</div>`).join("")}`;
    $("#devcards").onchange = (e) => { S.settings.devCards = e.target.checked; vq = null; save(); };
    $("#quiz").onclick = () => { const pool = shuffle(DEV_VOCAB).slice(0, 12); const items = pool.map((w, k) => { const others = shuffle(DEV_VOCAB.filter((x) => x.id !== w.id && x.es !== w.es)).slice(0, 3), opts = shuffle([w, ...others]); return k % 2 ? ["mc", `¿Cómo se dice “${w.es}” en inglés?`, opts.map((x) => x.en), opts.indexOf(w), w.ex] : ["mc", `¿Qué significa “${w.en}”?`, opts.map((x) => x.es), opts.indexOf(w), w.ex]; });
      exerciseRunner(m, items, { title: "Vocabulario técnico", onExit: () => render(), onFinish: (c, n) => { skill("vocab", c, n); addXP(c * 2); m.innerHTML = `<div class="card center"><h2>${c} de ${n}</h2><button class="btn" id="ok">Volver</button></div>`; $("#ok").onclick = () => render(); } }); };
  }
  if (devTab === "conversa") { box.innerHTML = `<p class="muted">Situaciones reales de trabajo: responde en voz alta o escribiendo y compárate con respuestas modelo.</p>` + listItems(DEV_RP, S.done.roleplay, (x) => esc(x.intro)); $$("[data-i]", box).forEach((b) => b.onclick = () => { sub = { rp: DEV_RP.find((x) => x.id === b.dataset.i), t: 0, scores: [] }; render(); }); }
  if (devTab === "escuchar") { box.innerHTML = `<p class="muted">Reuniones y llamadas reales con varias voces. Al terminar, revisa la transcripción con el connected speech.</p>` + listItems(DEV_LI, S.done.listening, (x) => `${x.lines.length} intervenciones · ${x.q.length} preguntas`); $$("[data-i]", box).forEach((b) => b.onclick = () => { sub = { item: DEV_LI.find((x) => x.id === b.dataset.i), kind: "listening" }; render(); }); }
  if (devTab === "leer") { box.innerHTML = `<p class="muted">Textos que leerás en tu trabajo: ofertas de empleo, postmortems, documentación y blogs técnicos. Tip: pega documentación real en <b>Leer → Mi lector</b>.</p>` + listItems(DEV_RD, S.done.reading, (x) => `~${x.text.split(/\s+/).length} palabras · ${x.q.length} preguntas`); $$("[data-i]", box).forEach((b) => b.onclick = () => { sub = { item: DEV_RD.find((x) => x.id === b.dataset.i), kind: "reading" }; render(); }); }
  if (devTab === "escribir") { box.innerHTML = `<p class="muted">Commits, bug reports, PRs, Slack, correos a reclutadores y tu perfil de LinkedIn, con corrector y texto modelo.</p>` + listItems(DEV_WR, S.done.writing, (x) => `${esc(x.words)} palabras`); $$("[data-i]", box).forEach((b) => b.onclick = () => { sub = { w: DEV_WR.find((x) => x.id === b.dataset.i) }; render(); }); }
  if (devTab === "entrevistas") {
    box.innerHTML = `<p class="muted">Las preguntas más comunes en entrevistas para empresas internacionales. Lee el consejo, prepara tu respuesta en voz alta y grábate; luego compárala con la respuesta modelo y adáptala a tu experiencia real.</p>
    ${DEV.interview.map((x, i) => `<div class="card iq"><div class="row between"><h3 style="margin:0">${i + 1}. ${esc(x.q)}</h3>${speakBtn(x.q)}</div><p class="small">💡 ${esc(x.tip)}</p><div class="row">${recorderHTML("iq" + i)}<span class="muted small">Grábate respondiendo (máx. 15 s por toma)</span></div><details><summary><b>Ver respuesta modelo</b></summary><p>${esc(x.model)} ${speakBtn(x.model)}</p>${csBox(x.model, false)}</details></div>`).join("")}`;
    bindRecorders(box);
  }
  if (devTab === "pron") {
    box.innerHTML = `<p class="muted">Términos técnicos que muchos hispanohablantes pronuncian mal. Escucha, repite y grábate.</p><div class="card list">${DEV.pron.map(([term, say, note], i) => `<div class="li"><div><b>${esc(term)}</b><div class="muted small">${esc(note)}</div></div>${speakBtn(say)}<button class="icon-btn" data-speak="${esc(say)}" data-rate="0.7">🐢</button>${recorderHTML("dp" + i)}</div>`).join("")}</div>`;
    bindRecorders(box);
  }
};
function devLessonPage(m, l) {
  m.innerHTML = `<div class="row between"><h1>${l.icon} ${esc(l.title)}</h1><button class="btn ghost small" id="back">← Inglés TI</button></div>
  <div class="card explain">${l.explain}</div>
  <div class="card"><h2>Frases clave</h2><p class="muted small">Escúchalas, repítelas y grábate. Abre «Así suena» para ver cómo se pronuncian a velocidad normal.</p>
  ${l.phrases.map(([en, es], i) => `<div class="phrase"><div class="row between"><div><b>${esc(en)}</b><div class="muted small">${esc(es)}</div></div><div class="row">${speakBtn(en)}<button class="icon-btn" data-speak="${esc(en)}" data-rate="0.7">🐢</button>${recorderHTML("dl" + i)}<button class="icon-btn" data-addc="${i}" title="Agregar a tarjetas">＋</button></div></div>${csBox(en, false)}</div>`).join("")}</div>
  <button class="btn big-btn" id="start">Practicar (${l.ex.length} ejercicios)</button>`;
  $("#back").onclick = () => { sub = null; render(); };
  $$(".explain i", m).forEach((it) => { it.classList.add("sp"); it.onclick = () => speak(it.textContent); });
  bindRecorders(m);
  $$("[data-addc]", m).forEach((b) => b.onclick = () => { const [en, es] = l.phrases[+b.dataset.addc]; addCustomCard(en, es, ""); b.textContent = "✓"; b.disabled = true; });
  $("#start").onclick = () => exerciseRunner(m, shuffle(l.ex), { title: l.title, onExit: () => devLessonPage(m, l), onFinish: (c, n, wrongs) => {
    const r = S.lessons[l.id] || { best: 0, tries: 0 }; r.best = Math.max(r.best, c / n); r.tries++; S.lessons[l.id] = r;
    wrongs.forEach((w) => addMistake({ type: "Inglés TI", wrong: w.given, right: w.answer, note: `${l.title}${w.why ? ": " + w.why : ""}`, q: w.q }));
    skill("grammar", c, n); addXP(c * 5);
    m.innerHTML = `<div class="card center"><div class="big">${c / n >= 0.7 ? "🏆" : "💪"}</div><h2>${c} de ${n}</h2><p>${c / n >= 0.7 ? "¡Muy bien! Usa estas frases en tu próxima reunión." : "Repasa las frases clave y vuelve a intentarlo."}</p><div class="row center"><button class="btn" id="again">Repetir</button><button class="btn ghost" id="back2">Volver</button></div></div>`;
    $("#again").onclick = () => devLessonPage(m, l); $("#back2").onclick = () => { sub = null; render(); };
  } });
}
