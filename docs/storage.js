(function () {
  'use strict';

  window.QKStorage = {
    read(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    write(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch {}
    }
  };
}());
