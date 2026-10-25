export const FREE_FROM = 150;
export const FEE = 15;
export const PROMO_RATE = .1;

export function totals({ cart, promoOk }) {
  const sub = cart.reduce((a, l) => a + l.unit * l.qty, 0);
  const disc = promoOk ? Math.round(sub * PROMO_RATE) : 0;
  const free = sub >= FREE_FROM;
  const fee = !cart.length || free ? 0 : FEE;
  return {
    sub, disc, fee, free,
    total: sub - disc + fee,
    gain: sub - disc,
    left: Math.max(0, FREE_FROM - sub),
    pct: Math.min(100, Math.round(sub / FREE_FROM * 100)),
    count: cart.reduce((a, l) => a + l.qty, 0)
  };
}
