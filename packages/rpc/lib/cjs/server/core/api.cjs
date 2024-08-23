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
var _defineAPI = (store, handle, idStore, name) => {
  const ID = Symbol.for(idStore.key);
  const genId = () => {
    const id2 = (0, import_nanoid.nanoid)();
    if (!store.has(id2))
      return id2;
    return genId();
  };
  const id = genId();
  const christen = (name2) => {
    Reflect.set(handle, import_const.NAME, name2);
    Reflect.defineProperty(handle, import_const.NAME, {
      writable: false,
      value: name2,
      enumerable: false,
      configurable: false
    });
    return shadow;
  };
  Reflect.set(handle, ID, id);
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === import_const.IDENTITY) {
        return "api";
      }
      if (p === ID) {
        return Reflect.get(handle, ID);
      }
      if (p === "christen") {
        return christen;
      }
      if (p === "name") {
        return Reflect.get(handle, import_const.NAME) || id;
      }
      if (p === "update") {
        return (key, id2) => {
          if (key !== ID)
            return;
          Reflect.set(shadow, ID, id2);
          store.set(id2, shadow);
        };
      }
      return target[p];
    },
    set(target, p, nv) {
      if (p === ID) {
        Reflect.set(handle, ID, nv);
        return true;
      }
      return false;
    },
    apply: async (target, t, args) => {
      return target.call(t, args[0]);
    }
  });
  if (name) {
    christen(name);
  }
  store.set(id, shadow);
  return shadow;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _defineAPI,
  isAPI
});
