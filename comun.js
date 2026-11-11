/* Funciones compartidas por la carta (index.html) y el panel (admin.html) */
(function(){
const N = window.NAPOLES = {};

N.esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
N.money = n => "$" + Math.round(+n || 0).toLocaleString("es-CO").replace(/,/g, ".");
N.store = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};
N.clone = o => JSON.parse(JSON.stringify(o));
N.slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40) || ("p" + Date.now());
N.hourTxt = h => { h = +h; const ap = h >= 12 ? "p. m." : "a. m."; return `${h % 12 || 12}:00 ${ap}`; };

/* ---------- Firebase (solo si hay configuración) ---------- */
N.hasFirebase = () => !!window.FIREBASE_CONFIG;
N.firebase = function(){
  if (!N.hasFirebase()) return Promise.resolve(null);
  if (!N._fb) N._fb = (async () => {
    const v = window.FIREBASE_VERSION || "10.12.2", base = `https://www.gstatic.com/firebasejs/${v}/`;
    const appM = await import(base + "firebase-app.js");
    const fs = await import(base + "firebase-firestore.js");
    const auth = await import(base + "firebase-auth.js");
    const app = appM.initializeApp(window.FIREBASE_CONFIG);
    return { app, fs, db: fs.getFirestore(app), authM: auth, auth: auth.getAuth(app) };
  })();
  return N._fb;
};
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);

/* Carga la carta: Firebase > copia guardada > borrador del panel (demo) > ejemplo */
N.loadCarta = async function(){
  if (N.hasFirebase()) {
    try {
      const f = await withTimeout(N.firebase(), 8000);
      const snap = await withTimeout(f.fs.getDoc(f.fs.doc(f.db, "carta", "actual")), 8000);
      if (snap.exists()) { const c = snap.data(); N.store.set("napoles_carta_cache", c); return { carta: c, src: "firebase" }; }
      return { carta: N.clone(window.CARTA_EJEMPLO), src: "ejemplo" };
    } catch(e) {
      const c = N.store.get("napoles_carta_cache");
      return { carta: c || N.clone(window.CARTA_EJEMPLO), src: c ? "cache" : "ejemplo" };
    }
  }
  const b = N.store.get("napoles_carta_borrador");
  return { carta: b || N.clone(window.CARTA_EJEMPLO), src: b ? "demo-borrador" : "demo" };
};
N.loadFotos = async function(){
  if (N.hasFirebase()) {
    try {
      const f = await withTimeout(N.firebase(), 8000);
      const qs = await withTimeout(f.fs.getDocs(f.fs.collection(f.db, "fotos")), 10000);
      const out = {}; qs.forEach(d => { const x = d.data(); if (x && x.data) out[d.id] = x.data; });
      return out;
    } catch(e) { return {}; }
  }
  return N.store.get("napoles_fotos_borrador") || {};
};

/* ---------- Diseño (colores, logo, letra) ---------- */
N.DISENO_BASE = { principal:"#e0352b", acento:"#f6c445", fondo:"#17110e", tarjeta:"#241b16", texto:"#f7ecd9", patron:"cuadros", letra:"Lilita One", logo:"", portada:"" };
N.LETRAS = ["Lilita One","Fredoka","Pacifico","Lobster","Bebas Neue","Righteous","Baloo 2","Playfair Display"];
N.PATRONES = { cuadros:"Mantel de cuadros", puntos:"Puntos", rayas:"Rayas", ninguno:"Liso" };
N.diseno = c => Object.assign({}, N.DISENO_BASE, (c && c.diseno) || {});
N.aplicarDiseno = function(d, root){
  root = root || document.documentElement;
  [["--red",d.principal],["--cheese",d.acento],["--bg",d.fondo],["--card",d.tarjeta],["--cream",d.texto]].forEach(([k,v])=>{ if(v) root.style.setProperty(k,v); });
  root.style.setProperty("--titulo", `"${d.letra||"Lilita One"}"`);
  if (d.letra && d.letra !== "Lilita One") {
    const id = "font-" + N.slug(d.letra);
    if (!document.getElementById(id)) { const l = document.createElement("link"); l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(d.letra).replace(/%20/g,"+") + ":wght@400;700&display=swap"; document.head.appendChild(l); }
  }
};
N.patronCSS = function(p){
  if (p === "puntos") return "radial-gradient(rgba(255,255,255,.35) 2px,transparent 2.5px) 0 0/18px 18px";
  if (p === "rayas") return "repeating-linear-gradient(45deg,rgba(255,255,255,.5) 0 10px,transparent 10px 24px)";
  if (p === "ninguno") return "none";
  return "repeating-conic-gradient(#fff 0 25%,transparent 0 50%) 0 0/36px 36px";
};
N.personasTxt = v => { v = String(v == null ? "" : v).trim(); if (!v) return ""; return /^1$/.test(v) ? "1 persona" : `${v} personas`; };

