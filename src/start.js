// ---------- Arranque ----------
loadLocal();
window.addEventListener("hashchange", route);
route();
initCaps();
loadAudioIndex();
try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => { if (view === "ajustes") { const y = window.scrollY; render(); window.scrollTo(0, y); } }; } catch (e) {}
try { if (!inClaude() && "serviceWorker" in navigator && location.protocol === "https:" && window.top === window) navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) {}
