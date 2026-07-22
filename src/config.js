// src/config.js
const IS_LOCAL = false;  // Cambia a false cuando estés en producción
const STORE_SUFFIX = window.STORE_SUFFIX || ""; // Set dynamically via window.STORE_SUFFIX in Magento Page Builder
const ALL_STORE_SUFFIXES = ["-CA", "-AU", "-NZ"]; // All configured regional suffixes

export { IS_LOCAL, STORE_SUFFIX, ALL_STORE_SUFFIXES };