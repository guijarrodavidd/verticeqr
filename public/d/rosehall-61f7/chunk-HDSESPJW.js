import{db as e}from"./chunk-BASPOBNE.js";function n(t){if(/^(data:|https?:)/.test(t))return t;let i=t.startsWith("/")?t.slice(1):t;return i.startsWith("api/")?i:e.mediaBase+i}export{n as a};
