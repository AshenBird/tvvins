"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  mergeArray: () => mergeArray,
  mergeRecord: () => mergeRecord
});
module.exports = __toCommonJS(utils_exports);
var valueType = ["string", "number", "boolean", "symbol"];
var mergeRecord = (a, b) => {
  const r = {};
  for (const [k, v] of Object.entries(a)) {
    r[k] = v;
  }
  for (const [k, v] of Object.entries(b)) {
    if (!v)
      continue;
    if (!r[k]) {
      r[k] = v;
      continue;
    }
    const typeA = typeof r[k];
    const typeB = typeof v;
    if (typeA !== typeB) {
      r[k] = v;
      continue;
    }
    if (valueType.includes(typeA)) {
      r[k] = v;
      continue;
    }
    if (typeof r[k] === "function") {
      r[k] = v;
      continue;
    }
    if (typeof r[k] === "object") {
      if (Array.isArray(r[k]) && Array.isArray(v)) {
        r[k] = mergeArray(r[k], v);
        continue;
      }
      if (Array.isArray(r[k]) || Array.isArray(v)) {
        r[k] = v;
        continue;
      }
      try {
        r[k] = mergeRecord(
          r[k],
          v
        );
      } catch {
        r[k] = v;
      }
    }
  }
  return r;
};
var mergeArray = (a, b) => {
  return [...a, ...b];
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeArray,
  mergeRecord
});
