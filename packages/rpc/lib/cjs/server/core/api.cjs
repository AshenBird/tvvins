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

// src/server/core/api.ts
var api_exports = {};
__export(api_exports, {
  _defineAPI: () => _defineAPI,
  isAPI: () => isAPI
});
module.exports = __toCommonJS(api_exports);
var import_nanoid = require("nanoid");
var import_const = require("./const.cjs");
var isAPI = (val) => {
  return val[import_const.IDENTITY] === "api";
};
var _defineAPI = (store, handle, schema) => {
  console.debug(new Error().stack);
  const genId = () => {
    const id2 = (0, import_nanoid.nanoid)();
    if (!store.has(id2))
      return id2;
    return genId();
  };
  const id = genId();
  const christen = (name) => {
    Reflect.set(handle, import_const.NAME, name);
    Reflect.defineProperty(handle, import_const.NAME, {
      writable: false,
      value: name,
      enumerable: false,
      configurable: false
    });
    return shadow;
  };
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === import_const.IDENTITY) {
        return "api";
      }
      if (p === import_const.ID) {
        return id;
      }
      if (p === "christen") {
        return christen;
      }
      if (p === "name") {
        return Reflect.get(handle, import_const.NAME) || id;
      }
      return target[p];
    },
    apply: async (target, t, args) => {
      return target.call(t, args[0]);
    }
  });
  store.set(id, shadow);
  return shadow;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _defineAPI,
  isAPI
});
