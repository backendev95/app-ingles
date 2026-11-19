// ===== MÓDULOS ADICIONALES =====

// ---------- Grabadora (comparar tu voz con el modelo) ----------
let recState = { rec: null, chunks: [], blobs: {}, active: null, stream: null };
const recorderHTML = (k) => `<span class="recbox"><button class="icon-btn" data-rec="${k}" title="Grabarme">⏺️ Grabar</button><button class="icon-btn" data-play="${k}" ${recState.blobs[k] ? "" : "hidden"} title="Escuchar mi voz">▶️ Mi voz</button></span>`;
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
      setTimeout(() => { if (recState.active === k && recState.rec) recState.rec.stop(); }, 15000);
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
  el.innerHTML = `<div class="row between"><div><b class="lw">${esc(w)}</b> <span id="lph" class="muted"></span> ${speakBtn(w)} <button class="icon-btn" id="lau" hidden>🔈 Audio real</button></div><button class="icon-btn" id="lx">✕</button></div>
    <div id="les" class="les">${local ? `<b>${esc(local.es)}</b> <span class="tag">${local.level === "MIS" ? "tus tarjetas" : local.level}</span>` : `<span class="muted">Traduciendo…</span>`}</div>
    <div id="ldef" class="small"></div>
    <div class="row"><button class="btn small" id="ladd">+ Tarjeta</button><button class="btn ghost small" id="lsent">Traducir la frase</button></div><div id="lsout" class="small"></div>`;
  document.body.appendChild(el);
  $("#lx").onclick = closeLookup;
  let es = local ? local.es : "";
  $("#ladd").onclick = () => { if (local) { toast("Ya está en tus tarjetas"); return; } addCustomCard(w, es || "(ver definición)", sentence); $("#ladd").textContent = "✓ Agregada"; $("#ladd").disabled = true; };
  $("#lsent").onclick = async () => { $("#lsout").textContent = "Traduciendo…"; try { $("#lsout").innerHTML = `<i>${esc(sentence)}</i><br>→ ${esc(await translateText(sentence))}`; } catch (e) { $("#lsout").textContent = "No se pudo traducir: " + e.message; } };
  if (inClaude()) { $("#ldef").innerHTML = `<span class="muted">El diccionario en línea funciona en tu versión publicada (GitHub Pages). Aquí solo se muestran las palabras de la app.</span>`; if (!local) $("#les").innerHTML = ""; return; }
  if (!local) translateText(w).then((t) => { es = t; if ($("#les")) $("#les").innerHTML = `<b>${esc(t)}</b> <span class="muted small">(traducción automática)</span>`; }).catch((e) => { if ($("#les")) $("#les").innerHTML = `<span class="muted">Sin traducción: ${esc(e.message)}</span>`; });
  try {
    const d = await defineWord(w); if (!$("#ldef")) return;
    if (d.none) { $("#ldef").innerHTML = `<span class="muted">No está en el diccionario (puede ser un nombre propio o una forma conjugada; prueba con la forma base).</span>`; return; }
    if (d.phonetic) $("#lph").textContent = d.phonetic;
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
  if (u.type === "shadow") extra = `<div class="card"><h3>Escucha, repite y grábate</h3>${u.lines.map((l, i) => `<div class="li shadowline"><div>${esc(l)}</div><div class="row">${speakBtn(l)}<button class="icon-btn" data-speak="${esc(l)}" data-rate="0.7">🐢</button>${recorderHTML("sh" + i)}</div></div>`).join("")}<p class="muted small">Graba, escúchate y compara con el modelo: ¿el ritmo y la entonación se parecen? Repite hasta que suene natural.</p></div>`;
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
  <div class="flash rev"><div class="label">Escribe el pasado y el participio</div><div class="word">${esc(v.base)}</div>${speakBtn(v.base)}<div class="muted">${esc(v.es)}</div>
  ${r ? `<div class="irrres"><span class="${r.okP ? "ok" : "miss"}">${r.okP ? "✓" : "✗"} ${esc(v.past.replace("/", " / "))}</span><span class="${r.okPP ? "ok" : "miss"}">${r.okPP ? "✓" : "✗"} ${esc(v.pp.replace("/", " / "))}</span></div>` :
  `<form id="irf" class="irrform"><label>Pasado<input id="irp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="pasado"></label><label>Participio<input id="irpp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="participio"></label><button class="btn">Comprobar</button></form><button class="btn ghost small" id="idk">No lo sé</button>`}</div>
  ${r ? `<div class="feedback ${r.okP && r.okPP ? "good" : "bad"}"><b>${esc(irrForms(v))}</b> ${speakBtn(irrSay(v), "🔊 Escuchar las 3 formas")}${!(r.okP && r.okPP) && r.given ? `<div class="small">Escribiste: ${esc(r.given)}</div>` : ""}<div class="small muted">Patrón: ${esc(IRR_PATTERNS[irrPattern(v)])}</div></div>
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
  ${groups.map(([p, list]) => `<h2>${esc(IRR_PATTERNS[p])}</h2><div class="card list">${list.map((v) => { const st = S.cards[v.id], ok = lvlIdx(v.level) <= lvlIdx(S.level); return `<div class="li ${ok ? "" : "dim"}"><div><b>${esc(irrForms(v))}</b><div class="muted small">${esc(v.es)}</div></div>${speakBtn(irrSay(v))}<span class="tag">${v.level}</span><span class="tag">${st ? (st.reps >= 2 ? "Aprendido" : "En curso") : "Nuevo"}</span></div>`; }).join("")}</div>`).join("")}`;
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
