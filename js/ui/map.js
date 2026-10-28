/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
const TILES = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

// Leaflet est chargé en defer depuis index.html
export function whenLeaflet(fn, n = 0) {
  if (window.L) fn(window.L);
  else if (n < 80) setTimeout(() => whenLeaflet(fn, n + 1), 150);
}

export function baseMap(el, opts = {}) {
  const L = window.L,
    m = L.map(el, { zoomControl: false, ...opts });
  m.attributionControl.setPrefix(false);
  m.attributionControl.setPosition('bottomleft');
  const tl = L.tileLayer(TILES, {
    subdomains: 'abc',
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, tiles OSM France'
  }).addTo(m);
  tl.on('tileerror', e => {
    if (e?.tile) e.tile.style.visibility = 'hidden';
  });
  const tp = m.getPane('tilePane');
  if (tp) tp.style.filter = 'saturate(.85) sepia(.1) hue-rotate(-8deg)';
  setTimeout(() => {
    try {
      m.invalidateSize();
    } catch {}
  }, 420);
  return m;
}

export function killMap(m) {
  try {
    m?.remove();
  } catch {}
}

export async function reverse([lat, lon]) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=fr&lat=${lat}&lon=${lon}`
    );
    const a = (await r.json())?.address || {};
    const q = a.neighbourhood || a.suburb || a.quarter || a.residential || a.city_district || a.road;
    return q ? { q, city: a.city || a.town || a.village } : null;
  } catch {
    return null;
  }
}
