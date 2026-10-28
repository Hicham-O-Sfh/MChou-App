/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
// Vraie carte M'Chou (.notes/ecrans/menu.md). Prix en DH ; tableau = un prix par combinaison des options qui changent le prix.
// L'ordre des familles est celui des pills et des sections partout.
export const FAMS = [
  {
    k: 'choux',
    n: 'Choux',
    t: 'Les choux',
    icon: 'bakery_dining',
    tint: '#E8C9A8',
    pre: 'Choux ',
    sub: 'Choux',
    ex: true,
    bld: 'choux',
    desc: 'Classiques, ou farcis à la crème vanille ou chocolat.',
    ax: ['pcs', 'garn', 'creme'],
    items: [
      ['Nutella', [12, 15, 18, 24], { pop: 1 }],
      ['Bueno', [13, 16, 20, 25]],
      ['Lotus', [16, 20, 22, 27], { pop: 1 }],
      ['Oreo', [15, 20, 20, 26]],
      ['Croquant amande', [20, 25, 30, 35]],
      ['Pistache', [20, 25, 25, 30], { pop: 1 }],
      ['Amande', [16, 20, 22, 27]],
      ['Box mixte', [20, 25, 25, 30], { full: 'Box mixte choux' }]
    ]
  },
  {
    k: 'crepes',
    n: 'Crêpes',
    t: 'Crêpes sucrées',
    icon: 'skillet',
    tint: '#F7C873',
    pre: 'Crêpe ',
    sub: 'Crêpe sucrée',
    ex: true,
    bld: 'crepe',
    sugar: true,
    desc: 'Crêpe dorée, pliée en quart.',
    items: [
      ['Nutella', 20],
      [
        'Nutella banane',
        25,
        {
          id: 'crepe-nb',
          tag: 'N°1',
          pop: 1,
          desc: 'Crêpe dorée, Nutella généreux et rondelles de banane fraîche, pliée en quart.'
        }
      ],
      ['Oreo', 25],
      ['Bueno', 25, { pop: 1 }],
      ['Lotus', 25, { pop: 1 }],
      ['Amande', 25],
      ['Nutella crème pistache', 25],
      ['Nutella pistachio', 30, { pop: 1 }],
      ['Extra amande pistachio', 30],
      ['Croquant amande', 35],
      ['Extra pistachio', 35],
      ['Filet d’amande', 35]
    ]
  },
  {
    k: 'brownies',
    n: 'Brownies',
    t: 'Les brownies',
    icon: 'cake',
    tint: '#C9A27E',
    pre: 'Brownie ',
    sub: 'Brownie',
    note: 'Kunafa pistachou & crème fromagère',
    ex: true,
    bld: 'brownie',
    desc: 'Brownie fondant, avec kunafa pistachou et crème fromagère.',
    ax: ['taille'],
    items: [
      ['Nutella', [27, 49]],
      ['Bueno', [28, 50], { id: 'brownie-bueno', pop: 1 }],
      ['Nutella pistachou', [30, 55]],
      ['Nutella crème pistachio', [28, 50]],
      ['Amande', [30, 55]],
      ['Croquant amande', [35, 55]],
      ['Lotus', [30, 55], { pop: 1 }],
      ['Oreo', [30, 55]],
      ['Extra pistachio', [35, 59], { id: 'brownie-pista', tag: 'DROP', pop: 1 }],
      ['Box mixte', [30, 55], { full: 'Box mixte brownies' }]
    ]
  },
  {
    k: 'gaufres',
    n: 'Gaufres',
    t: 'Gaufres croustillantes',
    icon: 'breakfast_dining',
    tint: '#F5C46A',
    pre: 'Gaufre ',
    sub: 'Gaufre croustillante',
    ex: true,
    bld: 'gaufre',
    sugar: true,
    desc: 'Gaufre croustillante et dorée.',
    items: [
      ['Natural', 15],
      ['Nutella', 20],
      ['Nutella banane', 25],
      ['Oreo', 25],
      ['Lotus', 25],
      ['Bueno', 25],
      ['Amande', 25],
      ['Nutella crème pistachio', 25],
      ['Nutella pistachio', 30],
      ['Croquant amande', 35],
      ['Box mixte', 35, { full: 'Box mixte gaufres' }],
      ['Extra pistachio', 40]
    ]
  },
  {
    k: 'spaghetti',
    n: 'Spaghetti',
    t: 'Spaghetti crêpes',
    icon: 'dinner_dining',
    tint: '#F5D2A8',
    pre: 'Spaghetti crêpe ',
    sub: 'Spaghetti crêpe',
    ex: true,
    bld: 'spaghetti',
    sugar: true,
    desc: 'Crêpe coupée en lanières, nappée comme tu l’aimes.',
    items: [
      ['Nutella', 25],
      ['Nutella banane', 30],
      ['Oreo', 30],
      ['Bueno', 30],
      ['Lotus', 35],
      ['Amande', 35],
      ['Nutella crème pistache', 35],
      ['Nutella pistachio', 40],
      ['Croquant amande', 40],
      ['Extra pistachio', 45],
      ['Filet d’amande', 40]
    ]
  },
  {
    k: 'mojitos',
    n: 'Mojitos',
    t: 'Les mojitos',
    icon: 'local_bar',
    tint: '#FFB3C1',
    pre: 'Mojito ',
    sub: 'Mojito sans alcool',
    items: [
      ['Citron', 20, { pop: 1 }],
      ['Fraise', 20, { id: 'mojito-fraise', pop: 1 }],
      ['Framboise', 20],
      ['Blueberry', 20],
      ['Fruits de la passion', 20, { id: 'mojito-passion', pop: 1 }],
      ['Ananas', 20]
    ]
  },
  {
    k: 'shakes',
    n: 'Milkshakes',
    t: 'Milkshakes',
    icon: 'icecream',
    tint: '#E9E1EC',
    pre: 'Milkshake ',
    sub: 'Milkshake',
    items: [
      ['Vanille', 27],
      ['Fraise', 27, { pop: 1 }],
      ['Framboise', 27],
      ['Banane', 27],
      ['Chocolat', 27, { pop: 1 }],
      ['Caramel', 27],
      ['Oreo', 27, { id: 'shake-oreo', pop: 1 }]
    ]
  },
  {
    k: 'cocktails',
    n: 'Cocktails',
    t: 'Cocktails',
    icon: 'blender',
    tint: '#FFD1DA',
    pre: 'Cocktail ',
    sub: 'Cocktail de fruits',
    items: [
      ['Hawaï', 45, { d: 'Mangue et fraise' }],
      ['Bora Bora', 35, { d: 'Banane et pomme' }],
      ['Île Maurice', 45, { d: 'Ananas et kiwi' }],
      ['Île Fraîcheur', 45, { d: 'Ananas, citron et sirop de menthe' }]
    ]
  },
  {
    k: 'jus',
    n: 'Jus',
    t: 'Les jus',
    icon: 'nutrition',
    tint: '#FFE08A',
    pre: 'Jus de ',
    sub: 'Jus',
    items: [
      ['Citron', 15],
      ['Orange', 20, { full: 'Jus d’orange' }],
      ['Pomme', [15, 25], { ax: ['lait'] }],
      ['Banane', [15, 25], { ax: ['lait'] }],
      ['Fraise', [23, 28], { ax: ['lait'] }],
      ['Avocat', [25, 30], { ax: ['lait'], full: 'Jus d’avocat' }],
      ['Ananas', 28, { full: 'Jus d’ananas' }],
      ['Mangue', 28],
      ['Kiwi', 28]
    ]
  },
  {
    k: 'chauds',
    n: 'Boissons chaudes',
    t: 'Boissons chaudes',
    icon: 'local_cafe',
    tint: '#D9C3B0',
    pre: '',
    sub: 'Boisson chaude',
    ax: ['arome'],
    items: [
      ['Café noir', 8],
      ['Café expresso', 8],
      ['Café américain', 8],
      ['Café crème', 10],
      ['Chocolat chaud', 15],
      ['Chocolat fondu', 25],
      ['Cappuccino', 15],
      ['Nescafé', 10]
    ]
  },
  {
    k: 'speciales',
    n: 'Spéciales',
    t: 'Crêpes spéciales',
    icon: 'auto_awesome',
    tint: '#F3D9B8',
    pre: 'Crêpe ',
    sub: 'Crêpe spéciale',
    ex: true,
    bld: 'crepe',
    sugar: true,
    desc: 'Une recette signature de la maison.',
    items: [
      ['Kunafa pistachio burritos', 38, { tag: 'Nouveau', full: 'Kunafa pistachio burritos' }],
      ['Brownie chocolat', 35],
      ['Corne de gazelle', 45],
      ['Brownie dubaï', 50, { soldOut: true }],
      ['Box mixte', 35, { full: 'Box mixte crêpes' }],
      ['Enfant', 35]
    ]
  },
  {
    k: 'packs',
    n: 'Packs',
    t: 'Packs famille',
    icon: 'redeem',
    tint: '#FFE08A',
    pre: '',
    sub: 'Pack famille',
    pack: true,
    items: [
      ['Choux mixtes', 93, { d: '24 pièces', icon: 'bakery_dining', full: 'Pack 24 choux mixtes' }],
      ['Brownies mixtes', 149, { d: '12 pièces', icon: 'cake', full: 'Pack 12 brownies mixtes' }],
      ['Brownies extra pistachou', 155, { d: '12 pièces', icon: 'cake', full: 'Pack 12 brownies extra pistachou' }]
    ]
  }
];

