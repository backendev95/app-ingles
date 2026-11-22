// ===== SERIES DE YOUTUBE PARA INMERSIÓN =====
const BUILTIN_SERIES = [
  { id: "extra", name: "Extr@ English", list: "PLFuvSUJknMUUem0gBDtS6su4GRrFnRWgE", eps: 20, level: "A2", builtin: true,
    desc: "Comedia británica hecha para estudiantes: Hector, un argentino que casi no habla inglés, llega a vivir con tres jóvenes en Londres. Inglés claro que va subiendo poco a poco." }
];
if (!IMM_MODES.some((x) => x[0] === "subs_es")) IMM_MODES.unshift(["subs_es", "Con subtítulos en español"]);
const SERIES_PHASES = [["subs_es", "🇪🇸 Subtítulos en español"], ["subs_en", "🇬🇧 Subtítulos en inglés"], ["sin_subs", "🎧 Sin subtítulos"]];
const SERIES_STEPS = ["Verlo completo", "Repetir un fragmento de 2–3 minutos con subtítulos en inglés", "Shadowing: pausar y repetir en voz alta 5 frases", "Contar el episodio en 1 minuto"];
const listIdOf = (url) => { const m = String(url || "").match(/[?&]list=([A-Za-z0-9_-]{10,})/); return m ? m[1] : /^[A-Za-z0-9_-]{16,}$/.test(String(url || "").trim()) ? String(url).trim() : ""; };
const allSeries = () => BUILTIN_SERIES.map((b) => ({ ...b, ...((S.seriesOverride || {})[b.id] || {}) })).concat(S.series || []);
const seriesById = (id) => allSeries().find((s) => s.id === id);
const sProg = (sid) => { S.seriesProg = S.seriesProg || {}; return (S.seriesProg[sid] = S.seriesProg[sid] || {}); };
const epProg = (sid, n) => { const p = sProg(sid); return (p[n] = p[n] || { phase: "", steps: [false, false, false, false], words: [], sums: [] }); };
const epDone = (sid, n) => { const e = (sProg(sid))[n]; return e && e.watched; };
const watchURL = (s, n) => `https://www.youtube.com/watch?list=${encodeURIComponent(s.list)}&index=${n}`;
let seriesSel = null, epSel = null, ytPlayer = null;

function immSeries(box) {
  if (seriesSel && epSel) return episodePage(box, seriesById(seriesSel), epSel);
  if (seriesSel === "__new") return seriesForm(box, null);
  if (seriesSel && seriesSel.startsWith("__edit:")) return seriesForm(box, seriesById(seriesSel.slice(7)));
  const list = allSeries();
  box.innerHTML = `<div class="card note"><p><b>📺 Series para aprender.</b> Mira cada episodio siguiendo tu fase de subtítulos, haz los 4 pasos y anota las palabras nuevas. Todo se guarda con tu progreso.</p></div>
    ${list.map((s) => { const done = Array.from({ length: s.eps }, (_, i) => epDone(s.id, i + 1)).filter(Boolean).length; return `<div class="card series"><div class="row between"><div><h2>${esc(s.name)}</h2><div class="small muted">${s.level ? s.level + " · " : ""}${s.eps} episodios · ${done} vistos</div></div>${s.builtin ? "" : `<button class="btn ghost small" data-sedit="${s.id}">Editar</button>`}</div>
      ${s.desc ? `<p class="small">${esc(s.desc)}</p>` : ""}<div class="bar"><i style="width:${pct(done, s.eps)}%"></i></div>
      <div class="epgrid">${Array.from({ length: s.eps }, (_, i) => { const n = i + 1, e = sProg(s.id)[n] || {}; const ph = e.watched ? (e.phase === "sin_subs" ? "🎧" : e.phase === "subs_en" ? "🇬🇧" : "🇪🇸") : ""; return `<button class="ep ${e.watched ? "done" : ""}" data-s="${s.id}" data-ep="${n}" title="${esc(e.title || "Episodio " + n)}"><b>${n}</b><span>${ph}${e.watched && e.steps && e.steps.every(Boolean) ? "✓" : ""}</span></button>`; }).join("")}</div></div>`; }).join("")}
    <button class="btn" id="snew">➕ Agregar serie</button>`;
  $$("[data-ep]", box).forEach((b) => b.onclick = () => { seriesSel = b.dataset.s; epSel = +b.dataset.ep; render(); window.scrollTo(0, 0); });
  $$("[data-sedit]", box).forEach((b) => b.onclick = () => { seriesSel = "__edit:" + b.dataset.sedit; render(); });
  $("#snew").onclick = () => { seriesSel = "__new"; render(); };
}

