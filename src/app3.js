// ===== CHUNKS, HISTORIAS, RETELLING Y HABLA 1 MINUTO =====

// ---------- Tarjetas de chunks (3 nuevas por día) ----------
const CHUNK_CARDS = CHUNKS.flatMap((g) => g.items.map((it, k) => ({ id: "CH-" + g.id.slice(3) + "-" + k, level: g.level, topic: g.title, en: it[0], es: it[1], ex: it[2], chunk: true })));
const chunkCore = (c) => c.replace(/\.\.\.|…|\?|\+.*$|\(.*?\)/g, "").split("/")[0].trim();

// Convierte los ejercicios del contenido al formato del motor de ejercicios
function chunkDrills(g) {
  const conv = g.drills.map((d) => d[0] === "sub" ? ["sub", d[1], d[3], d[4] || "", d[2]] : d[0] === "blocks" ? ["blocks", d[1], d[2]] : d);
  const meaning = shuffle(g.items.slice()).slice(0, 3).map((it) => {
    const others = shuffle(g.items.filter((x) => x !== it)).slice(0, 2).map((x) => x[1]);
    const opts = shuffle([it[1], ...others]);
    return ["mc", `¿Qué significa «${it[0]}»?`, opts, opts.indexOf(it[1]), it[2]];
  });
  return shuffle(conv.concat(meaning));
}

// ---------- Vista Chunks ----------
RENDER.chunks = (m) => {
  if (sub && sub.chunkRun) {
    const g = sub.chunkRun;
    return exerciseRunner(m, sub.items, { title: g.title, subtitle: "Práctica de chunks", onExit: () => { sub = { chunk: g }; render(); },
      onFinish: (c, n, wrongs) => {
        const sc = c / n; S.chunks[g.id] = Math.max(S.chunks[g.id] || 0, sc); skill("grammar", c, n); addXP(c * 3); save();
        m.innerHTML = `<div class="card center"><div class="big">🧩</div><h2>${c} de ${n} correctas</h2><p class="muted">Los chunks se aprenden usándolos. Ahora intenta decir en voz alta 3 frases tuyas con los bloques de este grupo.</p>${wrongs.length ? `<div class="list left">${wrongs.map((w) => `<div class="li"><div><b>${esc(w.answer)}</b><div class="small muted">${esc(w.q)}</div></div>${speakBtn(w.answer)}</div>`).join("")}</div>` : ""}<div class="row center"><button class="btn" id="again">Repetir</button><button class="btn ghost" id="back">Volver al grupo</button></div></div>`;
        $("#again").onclick = () => { sub = { chunkRun: g, items: chunkDrills(g) }; render(); };
        $("#back").onclick = () => { sub = { chunk: g }; render(); };
      } });
  }
  if (sub && sub.chunk) return chunkPage(m, sub.chunk);
  const list = CHUNKS.slice().sort((a, b) => lvlIdx(a.level) - lvlIdx(b.level));
  const learned = CHUNK_CARDS.filter((c) => S.cards[c.id] && S.cards[c.id].reps >= 2).length;
  m.innerHTML = `<h1>Chunks</h1>
  <div class="card hero"><p>Un <b>chunk</b> es un bloque de palabras que los nativos usan como si fuera una sola pieza: <i>“If you ask me”</i>, <i>“I'm looking forward to”</i>, <i>“make a decision”</i>. Aprenderlos enteros te da fluidez, porque no construyes la frase palabra por palabra.</p>
  <p class="small muted">Cómo practicar: 1) escucha y repite cada chunk con su ejemplo, 2) haz la práctica (plantillas, sustitución y bloques), 3) úsalos en <b>Habla 1 minuto</b>.</p>
  <label class="cando"><input type="checkbox" id="chcards" ${S.settings.chunkCards === false ? "" : "checked"}> <span><b>Incluir chunks en mis tarjetas diarias</b> (3 nuevos por día, de tu nivel o inferior)</span></label>
  <div class="bar"><i style="width:${pct(learned, CHUNK_CARDS.length)}%"></i></div><div class="small muted">${learned} de ${CHUNK_CARDS.length} chunks consolidados en tarjetas</div></div>
  <div class="lessons">${list.map((g) => { const ok = lvlIdx(g.level) <= lvlIdx(S.level), b = S.chunks[g.id]; return `<button class="lesson ${ok ? "" : "dim"}" data-g="${g.id}"><span class="num">${g.level}</span><span><b>${g.icon} ${esc(g.title)}</b><small>${g.items.length} chunks · ${g.drills.length + 3} ejercicios${b !== undefined ? ` · Mejor: ${Math.round(b * 100)}%` : ""}${ok ? "" : " · Por encima de tu nivel"}</small></span><span class="st">${b >= 0.8 ? "✅" : ""}</span></button>`; }).join("")}</div>`;
  $("#chcards").onchange = (e) => { S.settings.chunkCards = e.target.checked; vq = null; save(); };
  $$("[data-g]", m).forEach((b) => b.onclick = () => { sub = { chunk: CHUNKS.find((g) => g.id === b.dataset.g) }; render(); });
};
function chunkPage(m, g) {
  m.innerHTML = `<div class="row between"><div><h1>${g.icon} ${esc(g.title)}</h1><div class="muted small">Nivel ${g.level}</div></div><button class="btn ghost small" id="exit">Volver</button></div>
  <div class="card note">${esc(g.intro)}</div>
  <div class="row"><button class="btn" id="practice">⚡ Practicar (${g.drills.length + 3})</button><button class="btn ghost" id="playall">🔊 Escuchar todos</button></div>
  <div class="list">${g.items.map(([en, es, ex]) => `<div class="card chunkcard"><div class="row between"><div><b class="chunk">${esc(en)}</b> <span class="muted">— ${esc(es)}</span></div>${speakBtn(en)}</div><p class="exs">“${esc(ex)}” ${speakBtn(ex)} <button class="icon-btn" data-speak="${esc(ex)}" data-rate="0.7">🐢</button></p>${csBox(ex, false)}</div>`).join("")}</div>
  <div class="card"><h2>Reto</h2><p>Elige 3 chunks de esta lista y di en voz alta una frase <b>sobre tu vida</b> con cada uno. Grábate y escúchate.</p><div class="center">${recorderHTML("chunk-" + g.id, 60)}</div></div>`;
  $("#exit").onclick = () => { stopSpeech(); sub = null; render(); };
  $("#practice").onclick = () => { sub = { chunkRun: g, items: chunkDrills(g) }; render(); };
  $("#playall").onclick = () => speakLines(g.items.flatMap(([en, , ex]) => [[0, en], [0, ex]]));
  bindRecorders(m);
}