// o : [valeur, libellé du bouton, libellé dans le panier] ; price : l'axe change le prix de base ; add : supplément fixe
export const AX = {
  pcs: {
    n: 'Pièces',
    price: true,
    hint: '4 ou 6 pièces',
    o: [
      ['4', '4 pièces', '4 pièces'],
      ['6', '6 pièces', '6 pièces']
    ]
  },
  garn: {
    n: 'Façon',
    price: true,
    hint: 'classiques ou farcis',
    o: [
      ['classiques', 'Classiques', 'Classiques'],
      ['farcis', 'Farcis à la crème', 'Farcis à la crème']
    ]
  },
  creme: {
    n: 'Crème',
    when: { garn: 'farcis' },
    o: [
      ['vanille', 'Vanille', 'crème vanille'],
      ['chocolat', 'Chocolat', 'crème chocolat']
    ]
  },
  taille: {
    n: 'Taille',
    price: true,
    hint: 'Taille M ou L',
    o: [
      ['M', 'M', 'Taille M'],
      ['L', 'L', 'Taille L']
    ]
  },
  lait: {
    n: 'Version',
    price: true,
    hint: 'Nature ou au lait',
    o: [
      ['nature', 'Nature', 'Nature'],
      ['lait', 'Au lait', 'Au lait']
    ]
  },
  arome: {
    n: 'Arôme',
    add: 5,
    hint: 'Arôme au choix +5 DH',
    o: [
      ['', 'Sans', ''],
      ['vanille', 'Vanille', 'Arôme vanille'],
      ['caramel', 'Caramel', 'Arôme caramel'],
      ['noisette', 'Noisette', 'Arôme noisette']
    ]
  }
};

