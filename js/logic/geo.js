/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
export const SHOP = [34.6829, -1.9081];
export const HOME0 = [34.6598, -1.9006];
export const ZONE_KM = 6;

export function km(a, b) {
  const R = 6371,
    r = x => (x * Math.PI) / 180,
    dLat = r(b[0] - a[0]),
    dLon = r(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// 10–15 min par tranche de 5 km
export const etaSteps = d => Math.max(1, Math.ceil(d / 5));
export const etaRange = d => {
  const n = etaSteps(d);
  return `${10 * n}–${15 * n} min`;
};

// Trajet courbe de a vers b (Bézier quadratique), en n+1 points
export function curve(a, b, n = 40) {
  const mx = (a[0] + b[0]) / 2,
    my = (a[1] + b[1]) / 2,
    dx = b[0] - a[0],
    dy = b[1] - a[1];
  const cx = mx - dy * 0.35,
    cy = my + dx * 0.35;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n,
      u = 1 - t;
    return [u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]];
  });
}

// Position à la fraction p du trajet, et le trajet déjà parcouru
export function along(route, p) {
  const n = route.length - 1,
    f = p * n,
    i = Math.min(n - 1, Math.floor(f)),
    t = f - i,
    A = route[i],
    B = route[i + 1];
  const pos = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
  return { pos, done: [...route.slice(0, i + 1), pos] };
}

export const fmtKm = d => d.toFixed(1).replace('.', ',');