// ---------- Historias graduadas ----------
function storiesList(box) {
  const done = STORIES.filter((s) => S.done.story[s.id] !== undefined).length;
  box.innerHTML = `<div class="card hero"><h2>📚 ${esc(STORY_SERIES.title)}</h2><p>${esc(STORY_SERIES.intro)}</p>
    <details><summary><b>Personajes</b></summary><div class="list">${STORY_SERIES.cast.map(([n, d]) => `<div class="li"><div><b>${esc(n)}</b> — ${esc(d)}</div></div>`).join("")}</div></details>
    <div class="bar"><i style="width:${pct(done, STORIES.length)}%"></i></div><div class="small muted">${done} de ${STORIES.length} episodios leídos</div>
    <p class="small muted">Consejo: escucha el episodio primero sin leer, luego léelo, responde las preguntas y termina con <b>“Cuéntalo con tus palabras”</b>.</p></div>
  <div class="lessons">${STORIES.map((s) => { const ok = S.unlocked.includes(s.level), b = S.done.story[s.id]; return `<button class="lesson ${ok ? "" : "dim"}" data-s="${s.id}" ${ok ? "" : "disabled"}><span class="num">${s.ep}</span><span><b>${esc(s.title)}</b><small>${s.level} · ~${s.text.split(/\s+/).length} palabras${b !== undefined ? ` · Mejor: ${Math.round(b * 100)}%` : ""}${ok ? "" : " · 🔒 Se desbloquea en " + s.level}</small></span><span class="st">${b >= 0.75 ? "✅" : ""}</span></button>`; }).join("")}</div>`;
  $$("[data-s]", box).forEach((b) => b.onclick = () => { sub = { story: STORIES.find((s) => s.id === b.dataset.s) }; render(); });
}