/* ---------- Ilustraciones SVG (cuando no hay foto) ---------- */
function rng(seed){ seed = String(seed || "x"); let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++){ h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return function(){ h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
const PALETA = ["#b8321f","#3f9a3a","#6b3b22","#f2a7a0","#f7d64a","#2b2b2b","#e9d3b0","#d8402c"];
N.ARTES = { pizza:"Pizza", fries:"Papas / salchipapa", picada:"Picada", patacon:"Patacón", cone:"Helado", drink:"Bebida", bowl:"Adición / salsa", burger:"Hamburguesa" };

N.art = function(item, fotos){
  if (item && item.foto && fotos && fotos[item.foto]) return `<img src="${fotos[item.foto]}" alt="" loading="lazy">`;
  const a = (item && item.art) || { t: "bowl" }, r = rng(item && item.id);
  if (a.t === "pizza") {
    const cols = (a.c && a.c.length) ? a.c : [PALETA[Math.floor(r()*8)], PALETA[Math.floor(r()*8)]];
    let tops = ""; for (let i = 0; i < 16; i++){ const ang = r()*Math.PI*2, rad = 6 + r()*28, s = 2.6 + r()*2.6;
      tops += `<circle cx="${(50+Math.cos(ang)*rad).toFixed(1)}" cy="${(50+Math.sin(ang)*rad).toFixed(1)}" r="${s.toFixed(1)}" fill="${cols[i % cols.length]}"/>`; }
    let blob = ""; for (let i = 0; i < 6; i++){ const ang = r()*Math.PI*2, rad = r()*22;
      blob += `<circle cx="${(50+Math.cos(ang)*rad).toFixed(1)}" cy="${(50+Math.sin(ang)*rad).toFixed(1)}" r="${(10+r()*8).toFixed(1)}" fill="#f7d77a" opacity=".75"/>`; }
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="47" fill="#000" opacity=".25"/><circle cx="50" cy="50" r="46" fill="#d8923c"/><circle cx="50" cy="50" r="41" fill="#c9381f"/><circle cx="50" cy="50" r="38" fill="#f2c457"/>${blob}${tops}<g stroke="#a86a2a" stroke-width="1" opacity=".55"><path d="M50 4v92M4 50h92M17 17l66 66M83 17 17 83"/></g></svg>`;
  }
  if (a.t === "fries") { let f = ""; for (let i = 0; i < 9; i++){ const x = 24 + i*6.5 + r()*2, h = 26 + r()*18, rot = -10 + r()*20;
      f += `<rect x="${x.toFixed(1)}" y="${(44-h).toFixed(1)}" width="6" height="${(h+20).toFixed(1)}" rx="2" fill="${i%2?"#f6c445":"#f0b52e"}" transform="rotate(${rot.toFixed(1)} ${x+3} 60)"/>`; }
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${f}<circle cx="38" cy="40" r="6" fill="#b5462a"/><circle cx="58" cy="36" r="5" fill="#b5462a"/><path d="M20 48h60l-8 44H28z" fill="#e0352b"/><path d="M20 48h60l-2 9H22z" fill="#b8261e"/><path d="M40 62h20v6H40z" fill="#fff" opacity=".85"/></svg>`; }
  if (a.t === "patacon") return `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="58" rx="42" ry="30" fill="#000" opacity=".25"/><ellipse cx="50" cy="54" rx="42" ry="30" fill="#e9b14a"/><ellipse cx="50" cy="52" rx="34" ry="23" fill="#d08f2f"/><path d="M28 50q10-12 22-4t22-2" stroke="#7a3f22" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M30 58q12 6 22 0t18 2" stroke="#f3e1b5" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="44" cy="46" r="3" fill="#d8402c"/><circle cx="60" cy="55" r="3" fill="#3f9a3a"/></svg>`;
  if (a.t === "picada") return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="8" y="22" width="84" height="62" rx="14" fill="#8a5a33"/><rect x="12" y="26" width="76" height="54" rx="11" fill="#a8723f"/><circle cx="30" cy="42" r="9" fill="#7a3f22"/><circle cx="48" cy="38" r="7" fill="#9a3a22"/><rect x="58" y="34" width="22" height="10" rx="5" fill="#b5462a"/><circle cx="28" cy="64" r="6" fill="#f6c445"/><circle cx="40" cy="66" r="6" fill="#f0b52e"/><ellipse cx="62" cy="62" rx="12" ry="8" fill="#e9b14a"/><circle cx="78" cy="62" r="6" fill="#f3e1b5"/></svg>`;
  if (a.t === "cone") return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M34 50h32L50 95z" fill="#d8923c"/><path d="M38 56l20 20M44 52l18 18M62 56 42 76M56 52 40 68" stroke="#a86a2a" stroke-width="2"/><circle cx="50" cy="40" r="17" fill="#f4b6c2"/><circle cx="50" cy="22" r="14" fill="#6b3b22"/><circle cx="50" cy="9" r="4" fill="#e0352b"/></svg>`;
  if (a.t === "burger") return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M14 46a36 26 0 0 1 72 0z" fill="#d8923c"/><circle cx="36" cy="32" r="1.6" fill="#f7ecd9"/><circle cx="50" cy="27" r="1.6" fill="#f7ecd9"/><circle cx="62" cy="33" r="1.6" fill="#f7ecd9"/><path d="M12 50h76l-6 6H18z" fill="#3f9a3a"/><rect x="12" y="55" width="76" height="12" rx="6" fill="#6b3b22"/><path d="M14 66h72l-8 6H22z" fill="#f6c445"/><path d="M16 72h68a6 6 0 0 1-6 10H22a6 6 0 0 1-6-10z" fill="#d8923c"/></svg>`;
  if (a.t === "drink") { const c = a.c || "#3a1a10"; return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M58 4 52 30" stroke="#e0352b" stroke-width="5" stroke-linecap="round"/><path d="M26 24h48l-6 68H32z" fill="#fff" opacity=".18"/><path d="M29 38h42l-4 54H33z" fill="${c}"/><rect x="24" y="20" width="52" height="8" rx="4" fill="#f7ecd9"/><circle cx="42" cy="54" r="2.5" fill="#fff" opacity=".5"/><circle cx="56" cy="66" r="2" fill="#fff" opacity=".5"/></svg>`; }
  const c = a.c || "#f0e2c4";
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="72" rx="34" ry="10" fill="#000" opacity=".25"/><path d="M16 48h68a34 26 0 0 1-68 0z" fill="#f7ecd9"/><ellipse cx="50" cy="48" rx="34" ry="10" fill="${c}"/></svg>`;
};
})();
