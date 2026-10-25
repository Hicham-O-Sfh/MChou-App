// Cadeaux contre des Miams : servis tels quels (options figées), jamais via le builder
export const GIFTS = [
  { k: 'cafe', n: 'Le p’tit noir', d: 'Un café expresso bien serré', cost: 40, lines: [['chauds-cafe-expresso']] },
  { k: 'choux4', n: 'Quatre choux Nutella', d: '4 choux classiques nappés de Nutella', cost: 60, lines: [['choux-nutella', { pcs: '4', garn: 'classiques' }]] },
  { k: 'mojito', n: 'Mojito fraise', d: 'Frais, pétillant, sans alcool', cost: 90, lines: [['mojito-fraise']] },
  { k: 'crepe', n: 'Crêpe Nutella', d: 'La classique, pliée en quart', cost: 100, lines: [['crepes-nutella']] },
  { k: 'crepe-nb', n: 'Crêpe Nutella banane', d: 'Notre N°1, avec banane fraîche', cost: 120, lines: [['crepe-nb']] },
  { k: 'shake', n: 'Milkshake Oreo', d: 'Crémeux et plein de biscuits', cost: 130, lines: [['shake-oreo']] },
  { k: 'brownie', n: 'Brownie Lotus', d: 'Taille M, kunafa pistachou et crème fromagère', cost: 140, lines: [['brownies-lotus', { taille: 'M' }]] },
  { k: 'choux6', n: 'Six choux pistache', d: 'Farcis à la crème vanille', cost: 160, lines: [['choux-pistache', { pcs: '6', garn: 'farcis', creme: 'vanille' }]] },
  { k: 'duo', n: 'Le duo goûter', d: 'Une crêpe Nutella et un mojito fraise', cost: 190, lines: [['crepes-nutella'], ['mojito-fraise']] },
  { k: 'pista', n: 'Brownie Extra pistachio', d: 'Le DROP en grand format, taille L', cost: 250, lines: [['brownie-pista', { taille: 'L' }]] },
  { k: 'pack', n: 'La fête des choux', d: '24 choux mixtes à partager', cost: 400, lines: [['packs-choux-mixtes']] }
];

// Une flamme par semaine avec commande, sans semaine de grâce ; +200 Miams toutes les 5
export const FLAME = { goal: 5, bonus: 200 };