// ---------- Sesión de habla cronometrada (grabación + transcripción) ----------
function timedSpeak(box, o) {
  // o: { key, seconds, onDone(text, secs) }
  let left = o.seconds, timer = null, text = "", running = false, started = 0;
  box.innerHTML = `<div class="card center"><div class="timer" id="tm">${fmtSec(left)}</div><p class="muted small" id="tmh">Cuando toques “Empezar” se grabará tu voz${dictApi ? " y se transcribirá lo que digas" : ""}. Habla sin parar: si te bloqueas, usa una muletilla (<i>Let me think…</i>) y sigue.</p>
    <div class="row center"><button class="btn big-btn" id="go">▶️ Empezar</button><button class="btn ghost" id="end" hidden>⏹️ Terminar</button></div>
    <div class="hidden-rec" hidden>${recorderHTML(o.key, o.seconds + 2)}</div><p class="live" id="live"></p></div>`;
  bindRecorders(box);
  const recBtn = $("[data-rec]", box);
  const stopAll = () => {
    if (!running) return; running = false; clearInterval(timer);
    if (recState.active === o.key && recState.rec) recState.rec.stop();
    if (dictApi) dictApi.stop().catch(() => {});
    const secs = Math.round((Date.now() - started) / 1000);
    $("#end").hidden = true; $("#tmh").textContent = "✓ Terminado. Revisa tu resultado abajo."; $("#tm").classList.remove("warn");
    setTimeout(() => o.onDone(text.trim(), secs), dictApi ? 900 : 100);
  };
  $("#go").onclick = () => {
    running = true; started = Date.now(); $("#go").hidden = true; $("#end").hidden = false; $("#tmh").textContent = "Grabando… habla en inglés.";
    try { recBtn.click(); } catch (e) {}
    if (dictApi) {
      dictH.partial = ({ text: t }) => { const l = $("#live"); if (l) l.textContent = (text + " " + t).trim(); };
      dictH.final = ({ text: t }) => { text = (text + " " + t).trim(); const l = $("#live"); if (l) l.textContent = text; };
      dictH.state = ({ state }) => { if (state !== "listening" && running) dictApi.start().catch(() => {}); };
      dictApi.start().catch(() => {});
    }
    timer = setInterval(() => { left--; const t = $("#tm"); if (t) { t.textContent = fmtSec(Math.max(0, left)); t.classList.toggle("warn", left <= 10); } if (left <= 0) stopAll(); }, 1000);
  };
  $("#end").onclick = stopAll;
}
const fmtSec = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
const speakSeconds = (lv) => ({ A2: 60, B1: 90, B2: 120, C1: 150, C2: 180 }[lv] || 90);

function rubricHTML(items) { return `<div class="list">${items.map((r, k) => `<label class="cando"><input type="checkbox" data-rb="${k}"> <span>${r}</span></label>`).join("")}</div>`; }
const readRubric = (box) => $$("[data-rb]", box).filter((x) => x.checked).length;

