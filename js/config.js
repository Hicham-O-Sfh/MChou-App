/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
export const TW = { sound: true, reduceMotion: false, rtl: false };

export const MOB = /[?&]mobile\b/.test(location.search) || matchMedia('(max-width: 600px)').matches;

const sysReduce = matchMedia('(prefers-reduced-motion: reduce)');
export const rm = () => TW.reduceMotion || sysReduce.matches;
