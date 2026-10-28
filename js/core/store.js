/* Copyright (c) 2026 - Ing. Développeur Hicham Oussama Saffih */
// set() s'applique tout de suite ; le rendu est groupé en fin de tâche, puis les callbacks passent.
export function createStore(initial, onChange) {
  let state = initial,
    queued = false,
    after = [];

  const flush = () => {
    queued = false;
    const cbs = after;
    after = [];
    onChange();
    cbs.forEach(cb => cb());
  };

  return {
    get: () => state,
    set(patch, cb) {
      const p = typeof patch === 'function' ? patch(state) : patch;
      if (p) state = { ...state, ...p };
      if (cb) after.push(cb);
      if (!queued) {
        queued = true;
        queueMicrotask(flush);
      }
    }
  };
}