// ---------- Retelling ----------
const retellText = (item) => item.text || (item.lines || []).map(([sp, t]) => `${sp}: ${t}`).join("\n");
function retellPoints(item) { return (item.q || []).map((q) => `${q[0]} → ${q[1][q[2]]}`); }
function retellList(box) {
  const pool = STORIES.map((s) => ({ ...s, kind: "📚 Historia" })).concat(ALL_READINGS.map((r) => ({ ...r, kind: "📖 Lectura" })), ALL_LISTENING.map((l) => ({ ...l, kind: "🎧 Audio" }))).filter((x) => S.unlocked.includes(x.level));
  pool.sort((a, b) => (b.level === S.level) - (a.level === S.level) || lvlIdx(b.level) - lvlIdx(a.level));
  const log = S.retell.slice(0, 5);
  box.innerHTML = `<div class="card note"><p><b>Retelling</b> = contar con tus palabras algo que acabas de leer o escuchar. Es una de las técnicas de <b>output forzado</b> más eficaces: te obliga a recuperar vocabulario, ordenar ideas y usar el pasado.</p><p class="small muted">También lo encuentras al final de cada lectura, historia o audio con el botón “Cuéntalo con tus palabras”.</p></div>
  ${log.length ? `<h2>Últimos retellings</h2><div class="list">${log.map((r) => `<div class="li"><div><b>${esc(r.title)}</b><div class="small muted">${new Date(r.at).toLocaleDateString()} · ${r.words} palabras · ${r.points}/${r.total} ideas · rúbrica ${r.rubric}/5</div></div></div>`).join("")}</div>` : ""}
  <h2>Elige un texto</h2><div class="lessons">${pool.slice(0, 40).map((x) => `<button class="lesson" data-r="${x.id}"><span class="num">${x.level}</span><span><b>${esc(x.title)}</b><small>${x.kind}${S.retell.some((r) => r.id === x.id) ? " · ✓ hecho" : ""}</small></span></button>`).join("")}</div>`;
  $$("[data-r]", box).forEach((b) => b.onclick = () => { sub = { retell: pool.find((x) => x.id === b.dataset.r) }; render(); });
}
function retellPage(m, item, back) {
  const secs = speakSeconds(item.level), pts = retellPoints(item), kw = (item.gloss || []).map((g) => g[0]);
  const isL = !item.text;
  m.innerHTML = `<div class="row between"><div><h1>🗣️ Cuéntalo con tus palabras</h1><div class="muted small">${esc(item.title)} · ${item.level} · ${secs} segundos</div></div><button class="btn ghost small" id="exit">Volver</button></div>
  <div class="card"><ol class="steps"><li>${isL ? "Escucha el audio una vez más" : "Lee o escucha el texto una vez más"}, sin tomar notas largas.</li><li>Mira las palabras clave (no las frases).</li><li>Toca “Empezar” y cuenta la historia en pasado, con tus palabras, hasta que termine el tiempo.</li><li>Revisa qué ideas incluiste y evalúate con la rúbrica.</li></ol>
  <div class="row">${isL ? `<button class="btn ghost" id="lis">▶️ Escuchar</button>` : speakBtn(item.text, "🔊 Escuchar el texto")}<button class="btn ghost" id="peek">👀 Ver el texto</button></div><div id="txt" hidden class="reading small">${esc(retellText(item)).replace(/\n/g, "<br>")}</div></div>
  ${kw.length ? `<div class="card"><b>Palabras clave para usar:</b><div class="chips">${kw.map((k) => `<span class="chip">${esc(k)}</span>`).join("")}</div></div>` : ""}
  <div class="card"><b>Conectores útiles:</b><div class="chips">${["At first,", "Then,", "After that,", "It turned out that...", "All of a sudden,", "In the end,", "The main point is..."].map((k) => `<span class="chip">${esc(k)}</span>`).join("")}</div></div>
  <div id="ts"></div><div id="res"></div>`;
  $("#exit").onclick = () => { stopSpeech(); back(); };
  $("#peek").onclick = () => { const t = $("#txt"); t.hidden = !t.hidden; };
  if ($("#lis")) $("#lis").onclick = () => speakLines(item.lines.map(([sp, t]) => [sp.charCodeAt(0) - 65, t]));
  timedSpeak($("#ts"), { key: "retell-" + item.id, seconds: secs, onDone: (said, used) => {
    const words = said ? said.split(/\s+/).length : 0, used_kw = kw.filter((k) => norm(said).includes(norm(k)));
    $("#txt").hidden = true;
    $("#res").innerHTML = `<div class="card"><h2>Tu retelling</h2>
      ${said ? `<p class="reading">${esc(said)}</p><p class="small muted">${words} palabras en ${used} s (${Math.round(words / Math.max(1, used) * 60)} palabras/minuto)${kw.length ? ` · Palabras clave usadas: ${used_kw.length}/${kw.length}` : ""}</p>` : `<p class="muted small">${dictApi ? "No se captó texto. " : ""}Escucha tu grabación para evaluarte.</p>`}
      <div class="center">${recorderHTML("retell-" + item.id, secs + 2)}</div>
      ${pts.length ? `<h3>¿Qué ideas incluiste?</h3><div class="list">${pts.map((p, k) => `<label class="cando"><input type="checkbox" data-pt="${k}" ${said && p.split("→")[1] && norm(said).includes(norm(p.split("→")[1]).split(" ").slice(0, 2).join(" ")) ? "checked" : ""}> <span>${esc(p)}</span></label>`).join("")}</div>` : ""}
      <h3>Rúbrica (marca lo que lograste)</h3>${rubricHTML(["Hablé casi todo el tiempo sin pausas largas", "Conté los hechos en orden y usé conectores", "Usé el pasado correctamente la mayoría de las veces", "Usé al menos 3 palabras clave o chunks nuevos", "Expliqué la idea principal o mi opinión al final"])}
      <div class="row"><button class="btn" id="save">Guardar</button><button class="btn ghost" id="again">Repetir</button></div></div>`;
    bindRecorders($("#res"));
    $("#again").onclick = () => retellPage(m, item, back);
    $("#save").onclick = () => {
      const points = $$("[data-pt]", m).filter((x) => x.checked).length, rubric = readRubric(m);
      S.retell.unshift({ id: item.id, title: item.title, at: Date.now(), words, points, total: pts.length, rubric }); S.retell = S.retell.slice(0, 100);
      skill("speaking", rubric, 5); addXP(10 + rubric * 2); if (extraTask().go === "hablar") markDaily("extra"); save(); toast("✓ Retelling guardado"); back();
    };
  } });
}

