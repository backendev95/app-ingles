// ===== PRONUNCIACIÓN ESCRITA E IMÁGENES EN TODA LA APP =====

// ---------- Pronunciación ----------
const PHON_TIPS = {
  silent_k: "La «k» inicial es muda (knife = <i>naif</i>).", silent_w: "La «w» inicial es muda (write = <i>rait</i>).", silent_b: "La «b» no suena (climb = <i>klaim</i>).",
  silent_p: "La «p» inicial es muda.", silent_h: "La «h» es muda en esta palabra.", silent_t: "La «t» no suena (listen = <i>lisen</i>).", silent_l: "La «l» no suena (walk = <i>uok</i>).",
  silent_gh: "La «gh» no suena.", silent_s: "La «s» no suena (island = <i>ailend</i>).", silent_d: "La primera «d» no suena.", silent_g: "La «g» no suena.",
  ed_t: "La terminación -ed suena como «t», sin agregar sílaba.", ed_d: "La terminación -ed suena como «d», sin agregar sílaba.", ed_id: "Aquí la -ed sí se dice como sílaba aparte: «id».",
  s_cons: "No digas «e» al principio: es <i>school</i>, no <i>eschool</i>.",
  th: "«th» (θ): la lengua entre los dientes y sopla, como la «z» de España.", dh: "«th» suave (ð): la lengua entre los dientes, vibrando, como la «d» de «cada».",
  v: "La «v» se dice con los dientes de arriba sobre el labio de abajo; no es «b».", z: "La «z» zumba como una abeja (zzz); no es «s».",
  ih: "La «i» es corta y relajada, casi una «e» (ship, sit).", iy: "La «i» es larga y tensa (sheep, seat): estira los labios.", ae: "La «a» (æ) es abierta, entre «a» y «e»: abre la boca y sonríe.",
  schwa: "Las vocales sin acento se reducen a un sonido débil (ə), como una «e» muy corta.", sh: "«sh» (ʃ): como cuando pides silencio, ¡shh!", jh: "«j/g» (dʒ): como «ll» fuerte, «yo» bien pronunciado.",
  zh: "«ʒ»: como «sh» pero con vibración (vision, usually).", h: "La «h» se aspira suave, como una «j» muy suave.", r: "La «r» no vibra: enrosca la lengua hacia atrás sin tocar el paladar.",
  ng: "«ng» (ŋ): la «g» final casi no se oye; el sonido sale por la nariz.", final: "Pronuncia las consonantes finales, no las cortes.",
};
const syl = (c) => c.startsWith("syl") ? `Se dice en ${c.slice(3)} sílaba${c.slice(3) === "1" ? "" : "s"}, menos de las que parece por la escritura.` : "";
const phonKey = (w) => w.toLowerCase().replace(/[’‘]/g, "'").replace(/^'+|'+$/g, "");
function phonFor(text) {
  const clean = String(text || "").replace(/\(.*?\)|\.\.\.|…|\+.*$/g, " ").replace(/\//g, " ").trim();
  const ws = clean.match(/[A-Za-z]+(?:['’][a-z]+)?/g);
  if (!ws || ws.length > 7) return null;
  const ps = ws.map((w) => PHON[phonKey(w)]);
  if (ps.some((p) => !p)) return null;
  const tips = [];
  ps.forEach((p) => p[2].split(",").filter(Boolean).forEach((c) => { if (!tips.includes(c)) tips.push(c); }));
  const prio = (c) => c.startsWith("silent") || c.startsWith("syl") || c.startsWith("ed_") || c === "s_cons" ? 0 : 1;
  tips.sort((a, b) => prio(a) - prio(b));
  return { ipa: ps.map((p) => p[0]).join(" "), es: ps.map((p) => p[1]).join(" "), tips: tips.slice(0, ws.length > 1 ? 2 : 3), one: ws.length === 1 };
}
const tipText = (c) => PHON_TIPS[c] || syl(c);
function pronHTML(text, o = {}) {
  if (S.settings.pronShow === false) return "";
  const p = phonFor(text); if (!p) return "";
  const ipa = S.settings.ipaShow !== false;
  return `<div class="pron ${o.big ? "big" : ""}">${ipa ? `<span class="ipa">/${esc(p.ipa)}/</span>` : ""}${ipa ? " · " : ""}<span class="resp" title="Pronunciación a la española. MAYÚSCULAS = sílaba fuerte">${esc(p.es)}</span>${o.tips && p.tips.length ? `<ul class="ptips">${p.tips.map((c) => `<li>${tipText(c)}</li>`).join("")}</ul>` : ""}</div>`;
}

// ---------- Imágenes ----------
function picFor(text) {
  if (S.settings.picsShow === false) return "";
  const k = String(text || "").toLowerCase().trim();
  return PICS[k] || (globalThis.PIC_VISUAL || {})[k] || PICS[k.replace(/\s*\(.*?\)/g, "")] || "";
}
const arasId = (text) => { const k = String(text || "").toLowerCase().trim(); return ARAS[k] || ARAS[k.replace(/\s*\(.*?\)/g, "")] || ARAS[k.replace(/^to /, "")] || 0; };
const arasURL = (id) => `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
function picHTML(text, cls = "") {
  if (S.settings.picsShow === false) return "";
  const id = S.settings.picStyle !== "emoji" ? arasId(text) : 0, emo = picFor(text);
  if (id) return `<img class="aras ${cls}" src="${arasURL(id)}" alt="" loading="lazy" data-emo="${esc(emo)}">`;
  return emo ? `<span class="pic ${cls}" aria-hidden="true">${emo}</span>` : "";
}
document.addEventListener("error", (e) => { const t = e.target; if (t && t.tagName === "IMG" && t.classList.contains("aras") && t.isConnected) { const s = document.createElement("span"); s.className = t.className.replace("aras", "pic"); s.textContent = t.dataset.emo || ""; t.replaceWith(s); } }, true);
const hasPic = (text) => S.settings.picsShow !== false && !!(arasId(text) || picFor(text));

// Fotos reales (Wikipedia) solo para objetos y lugares del vocabulario visual
const PHOTO_TITLE = { saw: "Hand saw", nail: "Nail (fastener)", glass: "Tumbler (glass)", pan: "Frying pan", ring: "Ring (jewellery)", watch: "Watch", cap: "Baseball cap", bank: "Bank", plant: "Houseplant", key: "Key (lock)", lock: "Padlock", plug: "AC power plugs and sockets", battery: "Battery (electricity)", star: "Star", sun: "Sun", bed: "Bed", trousers: "Trousers", trainers: "Sneakers", underground: "Metro station", bike: "Bicycle", motorbike: "Motorcycle", boat: "Boat", truck: "Truck", plane: "Airliner", fish: "Fish as food", chicken: "Chicken as food", meat: "Meat", head: "Human head", eye: "Human eye", ear: "Ear", nose: "Human nose", mouth: "Mouth", hand: "Hand", arm: "Arm", leg: "Human leg", foot: "Foot", heart: "Heart", bone: "Bone", tooth: "Tooth", sponge: "Sponge (tool)", broom: "Broom", bucket: "Bucket", soap: "Soap", towel: "Towel", toilet: "Toilet", fridge: "Refrigerator", sofa: "Couch", lamp: "Lamp", mirror: "Mirror", window: "Window", door: "Door", chair: "Chair", shower: "Shower", bathtub: "Bathtub", school: "School", church: "Church (building)", park: "Urban park", river: "River", island: "Island", city: "City", bridge: "Bridge", library: "Library", museum: "Museum", airport: "Airport", house: "House", building: "Building", hotel: "Hotel", hospital: "Hospital", supermarket: "Supermarket", stadium: "Stadium", beach: "Beach", mountain: "Mountain", coat: "Coat", hat: "Hat", scarf: "Scarf", gloves: "Glove", glasses: "Glasses", bag: "Handbag", backpack: "Backpack", wallet: "Wallet", boots: "Boot", socks: "Sock", dress: "Dress", shirt: "Shirt", "t-shirt": "T-shirt", shoes: "Shoe", fork: "Fork", spoon: "Spoon", knife: "Knife", plate: "Plate (dishware)", cup: "Cup", candle: "Candle", envelope: "Envelope", parcel: "Parcel (package)", map: "Map", compass: "Compass", tent: "Tent", rope: "Rope", thread: "Yarn", pillow: "Pillow", blanket: "Blanket", hammer: "Hammer", screwdriver: "Screwdriver", ladder: "Ladder", scissors: "Scissors", "magnifying glass": "Magnifying glass", cookie: "Cookie", cake: "Cake", "ice cream": "Ice cream", juice: "Juice", milk: "Milk", tea: "Tea", coffee: "Coffee", soup: "Soup", corn: "Maize", potato: "Potato", rice: "Rice", bread: "Bread", cheese: "Cheese", egg: "Egg as food", grapes: "Grape", lemon: "Lemon", banana: "Banana", apple: "Apple", strawberry: "Strawberry", pineapple: "Pineapple", avocado: "Avocado", tomato: "Tomato", carrot: "Carrot", onion: "Onion", garlic: "Garlic", mushroom: "Edible mushroom", salt: "Salt", water: "Drinking water", tree: "Tree", flower: "Flower", leaf: "Leaf", sea: "Sea", moon: "Moon", rain: "Rain", snow: "Snow", dog: "Dog", cat: "Cat", bird: "Bird", horse: "Horse", cow: "Cattle", pig: "Pig", "chicken (animal)": "Chicken", butterfly: "Butterfly", bee: "Bee", snake: "Snake", monkey: "Monkey", car: "Car", bus: "Bus", taxi: "Taxicab", train: "Train", doctor: "Physician", nurse: "Nursing", teacher: "Teacher", farmer: "Farmer", chef: "Chef", firefighter: "Firefighter", "police officer": "Police officer", pilot: "Aircraft pilot", mechanic: "Mechanic", scientist: "Scientist", artist: "Artist", judge: "Judge" };
let photoCache = {};
try { photoCache = JSON.parse(localStorage.getItem("ingles-photos") || "{}"); } catch (e) {}
const photoOK = (w) => S.settings.photos !== false && !inClaude() && navigator.onLine !== false && PHOTO_TITLE[String(w).toLowerCase()] !== undefined;
async function photoFor(w) {
  const k = String(w).toLowerCase();
  if (photoCache[k] !== undefined) return photoCache[k];
  const title = PHOTO_TITLE[k] || w;
  let url = "";
  try {
    const r = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title.replace(/ /g, "_")));
    if (r.ok) { const d = await r.json(); if (d.type !== "disambiguation") url = (d.thumbnail || {}).source || ""; }
  } catch (e) { return ""; }
  photoCache[k] = url;
  try { localStorage.setItem("ingles-photos", JSON.stringify(photoCache)); } catch (e) {}
  return url;
}
const photoHTML = (w) => photoOK(w) ? `<div class="photo" data-photo="${esc(w)}"></div>` : "";
function bindPhotos(root) {
  $$("[data-photo]", root || document).forEach(async (el) => {
    const w = el.dataset.photo, url = await photoFor(w);
    if (!url || !el.isConnected) { el.remove(); return; }
    el.innerHTML = `<img src="${esc(url)}" alt="${esc(w)}" loading="lazy"><button class="icon-btn hide-photo" title="Ocultar esta foto">✕</button><span class="credit">Foto: Wikipedia</span>`;
    $("img", el).onerror = () => el.remove();
    $(".hide-photo", el).onclick = (e) => { e.stopPropagation(); photoCache[w.toLowerCase()] = ""; try { localStorage.setItem("ingles-photos", JSON.stringify(photoCache)); } catch (er) {} el.remove(); };
  });
}
// Las fotos se cargan solas cada vez que se dibuja una vista
new MutationObserver(() => { if (document.querySelector(".photo:empty")) bindPhotos(document); }).observe(document.body, { childList: true, subtree: true });

// ---------- Guía: cómo leer la pronunciación ----------
const pronGuide = () => `<details class="card pguide"><summary><b>🔤 Cómo leer la pronunciación</b></summary>
  <p>Cada palabra muestra dos cosas: la <b>fonética internacional</b> (IPA, entre barras, la que usan los diccionarios) y la <b>pronunciación a la española</b>, escrita con letras que ya sabes leer. La sílaba en <b>MAYÚSCULAS</b> es la que lleva la fuerza.</p>
  <div class="list">${[["comfortable", "3 sílabas, no 4"], ["island", "s muda"], ["thought", "th con la lengua entre los dientes"], ["walked", "-ed suena «t»"], ["vegetable", "v con dientes y labio"]].map(([w, n]) => `<div class="li"><div><b>${picHTML(w)} ${w}</b> <span class="muted small">— ${n}</span>${pronHTML(w)}</div>${speakBtn(w)}</div>`).join("")}</div>
  <h3>Lo que significan las letras «a la española»</h3>
  <ul class="small"><li><b>ii</b> = i larga (sheep = <i>shiip</i>); <b>i</b> = i corta y relajada (ship = <i>ship</i>).</li><li><b>uu</b> = u larga (food = <i>fuud</i>).</li><li><b>e</b> en sílabas débiles = la vocal neutra ə, muy corta.</li><li><b>z</b> = th como la z de España (think = <i>zink</i>); la <b>d</b> de <i>the</i> es suave.</li><li><b>s</b> puede ser una z que zumba: revisa el consejo de cada palabra.</li><li><b>sh</b> = como pedir silencio; <b>y</b> = la j de <i>job</i> (dʒ), como «yo» fuerte.</li><li><b>j</b> = h aspirada suave (house = <i>jaus</i>).</li><li><b>r</b> = r inglesa: no vibra.</li></ul>
  <h3>Símbolos IPA más útiles</h3>
  <div class="ipagrid">${[["i", "sheep"], ["ɪ", "ship"], ["æ", "cat"], ["ʌ", "cup"], ["ɑ", "hot"], ["ɔ", "thought"], ["ʊ", "book"], ["u", "food"], ["ə", "about"], ["ɝ", "bird"], ["eɪ", "day"], ["aɪ", "my"], ["oʊ", "go"], ["aʊ", "now"], ["θ", "think"], ["ð", "this"], ["ʃ", "she"], ["ʒ", "vision"], ["tʃ", "chair"], ["dʒ", "job"], ["ŋ", "sing"], ["j", "yes"], ["ˈ", "acento fuerte"]].map(([s, w]) => `<span><b>${s}</b> ${w}</span>`).join("")}</div>
  <p class="small muted">Pictogramas de ARASAAC (Sergio Palao, Gobierno de Aragón, licencia CC BY-NC-SA). Pronunciación estadounidense, según el diccionario CMU. ${S && S.settings ? "Puedes ocultar la IPA o todo esto en Ajustes." : ""}</p></details>`;

// ---------- Quiz con imágenes ----------
function visualPool() {
  const levelOKv = (c) => c.level === "DEV" || (LEVELS.includes(c.level) && lvlIdx(c.level) <= lvlIdx(S.level));
  return allCards().filter((c) => !c.irr && hasPic(c.en) && levelOKv(c));
}
function visualQuiz(m, onExit) {
  const pool = visualPool();
  if (pool.length < 8) { toast("Todavía no hay suficientes palabras con imagen en tu nivel"); return; }
  const concrete = pool.filter((c) => arasId(c.en) || (globalThis.PIC_VISUAL || {})[c.en.toLowerCase()]);
  const picks = shuffle(pool.slice()).slice(0, 6).concat(shuffle(concrete.length >= 8 ? concrete : pool).filter((x) => true).slice(0, 6));
  const items = shuffle(picks.map((w, i) => [w, i >= 6 ? 1 : 0]).filter((x, i, arr) => arr.findIndex((y) => y[0].en === x[0].en) === i)).map(([w, k]) => {
    const others = shuffle(pool.filter((x) => x.en !== w.en && x.es !== w.es && (arasId(x.en) || picFor(x.en)) !== (arasId(w.en) || picFor(w.en)))).slice(0, 3), opts = shuffle([w, ...others]);
    let ex; if (k % 2) { ex = ["mc", "¿Qué palabra es?", opts.map((x) => x.en), opts.indexOf(w), `${w.en} = ${w.es}`]; ex.pic = picHTML(w.en, "quiz"); return ex; }
    ex = ["mc", `¿Qué imagen corresponde a «${w.en}»?`, opts.map((x) => x.es), opts.indexOf(w), `${w.en} = ${w.es}`]; ex.optHTML = opts.map((x) => picHTML(x.en, "opt")); return ex;
  });
  exerciseRunner(m, items, { title: "🖼️ Quiz con imágenes", subtitle: "Asocia la palabra con su imagen", onExit, onFinish: (c, n) => {
    skill("vocab", c, n); addXP(c * 2);
    m.innerHTML = `<div class="card center"><div class="big">🖼️</div><h2>${c} de ${n}</h2><p class="muted">Asociar cada palabra con una imagen la fija en la memoria mucho mejor que una traducción sola.</p><div class="row center"><button class="btn" id="again">Otra ronda</button><button class="btn ghost" id="back">Volver</button></div></div>`;
    $("#again").onclick = () => visualQuiz(m, onExit); $("#back").onclick = onExit;
  } });
}
