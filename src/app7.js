// ===== SERIES Y VIDEOS DE YOUTUBE PARA INMERSIÓN =====
const BUILTIN_SERIES = [
  { id: "extra", name: "Extr@ English", list: "PLFuvSUJknMUUem0gBDtS6su4GRrFnRWgE", eps: 20, level: "A2", builtin: true,
    desc: "Comedia británica hecha para estudiantes: Hector, un argentino que casi no habla inglés, llega a vivir con tres jóvenes en Londres. Inglés claro que va subiendo poco a poco." }
];
if (!IMM_MODES.some((x) => x[0] === "subs_es")) IMM_MODES.unshift(["subs_es", "Con subtítulos en español"]);
const SERIES_PHASES = [["subs_es", "🇪🇸 Subtítulos en español"], ["subs_en", "🇬🇧 Subtítulos en inglés"], ["sin_subs", "🎧 Sin subtítulos"]];
const SERIES_STEPS = ["Verlo completo", "Repetir un fragmento de 2–3 minutos con subtítulos en inglés", "Shadowing: pausar y repetir en voz alta 5 frases", "Contarlo en 1 minuto"];
const MYV = "myvideos";
const listIdOf = (url) => { const m = String(url || "").match(/[?&]list=([A-Za-z0-9_-]{10,})/); return m ? m[1] : /^(PL|UU|OL|FL|RD)[A-Za-z0-9_-]{10,}$/.test(String(url || "").trim()) ? String(url).trim() : ""; };
const videoIdOf = (url) => { const m = String(url || "").match(/(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : /^[A-Za-z0-9_-]{11}$/.test(String(url || "").trim()) ? String(url).trim() : ""; };
const myVideosSeries = () => { const vs = S.videos || []; return { id: MYV, name: "🎬 Mis videos", videos: vs, eps: vs.length }; };
const allSeries = () => BUILTIN_SERIES.map((b) => ({ ...b, ...((S.seriesOverride || {})[b.id] || {}) })).concat(S.series || []);
const seriesById = (id) => id === MYV ? myVideosSeries() : allSeries().find((s) => s.id === id);
const sProg = (sid) => { S.seriesProg = S.seriesProg || {}; return (S.seriesProg[sid] = S.seriesProg[sid] || {}); };
// En las listas, el progreso va por número de episodio; en Mis videos, por el identificador del video
const epKey = (s, n) => s.videos ? (s.videos[n - 1] || {}).id : n;
const epProg = (s, n) => { const p = sProg(s.id), k = epKey(s, n); return (p[k] = p[k] || { phase: "", steps: [false, false, false, false], words: [], sums: [] }); };
const epPeek = (s, n) => (sProg(s.id))[epKey(s, n)] || {};
const watchURL = (s, n) => s.videos ? `https://www.youtube.com/watch?v=${s.videos[n - 1].vid}` : `https://www.youtube.com/watch?list=${encodeURIComponent(s.list)}&index=${n}`;
let seriesSel = null, epSel = null, ytPlayer = null, addPick = null;

function immSeries(box) {
  if (seriesSel && epSel) return episodePage(box, seriesById(seriesSel), epSel);
  if (seriesSel === "__new") return seriesForm(box, null);
  if (seriesSel === "__video") return videoForm(box);
  if (seriesSel && seriesSel.startsWith("__edit:")) return seriesForm(box, seriesById(seriesSel.slice(7)));
  const mv = myVideosSeries();
  box.innerHTML = `<div class="card note"><p><b>📺 Series y videos para aprender.</b> Elige tus subtítulos, haz los 4 pasos y anota las palabras nuevas. Todo se guarda con tu progreso.</p></div>
    ${allSeries().map((s) => { const done = Array.from({ length: s.eps }, (_, i) => epPeek(s, i + 1).watched).filter(Boolean).length; return `<div class="card series"><div class="row between"><div><h2>${esc(s.name)}</h2><div class="small muted">${s.level ? s.level + " · " : ""}${s.eps} episodios · ${done} vistos</div></div>${s.builtin ? "" : `<button class="btn ghost small" data-sedit="${s.id}">Editar</button>`}</div>
      ${s.desc ? `<p class="small">${esc(s.desc)}</p>` : ""}<div class="bar"><i style="width:${pct(done, s.eps)}%"></i></div>
      <div class="epgrid">${Array.from({ length: s.eps }, (_, i) => { const n = i + 1, e = epPeek(s, n); const ph = e.watched ? (e.phase === "sin_subs" ? "🎧" : e.phase === "subs_en" ? "🇬🇧" : "🇪🇸") : ""; return `<button class="ep ${e.watched ? "done" : ""}" data-s="${s.id}" data-ep="${n}" title="${esc(e.title || "Episodio " + n)}"><b>${n}</b><span>${ph}${e.watched && e.steps && e.steps.every(Boolean) ? "✓" : ""}</span></button>`; }).join("")}</div></div>`; }).join("")}
    <div class="card series"><h2>🎬 Mis videos</h2><div class="small muted">Videos sueltos de YouTube: entrevistas, charlas, clips… ${mv.eps ? `· ${mv.videos.filter((v, i) => epPeek(mv, i + 1).watched).length} de ${mv.eps} vistos` : ""}</div>
      ${mv.eps ? `<div class="vgrid">${mv.videos.map((v, i) => { const e = epPeek(mv, i + 1); return `<button class="vcard ${e.watched ? "done" : ""}" data-s="${MYV}" data-ep="${i + 1}"><img src="https://i.ytimg.com/vi/${v.vid}/mqdefault.jpg" alt="" loading="lazy"><span class="vt">${esc(v.title || e.title || "Video " + (i + 1))}</span><span class="small muted">${v.level || ""}${v.min ? " · " + v.min + " min" : ""}${e.watched ? " · ✓ visto" : ""}</span></button>`; }).join("")}</div>` : `<p class="small muted">Todavía no agregas videos.</p>`}
      <button class="btn ghost small" id="vnew">➕ Agregar video</button></div>
    <button class="btn" id="snew">➕ Agregar serie (lista de YouTube)</button>`;
  $$("[data-ep]", box).forEach((b) => b.onclick = () => { seriesSel = b.dataset.s; epSel = +b.dataset.ep; render(); window.scrollTo(0, 0); });
  $$("[data-sedit]", box).forEach((b) => b.onclick = () => { seriesSel = "__edit:" + b.dataset.sedit; render(); });
  $("#snew").onclick = () => { seriesSel = "__new"; addPick = null; render(); };
  $("#vnew").onclick = () => { seriesSel = "__video"; addPick = null; render(); };
}

function seriesForm(box, s, pre) {
  pre = pre || {};
  box.innerHTML = `<div class="card"><h2>${s ? "Editar serie" : "➕ Agregar serie"}</h2>
    <label class="label">Enlace de la lista de YouTube</label><input id="surl" placeholder="https://www.youtube.com/playlist?list=..." value="${esc(s ? "https://www.youtube.com/playlist?list=" + s.list : pre.url || "")}">
    <label class="label">Nombre de la serie</label><input id="sname" placeholder="Ej.: Friends con subtítulos" value="${s ? esc(s.name) : ""}">
    <div class="row"><div><label class="label">Episodios</label><input id="seps" type="number" min="1" max="500" value="${s ? s.eps : 10}"></div>
    <div><label class="label">Nivel aproximado</label><select id="slv">${["A2", "B1", "B2", "C1", "C2"].map((l) => `<option ${s && s.level === l ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
    <label class="label">Descripción (opcional)</label><input id="sdesc" value="${s && s.desc ? esc(s.desc) : ""}">
    <p class="small muted">Sirve cualquier enlace que tenga <b>list=</b>. El número de episodios lo puedes corregir después; al abrir un episodio, la app lee el total real de la lista. ¿Es un video suelto? Usa <b>➕ Agregar video</b>.</p>
    <p class="small" id="smsg"></p>
    <div class="row"><button class="btn" id="ssave">Guardar</button><button class="btn ghost" id="scancel">Cancelar</button>${s ? `<button class="btn red small" id="sdel">Borrar serie</button>` : ""}</div><div id="sdc"></div></div>`;
  $("#scancel").onclick = () => { seriesSel = null; render(); };
  $("#ssave").onclick = () => {
    const url = $("#surl").value, list = listIdOf(url), name = $("#sname").value.trim(), eps = Math.max(1, Math.min(500, +$("#seps").value || 0));
    if (!list) { $("#smsg").innerHTML = videoIdOf(url) ? `Ese enlace es de un video suelto, no de una lista. <button class="btn ghost small" id="tovid">Agregarlo como video</button>` : "❌ No encontré el código de la lista en ese enlace (debe tener list=…)."; if ($("#tovid")) $("#tovid").onclick = () => videoForm(box, { url }); return; }
    if (!name) { $("#smsg").textContent = "❌ Escribe un nombre para la serie."; return; }
    S.series = S.series || [];
    const data = { name, list, eps, level: $("#slv").value, desc: $("#sdesc").value.trim() };
    if (s) Object.assign(S.series.find((x) => x.id === s.id), data);
    else S.series.push({ id: "s" + Date.now().toString(36), ...data });
    save(); toast("✓ Serie guardada"); seriesSel = null; render();
  };
  if ($("#sdel")) $("#sdel").onclick = () => confirmBox($("#sdc"), "¿Borrar esta serie y tu registro de episodios? Las palabras que ya pasaste a tarjetas se conservan.", () => { S.series = S.series.filter((x) => x.id !== s.id); if (S.seriesProg) delete S.seriesProg[s.id]; save(); seriesSel = null; render(); });
}

function videoForm(box, pre) {
  pre = pre || {};
  box.innerHTML = `<div class="card"><h2>➕ Agregar video</h2>
    <label class="label">Enlace del video de YouTube</label><input id="vurl" placeholder="https://www.youtube.com/watch?v=...  ·  https://youtu.be/...  ·  Shorts" value="${esc(pre.url || "")}">
    <div id="vpick"></div>
    <label class="label">Título (opcional: si lo dejas vacío, se toma de YouTube al abrirlo)</label><input id="vtitle">
    <div class="row"><div><label class="label">Duración en minutos (opcional)</label><input id="vmin" type="number" min="1" max="600" placeholder="Se calcula sola"></div>
    <div><label class="label">Nivel aproximado</label><select id="vlv">${["A2", "B1", "B2", "C1", "C2"].map((l) => `<option ${l === S.level ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
    <p class="small" id="vmsg"></p>
    <div class="row"><button class="btn" id="vsave">Guardar</button><button class="btn ghost" id="vcancel">Cancelar</button></div></div>`;
  const checkPick = () => {
    const url = $("#vurl").value, v = videoIdOf(url), l = listIdOf(url);
    $("#vpick").innerHTML = v && l ? `<div class="phasechips"><label class="chipradio"><input type="radio" name="vp" value="video" ${addPick !== "list" ? "checked" : ""}> Solo este video</label><label class="chipradio"><input type="radio" name="vp" value="list" ${addPick === "list" ? "checked" : ""}> Toda la lista como serie</label></div>` : "";
    $$("[name=vp]", box).forEach((r) => r.onchange = () => { addPick = r.value; });
  };
  $("#vurl").oninput = checkPick; checkPick();
  $("#vcancel").onclick = () => { seriesSel = null; render(); };
  $("#vsave").onclick = () => {
    const url = $("#vurl").value, vid = videoIdOf(url), l = listIdOf(url);
    if (l && (!vid || addPick === "list")) return seriesForm(box, null, { url });
    if (!vid) { $("#vmsg").textContent = "❌ No reconozco ese enlace como un video de YouTube."; return; }
    S.videos = S.videos || [];
    if (S.videos.some((x) => x.vid === vid)) { $("#vmsg").textContent = "Ese video ya está en Mis videos."; return; }
    S.videos.push({ id: "v" + Date.now().toString(36), vid, title: $("#vtitle").value.trim(), min: Math.max(0, Math.min(600, +$("#vmin").value || 0)) || 0, level: $("#vlv").value, added: Date.now() });
    save(); toast("✓ Video agregado"); seriesSel = MYV; epSel = S.videos.length; render(); window.scrollTo(0, 0);
  };
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

// ---------- Control de subtítulos del reproductor ----------
function captionStatus(t) { const el = $("#ccmsg"); if (el) el.textContent = t; }
function applyCaptions(p, phase) {
  if (!p || !phase) return;
  try {
    if (phase === "sin_subs") { p.setOption("captions", "track", {}); p.unloadModule("captions"); captionStatus("🎧 Subtítulos apagados. Si aún ves texto, está grabado en el video y no se puede quitar."); return; }
    p.loadModule("captions");
    const list = p.getOption("captions", "tracklist") || [];
    if (!list.length) { captionStatus(p.__ccTried ? "Este video no tiene subtítulos disponibles." : "⏳ Activando subtítulos… (empiezan a funcionar cuando el video se reproduce)"); p.__ccTried = true; return; }
    const has = (lc) => list.find((t) => (t.languageCode || "").toLowerCase().startsWith(lc));
    if (phase === "subs_en") { const t = has("en"); if (t) { p.setOption("captions", "track", { languageCode: t.languageCode }); captionStatus("🇬🇧 Subtítulos en inglés activados."); } else captionStatus("Este video no tiene subtítulos en inglés."); return; }
    const es = has("es");
    if (es) { p.setOption("captions", "track", { languageCode: es.languageCode }); captionStatus("🇪🇸 Subtítulos en español activados."); return; }
    const base = has("en") || list[0];
    p.setOption("captions", "track", { languageCode: base.languageCode, translationLanguage: { languageCode: "es", languageName: "Spanish" } });
    captionStatus("🇪🇸 Este video no trae subtítulos en español: intenté la traducción automática de YouTube. Si no aparece, usa CC → Configuración → Traducir automáticamente.");
  } catch (er) { captionStatus("No pude cambiar los subtítulos desde la app; usa el botón CC del reproductor."); }
}

function episodePage(box, s, n) {
  if (!s || n > s.eps || n < 1) { seriesSel = epSel = null; return immSeries(box); }
  const e = epProg(s, n), v = s.videos ? s.videos[n - 1] : null;
  const label = v ? (v.title || e.title || "Video") : `${s.name} · Episodio ${n}`;
  box.innerHTML = `<div class="row between"><div><h2>${esc(label)}</h2><div class="small muted" id="eptitle">${v ? "Mis videos" : esc(e.title || "")}</div></div><button class="btn ghost small" id="eback">← ${v ? "Volver" : "Episodios"}</button></div>
    <div class="ytwrap"><div id="ytp"></div><div class="ytfallback" id="ytfb" hidden><p>Este video no se puede reproducir dentro de la app.</p><a class="btn" href="${watchURL(s, n)}" target="_blank" rel="noopener">▶️ Ver en YouTube</a></div></div>
    <p class="small center"><a href="${watchURL(s, n)}" target="_blank" rel="noopener">Abrir en YouTube</a></p>
    <div class="card"><h3>1. Subtítulos</h3><div class="phasechips">${SERIES_PHASES.map(([k, l]) => `<label class="chipradio"><input type="radio" name="eph" value="${k}" ${e.phase === k ? "checked" : ""}> ${l}</label>`).join("")}</div>
      <p class="small" id="ccmsg">${e.phase ? "" : "Elige con qué subtítulos lo vas a ver: la app los activa en el video y lo anota en tu registro."}</p>
      <p class="small muted">Tu fase actual de inmersión: <b>${esc(curPhase().title)}</b></p></div>
    <div class="card"><h3>2. Los 4 pasos</h3>${SERIES_STEPS.map((t, i) => `<label class="cando"><input type="checkbox" data-step="${i}" ${e.steps[i] ? "checked" : ""}> <span>${t}</span></label>`).join("")}
      <div id="sumbox"></div>${e.sums.length ? `<details><summary class="small">Tus resúmenes (${e.sums.length})</summary>${e.sums.map((x) => `<p class="small"><b>${new Date(x.at).toLocaleDateString()}</b> · ${x.words} palabras · ${esc(x.text || "(solo grabación)")}</p>`).join("")}</details>` : ""}</div>
    <div class="card"><h3>3. Palabras nuevas</h3><form id="wf" class="row"><input id="wen" placeholder="Palabra o frase en inglés" autocapitalize="off"><input id="wes" placeholder="Significado (opcional)"><button class="btn">Añadir</button></form>
      <div id="wbox"></div></div>
    <div class="row" id="wrow">${e.watched ? `<span class="feedback good">✓ Visto</span>` : `<button class="btn" id="ewatched">✓ Marcar como visto</button>`}${v ? `<button class="btn red small" id="vdel">Quitar video</button>` : ""}</div><div id="vdc"></div>
    <div class="row between">${n > 1 ? `<button class="btn ghost small" id="eprev">← ${v ? "Anterior" : "Episodio " + (n - 1)}</button>` : "<span></span>"}${n < s.eps ? `<button class="btn ghost small" id="enext">${v ? "Siguiente" : "Episodio " + (n + 1)} →</button>` : ""}</div>`;
  const kill = () => { try { ytPlayer && ytPlayer.destroy(); } catch (er) {} ytPlayer = null; };
  const go2 = (k) => { kill(); epSel = k; render(); window.scrollTo(0, 0); };
  $("#eback").onclick = () => { kill(); epSel = null; seriesSel = null; render(); };
  if ($("#eprev")) $("#eprev").onclick = () => go2(n - 1);
  if ($("#enext")) $("#enext").onclick = () => go2(n + 1);
  $$("[name=eph]", box).forEach((r) => r.onchange = () => { e.phase = r.value; save(); if (ytPlayer) applyCaptions(ytPlayer, e.phase); else captionStatus("Se aplicará cuando cargue el video."); });
  $$("[data-step]", box).forEach((c) => c.onchange = () => { e.steps[+c.dataset.step] = c.checked; save(); if (+c.dataset.step === 3 && c.checked) startSummary(); });
  const startSummary = () => {
    timedSpeak($("#sumbox"), { key: `ser-${s.id}-${epKey(s, n)}`, seconds: 60, onDone: (said, used) => {
      const words = said ? said.split(/\s+/).length : 0;
      $("#sumbox").innerHTML = `<div class="feedback good"><b>Resumen guardado</b>${said ? `<p>${esc(said)}</p><p class="small">${words} palabras en ${used} s.</p>` : `<p class="small">Escucha tu grabación para evaluarte.</p>`}${recorderHTML(`ser-${s.id}-${epKey(s, n)}`, 62)}</div>`;
      bindRecorders($("#sumbox")); e.sums.unshift({ at: Date.now(), text: said, words, secs: used }); e.steps[3] = true; const c3 = $('[data-step="3"]'); if (c3) c3.checked = true; skill("speaking", 1, 1); addXP(8); save();
    } });
  };
  $("#sumbox").innerHTML = `<button class="btn ghost small" id="sumgo">🗣️ Contarlo ahora (1 minuto)</button>`;
  $("#sumgo").onclick = startSummary;
  // La lista de palabras se actualiza sola, sin recargar el video
  const toCard = (w) => { if (w.card) return; addCustomCard(w.en, w.es || "(completa el significado)", v ? (v.title || "Video") : `${s.name} · episodio ${n}`, true); w.card = true; };
  const drawWords = () => {
    const wb = $("#wbox"); if (!wb) return;
    wb.innerHTML = `<div class="list">${e.words.map((w, i) => `<div class="li">${picHTML(w.en, "lst")}<div><b>${esc(w.en)}</b> — ${esc(w.es || "…")}${pronHTML(w.en)}</div>${speakBtn(w.en)}${w.card ? `<span class="small muted">✓ en tarjetas</span>` : `<button class="btn ghost small" data-wcard="${i}">➕ Tarjeta</button>`}<button class="icon-btn" data-wdel="${i}">✕</button></div>`).join("")}</div>
      ${e.words.some((w) => !w.card) ? `<button class="btn ghost small" id="wall">➕ Pasar todas a mis tarjetas</button>` : ""}`;
    $$("[data-wdel]", wb).forEach((b) => b.onclick = () => { e.words.splice(+b.dataset.wdel, 1); save(); drawWords(); });
    $$("[data-wcard]", wb).forEach((b) => b.onclick = () => { toCard(e.words[+b.dataset.wcard]); save(); toast("✓ Añadida a tus tarjetas"); drawWords(); });
    if ($("#wall", wb)) $("#wall", wb).onclick = () => { e.words.forEach(toCard); save(); toast("✓ Palabras añadidas a tus tarjetas"); drawWords(); };
  };
  drawWords();
  $("#wf").onsubmit = async (ev) => {
    ev.preventDefault(); const en = $("#wen").value.trim(); const es = $("#wes").value.trim(); if (!en) return;
    const w = { en, es }; e.words.push(w); save(); $("#wen").value = ""; $("#wes").value = ""; drawWords();
    if (!es) { try { w.es = await translateText(en); save(); drawWords(); } catch (er) {} }
  };
  if ($("#ewatched")) $("#ewatched").onclick = () => {
    e.watched = Date.now(); if (!e.phase) e.phase = curPhase().n <= 2 ? "subs_es" : "subs_en"; e.steps[0] = true;
    const min = (v && v.min) || e.min || 25;
    S.immersion.unshift({ d: Date.now(), type: v ? "video" : "serie", mode: e.phase, min, title: v ? (v.title || e.title || "Video") : `${s.name} · ep. ${n}` });
    addXP(10); if (extraTask().go === "inmersion") markDaily("extra"); save(); toast(`✓ Registrado (${min} min de inmersión)`); $("#ewatched").outerHTML = `<span class="feedback good">✓ Visto</span>`; const c0 = $('[data-step="0"]'); if (c0) c0.checked = true;
  };
  if ($("#vdel")) $("#vdel").onclick = () => confirmBox($("#vdc"), "¿Quitar este video de Mis videos? Las palabras que pasaste a tarjetas se conservan.", () => { kill(); const id = v.id; S.videos = S.videos.filter((x) => x.id !== id); delete sProg(MYV)[id]; save(); epSel = null; render(); });
  // Reproductor
  const fb = () => { const f = $("#ytfb"), p = $("#ytp"); if (f) f.hidden = false; if (p) p.remove(); };
  const phase0 = e.phase;
  // Título, duración y total de episodios que informa el reproductor
  const meta = (p) => {
    try {
      if (!v) {
        const pl = p.getPlaylist && p.getPlaylist();
        if (pl && pl.length && pl.length !== s.eps) { if (s.builtin) { S.seriesOverride = S.seriesOverride || {}; S.seriesOverride[s.id] = { eps: pl.length }; } else { const x = (S.series || []).find((y) => y.id === s.id); if (x) x.eps = pl.length; } save(); }
      }
      const d = p.getVideoData && p.getVideoData();
      if (d && d.title && e.title !== d.title) { e.title = d.title; if (v && !v.title) v.title = d.title; save(); const t = $(v ? "h2" : "#eptitle", box); if (t) t.textContent = v ? v.title : d.title; }
      const dur = p.getDuration && p.getDuration();
      if (dur > 0 && !e.min) { e.min = Math.max(1, Math.round(dur / 60)); if (v && !v.min) v.min = e.min; save(); }
    } catch (er) {}
  };
  loadYT().then((YT) => {
    if (!$("#ytp") || epSel !== n) return;
    const pv = { rel: 0, hl: "es", cc_load_policy: phase0 && phase0 !== "sin_subs" ? 1 : 0, cc_lang_pref: phase0 === "subs_es" ? "es" : "en", playsinline: 1 };
    const opts = { width: "100%", height: "100%", host: "https://www.youtube-nocookie.com", playerVars: v ? pv : { ...pv, listType: "playlist", list: s.list },
      events: {
        onReady: (ev) => { try { if (!v) ev.target.cuePlaylist({ listType: "playlist", list: s.list, index: n - 1 }); } catch (er) {} setTimeout(() => meta(ev.target), 800); },
        onApiChange: (ev) => { if (e.phase) applyCaptions(ev.target, e.phase); },
        onStateChange: (ev) => { if (ev.data === 1 && e.phase) applyCaptions(ev.target, e.phase); meta(ev.target); },
        onError: fb } };
    if (v) opts.videoId = v.vid;
    ytPlayer = new YT.Player("ytp", opts);
  }).catch(fb);
}

// Pestaña en Inmersión
(() => {
  const base = RENDER.inmersion;
  RENDER.inmersion = (m) => {
    if (iTab === "series") {
      m.innerHTML = `<h1>Inmersión</h1><div class="tabs">${[["plan", "Mi plan"], ["registro", "Registro"], ["series", "📺 Series"], ["guia", "Guía completa"], ["recursos", "Recursos"]].map(([k, l]) => `<button class="tab ${iTab === k ? "on" : ""}" data-t="${k}">${l}</button>`).join("")}</div><div id="ibody"></div>`;
      $$("[data-t]", m).forEach((b) => b.onclick = () => { try { ytPlayer && ytPlayer.destroy(); } catch (er) {} ytPlayer = null; iTab = b.dataset.t; seriesSel = epSel = null; render(); });
      return immSeries($("#ibody"));
    }
    base(m);
    const tabs = $(".tabs", m); if (tabs && !$('[data-t="series"]', tabs)) {
      const reg = $('[data-t="registro"]', tabs); reg.insertAdjacentHTML("afterend", `<button class="tab" data-t="series">📺 Series</button>`);
      $('[data-t="series"]', tabs).onclick = () => { iTab = "series"; seriesSel = epSel = null; render(); };
    }
  };
})();
