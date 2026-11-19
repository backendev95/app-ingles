// ---------- Arranque ----------
loadLocal();
window.addEventListener("hashchange", route);
route();
initCaps();
try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; } catch (e) {}
try { if (!inClaude() && "serviceWorker" in navigator && location.protocol === "https:" && window.top === window) navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) {}
