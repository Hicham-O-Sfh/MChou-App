/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
import { App } from './app.js';

// iOS n'applique :active qu'avec un écouteur tactile
document.addEventListener('touchstart', () => {}, { passive: true });

const app = new App(document.getElementById('app'));
app.start();
window.mchou = app;
