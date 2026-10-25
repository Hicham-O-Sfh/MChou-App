export const SHOP = [34.6829, -1.9081];
export const HOME0 = [34.6598, -1.9006];
export const ZONE_KM = 6;

export function km(a, b) {
  const R = 6371, r = x => x * Math.PI / 180, dLat = r(b[0] - a[0]), dLon = r(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// 10–15 min par tranche de 5 km
export const etaSteps = d => Math.max(1, Math.ceil(d / 5));
export const etaRange = d => { const n = etaSteps(d); return `${10 * n}–${15 * n} min`; };

export const fmtKm = d => d.toFixed(1).replace('.', ',');