function seriesForm(box, s) {
  box.innerHTML = `<div class="card"><h2>${s ? "Editar serie" : "➕ Agregar serie"}</h2>
    <label class="label">Enlace de la lista de YouTube</label><input id="surl" placeholder="https://www.youtube.com/playlist?list=..." value="${s ? esc("https://www.youtube.com/playlist?list=" + s.list) : ""}">
    <label class="label">Nombre de la serie</label><input id="sname" placeholder="Ej.: Friends con subtítulos" value="${s ? esc(s.name) : ""}">
    <div class="row"><div><label class="label">Episodios</label><input id="seps" type="number" min="1" max="500" value="${s ? s.eps : 10}"></div>
    <div><label class="label">Nivel aproximado</label><select id="slv">${["A2", "B1", "B2", "C1", "C2"].map((l) => `<option ${s && s.level === l ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
    <label class="label">Descripción (opcional)</label><input id="sdesc" value="${s && s.desc ? esc(s.desc) : ""}">
    <p class="small muted">Sirve cualquier enlace que tenga <b>list=</b>. El número de episodios lo puedes corregir después; al abrir un episodio, la app intenta leer el total real de la lista.</p>
    <p class="small" id="smsg"></p>
    <div class="row"><button class="btn" id="ssave">Guardar</button><button class="btn ghost" id="scancel">Cancelar</button>${s ? `<button class="btn red small" id="sdel">Borrar serie</button>` : ""}</div><div id="sdc"></div></div>`;
  $("#scancel").onclick = () => { seriesSel = null; render(); };
  $("#ssave").onclick = () => {
    const list = listIdOf($("#surl").value), name = $("#sname").value.trim(), eps = Math.max(1, Math.min(500, +$("#seps").value || 0));
    if (!list) { $("#smsg").textContent = "❌ No encontré el código de la lista en ese enlace (debe tener list=…)."; return; }
    if (!name) { $("#smsg").textContent = "❌ Escribe un nombre para la serie."; return; }
    S.series = S.series || [];
    const data = { name, list, eps, level: $("#slv").value, desc: $("#sdesc").value.trim() };
    if (s) Object.assign(S.series.find((x) => x.id === s.id), data);
    else S.series.push({ id: "s" + Date.now().toString(36), ...data });
    save(); toast("✓ Serie guardada"); seriesSel = null; render();
  };
  if ($("#sdel")) $("#sdel").onclick = () => confirmBox($("#sdc"), "¿Borrar esta serie y tu registro de episodios? Las palabras que ya pasaste a tarjetas se conservan.", () => { S.series = S.series.filter((x) => x.id !== s.id); if (S.seriesProg) delete S.seriesProg[s.id]; save(); seriesSel = null; render(); });
}

function loadYT() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (window.__ytLoading) return window.__ytLoading;
  window.__ytLoading = new Promise((res, rej) => {
    window.onYouTubeIframeAPIReady = () => res(window.YT);
    const sc = document.createElement("script"); sc.src = "https://www.youtube.com/iframe_api"; sc.onerror = () => { window.__ytLoading = null; rej(new Error("sin conexión")); };
    document.head.appendChild(sc); setTimeout(() => rej(new Error("tiempo agotado")), 12000);
  });
  return window.__ytLoading;
}

function episodePage(box, s, n) {
  if (!s) { seriesSel = epSel = null; return immSeries(box); }
  const e = epProg(s.id, n);
  box.innerHTML = `<div class="row between"><div><h2>${esc(s.name)} · Episodio ${n}</h2><div class="small muted" id="eptitle">${esc(e.title || "")}</div></div><button class="btn ghost small" id="eback">← Episodios</button></div>
    <div class="ytwrap"><div id="ytp"></div><div class="ytfallback" id="ytfb" hidden><p>Este video no se puede reproducir dentro de la app.</p><a class="btn" href="${watchURL(s, n)}" target="_blank" rel="noopener">▶️ Ver en YouTube</a></div></div>
    <p class="small center"><a href="${watchURL(s, n)}" target="_blank" rel="noopener">Abrir en YouTube</a> · los subtítulos se activan con el botón CC del reproductor</p>
    <div class="card"><h3>1. Elige tu fase de subtítulos</h3><div class="phasechips">${SERIES_PHASES.map(([k, l]) => `<label class="chipradio"><input type="radio" name="eph" value="${k}" ${e.phase === k ? "checked" : ""}> ${l}</label>`).join("")}</div>
      <p class="small muted">Tu fase actual de inmersión: <b>${esc(curPhase().title)}</b></p></div>
    <div class="card"><h3>2. Los 4 pasos</h3>${SERIES_STEPS.map((t, i) => `<label class="cando"><input type="checkbox" data-step="${i}" ${e.steps[i] ? "checked" : ""}> <span>${t}</span></label>`).join("")}
      <div id="sumbox"></div>${e.sums.length ? `<details><summary class="small">Tus resúmenes de este episodio (${e.sums.length})</summary>${e.sums.map((x) => `<p class="small"><b>${new Date(x.at).toLocaleDateString()}</b> · ${x.words} palabras · ${esc(x.text || "(solo grabación)")}</p>`).join("")}</details>` : ""}</div>
    <div class="card"><h3>3. Palabras nuevas</h3><form id="wf" class="row"><input id="wen" placeholder="Palabra o frase en inglés" autocapitalize="off"><input id="wes" placeholder="Significado (opcional)"><button class="btn">Añadir</button></form>
      <div class="list" id="wl">${e.words.map((w, i) => `<div class="li">${picHTML(w.en, "lst")}<div><b>${esc(w.en)}</b> — ${esc(w.es || "…")}${pronHTML(w.en)}</div>${speakBtn(w.en)}${w.card ? `<span class="small muted">✓ en tarjetas</span>` : `<button class="btn ghost small" data-wcard="${i}">➕ Tarjeta</button>`}<button class="icon-btn" data-wdel="${i}">✕</button></div>`).join("")}</div>
      ${e.words.some((w) => !w.card) ? `<button class="btn ghost small" id="wall">➕ Pasar todas a mis tarjetas</button>` : ""}</div>
    <div class="row">${e.watched ? `<span class="feedback good">✓ Episodio visto</span>` : `<button class="btn" id="ewatched">✓ Marcar como visto</button>`}</div>
    <div class="row between">${n > 1 ? `<button class="btn ghost small" id="eprev">← Episodio ${n - 1}</button>` : "<span></span>"}${n < s.eps ? `<button class="btn ghost small" id="enext">Episodio ${n + 1} →</button>` : ""}</div>`;
  const go2 = (k) => { try { ytPlayer && ytPlayer.destroy(); } catch (er) {} ytPlayer = null; epSel = k; render(); window.scrollTo(0, 0); };
  $("#eback").onclick = () => { try { ytPlayer && ytPlayer.destroy(); } catch (er) {} ytPlayer = null; epSel = null; seriesSel = null; render(); };
  if ($("#eprev")) $("#eprev").onclick = () => go2(n - 1);
  if ($("#enext")) $("#enext").onclick = () => go2(n + 1);
  $$("[name=eph]", box).forEach((r) => r.onchange = () => { e.phase = r.value; save(); });
  $$("[data-step]", box).forEach((c) => c.onchange = () => { e.steps[+c.dataset.step] = c.checked; save(); if (+c.dataset.step === 3 && c.checked) startSummary(); });
  const startSummary = () => {
    timedSpeak($("#sumbox"), { key: `ser-${s.id}-${n}`, seconds: 60, onDone: (said, used) => {
      const words = said ? said.split(/\s+/).length : 0;
      $("#sumbox").innerHTML = `<div class="feedback good"><b>Resumen guardado</b>${said ? `<p>${esc(said)}</p><p class="small">${words} palabras en ${used} s.</p>` : `<p class="small">Escucha tu grabación para evaluarte.</p>`}${recorderHTML(`ser-${s.id}-${n}`, 62)}</div>`;
      bindRecorders($("#sumbox")); e.sums.unshift({ at: Date.now(), text: said, words, secs: used }); e.steps[3] = true; const c3 = $('[data-step="3"]'); if (c3) c3.checked = true; skill("speaking", 1, 1); addXP(8); save();
    } });
  };
  $("#sumbox").innerHTML = `<button class="btn ghost small" id="sumgo">🗣️ Contar el episodio ahora (1 minuto)</button>`;
  $("#sumgo").onclick = startSummary;
  $("#wf").onsubmit = async (ev) => {
    ev.preventDefault(); const en = $("#wen").value.trim(); let es = $("#wes").value.trim(); if (!en) return;
    const w = { en, es }; e.words.push(w); save(); render();
    if (!es) { try { w.es = await translateText(en); save(); if (epSel === n) render(); } catch (er) {} }
  };
  $$("[data-wdel]", box).forEach((b) => b.onclick = () => { e.words.splice(+b.dataset.wdel, 1); save(); render(); });
  const toCard = (w) => { if (w.card) return; addCustomCard(w.en, w.es || "(completa el significado)", `${s.name} · episodio ${n}`, true); w.card = true; };
  $$("[data-wcard]", box).forEach((b) => b.onclick = () => { toCard(e.words[+b.dataset.wcard]); save(); toast("✓ Añadida a tus tarjetas"); render(); });
  if ($("#wall")) $("#wall").onclick = () => { e.words.forEach(toCard); save(); toast("✓ Palabras añadidas a tus tarjetas"); render(); };
  if ($("#ewatched")) $("#ewatched").onclick = () => {
    e.watched = Date.now(); if (!e.phase) e.phase = curPhase().n <= 2 ? "subs_es" : "subs_en"; e.steps[0] = true;
    S.immersion.unshift({ d: Date.now(), type: "serie", mode: e.phase, min: 25, title: `${s.name} · ep. ${n}` });
    addXP(10); if (extraTask().go === "inmersion") markDaily("extra"); save(); toast("✓ Episodio registrado (25 min de inmersión)"); render();
  };
  // Reproductor
  const fb = () => { const f = $("#ytfb"), p = $("#ytp"); if (f) f.hidden = false; if (p) p.remove(); };
  loadYT().then((YT) => {
    if (!$("#ytp") || epSel !== n) return;
    ytPlayer = new YT.Player("ytp", { width: "100%", height: "100%", host: "https://www.youtube-nocookie.com", playerVars: { listType: "playlist", list: s.list, rel: 0, cc_lang_pref: "en", hl: "es" },
      events: {
        onReady: (ev) => { try { ev.target.cuePlaylist({ listType: "playlist", list: s.list, index: n - 1 }); } catch (er) {} },
        onStateChange: (ev) => {
          try {
            const pl = ev.target.getPlaylist && ev.target.getPlaylist();
            if (pl && pl.length && pl.length !== s.eps) { if (s.builtin) { S.seriesOverride = S.seriesOverride || {}; S.seriesOverride[s.id] = { eps: pl.length }; } else { const x = S.series.find((y) => y.id === s.id); if (x) x.eps = pl.length; } save(); }
            const d = ev.target.getVideoData && ev.target.getVideoData();
            if (d && d.title && e.title !== d.title) { e.title = d.title; save(); const t = $("#eptitle"); if (t) t.textContent = d.title; }
          } catch (er) {}
        },
        onError: fb } });
  }).catch(fb);
}

// Pestaña en Inmersión
(() => {
  const base = RENDER.inmersion;
  RENDER.inmersion = (m) => {
    if (iTab === "series") {
      m.innerHTML = `<h1>Inmersión</h1><div class="tabs">${[["plan", "Mi plan"], ["registro", "Registro"], ["series", "📺 Series"], ["guia", "Guía completa"], ["recursos", "Recursos"]].map(([k, l]) => `<button class="tab ${iTab === k ? "on" : ""}" data-t="${k}">${l}</button>`).join("")}</div><div id="ibody"></div>`;
      $$("[data-t]", m).forEach((b) => b.onclick = () => { iTab = b.dataset.t; seriesSel = epSel = null; render(); });
      return immSeries($("#ibody"));
    }
    base(m);
    const tabs = $(".tabs", m); if (tabs && !$('[data-t="series"]', tabs)) {
      const reg = $('[data-t="registro"]', tabs); reg.insertAdjacentHTML("afterend", `<button class="tab" data-t="series">📺 Series</button>`);
      $('[data-t="series"]', tabs).onclick = () => { iTab = "series"; seriesSel = epSel = null; render(); };
    }
  };
})();