// ---------- Habla 1 minuto ----------
let minIdx = null;
function speakMinute(box) {
  const lv = LEVELS.includes(S.level) && SPEAK_PROMPTS[S.level] ? S.level : "A2";
  const pool = SPEAK_PROMPTS[lv];
  if (minIdx === null) { const d = Math.floor(Date.now() / DAY); minIdx = d % pool.length; }
  const [topic, es, chunks, guide] = pool[minIdx % pool.length];
  const todayDone = S.speak.some((x) => new Date(x.at).toDateString() === new Date().toDateString());
  const days = new Set(S.speak.map((x) => new Date(x.at).toDateString())).size;
  box.innerHTML = `<div class="card note"><p><b>Habla 1 minuto</b> cada día sobre un tema, sin parar. Es output forzado: tu cerebro tiene que buscar las palabras en vez de reconocerlas. Usa los chunks sugeridos.</p><p class="small muted">${todayDone ? "✅ Ya hablaste hoy. " : ""}Días practicados: <b>${days}</b> · Total de sesiones: <b>${S.speak.length}</b></p></div>
  <div class="card excard"><div class="row between"><span class="badge">${lv} · Tema del día</span><button class="btn ghost small" id="other">🔀 Otro tema</button></div>
    <p class="big-text">${esc(topic)} ${speakBtn(topic)}</p><p class="muted">${esc(es)}</p>
    <b>Para guiarte:</b><ul>${guide.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>
    <b>Chunks sugeridos:</b><div class="chips">${chunks.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
    <p class="small muted">Tienes 15 segundos para pensar antes de empezar (opcional). Luego, 60 segundos.</p></div>
  <div id="ts"></div><div id="res"></div>
  ${S.speak.length ? `<details class="card"><summary><b>Historial</b></summary><div class="list">${S.speak.slice(0, 15).map((x) => `<div class="li"><div><b>${esc(x.topic)}</b><div class="small muted">${new Date(x.at).toLocaleDateString()} · ${x.words} palabras · ${x.chunks} chunks · rúbrica ${x.rubric}/5</div></div></div>`).join("")}</div></details>` : ""}`;
  $("#other").onclick = () => { minIdx++; render(); };
  timedSpeak($("#ts"), { key: "min-" + lv + minIdx, seconds: 60, onDone: (said, used) => {
    const words = said ? said.split(/\s+/).length : 0;
    const allChunks = chunks.concat(CHUNK_CARDS.filter((c) => lvlIdx(c.level) <= lvlIdx(lv)).map((c) => c.en));
    const found = [...new Set(allChunks.map(chunkCore).filter((c) => c.length > 3 && said && norm(said).includes(norm(c))))];
    $("#res").innerHTML = `<div class="card"><h2>Resultado</h2>
      ${said ? `<p class="reading">${esc(said)}</p><p class="small muted">${words} palabras en ${used} s (${Math.round(words / Math.max(1, used) * 60)} palabras/minuto). ${words / Math.max(1, used) * 60 >= 100 ? "¡Buen ritmo!" : "Meta: ir subiendo hacia 100–130 palabras por minuto."}</p>${found.length ? `<p><b>Chunks que usaste:</b> ${found.map((f) => `<span class="chip">${esc(f)}</span>`).join(" ")}</p>` : `<p class="small muted">No se detectaron chunks. La próxima vez intenta usar al menos dos de los sugeridos.</p>`}` : `<p class="muted small">Escucha tu grabación para evaluarte.</p>`}
      <div class="center">${recorderHTML("min-" + lv + minIdx, 62)}</div>
      <h3>Rúbrica</h3>${rubricHTML(["Hablé todo el minuto sin quedarme callado más de 3 segundos", "Respondí las preguntas guía", "Usé al menos 2 chunks", "Usé conectores (because, so, but, then…)", "Si me bloqueé, usé una muletilla y seguí"])}
      <div class="row"><button class="btn" id="save">Guardar</button><button class="btn ghost" id="again">Repetir el mismo tema</button></div>
      <p class="small muted">Truco: repite el mismo tema mañana. La segunda vez notarás que hablas más y con menos pausas.</p></div>`;
    bindRecorders($("#res"));
    $("#again").onclick = () => render();
    $("#save").onclick = () => {
      const rubric = readRubric($("#res"));
      S.speak.unshift({ topic, level: lv, at: Date.now(), words, chunks: found.length, rubric }); S.speak = S.speak.slice(0, 200);
      skill("speaking", rubric, 5); addXP(8 + rubric * 2); if (extraTask().go === "hablar") markDaily("extra"); save(); toast("✓ Sesión guardada"); render();
    };
  } });
}