// [clé, nom, couleur de la pastille, teinte du produit, motif dans le nom]
export const FLAV = [
  ['nutella', 'Nutella', '#4B2615', '#E8C9A8', /nutella/i],
  ['pistache', 'Pistache', '#8FCB6B', '#DDF0CF', /pista|kunafa/i],
  ['lotus', 'Lotus', '#C77B30', '#F5D2A8', /lotus/i],
  ['bueno', 'Bueno', '#E7B97A', '#F3D9B8', /bueno/i],
  ['oreo', 'Oreo', '#2B1409', '#E9E1EC', /oreo/i],
  ['amande', 'Amande', '#EAD7BF', '#F3E6D3', /amande|gazelle/i],
  [
    'fruit',
    'Fruité',
    '#FF4D6D',
    '#FFD1DA',
    /fraise|banane|framboise|mangue|kiwi|ananas|citron|orange|pomme|passion|blueberry|avocat/i
  ]
];

export const EX = [
  { k: 'banane', n: 'Banane', p: 5 },
  { k: 'fraise', n: 'Fraise', p: 8 },
  { k: 'chantilly', n: 'Crème chantilly', p: 8 },
  { k: 'pistache', n: 'Pistache', p: 10 },
  { k: 'amande', n: 'Amande', p: 8 },
  { k: 'lotus', n: 'Lotus', p: 8 },
  { k: 'oreo', n: 'Oreo', p: 5 },
  { k: 'kunafa', n: 'Kunafa pistache', p: 15 }
];

export const TAG_STYLE = { 'N°1': 'n1', Nouveau: 'new', DROP: 'drop' };
export const TAG_LONG = { 'N°1': 'N°1 DES VENTES', DROP: 'DROP DU JOUR', Nouveau: 'NOUVEAU' };

// Nappage du builder : [reflet, couleur, ombre]
export const SAUCE = {
  nutella: ['#8A5636', '#4B2615', '#351A0D'],
  pistache: ['#CDEBB0', '#8FCB6B', '#5E9A3E'],
  lotus: ['#E6A866', '#C77B30', '#9A5A1E'],
  bueno: ['#F6DDB2', '#E7B97A', '#B98A4E'],
  oreo: ['#FFFFFF', '#EFE8DE', '#CFC2B0'],
  amande: ['#FFF6E6', '#EAD7BF', '#C9A06A'],
  chocolat: ['#7A4A30', '#4B2615', '#2B1409']
};

// Ordre des suppléments dans le builder (différent de EX)
export const BUILDER_EX = ['banane', 'pistache', 'amande', 'fraise', 'lotus', 'chantilly', 'oreo', 'kunafa'];
