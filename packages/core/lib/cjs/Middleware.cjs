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

// src/Middleware.ts
var Middleware_exports = {};
__export(Middleware_exports, {
  connectMiddlewareWrap: () => connectMiddlewareWrap,
  defineConnectMiddleWare: () => defineConnectMiddleWare,
  defineMiddleWare: () => defineMiddleWare,
  transformConnectToTvvins: () => transformConnectToTvvins
});
module.exports = __toCommonJS(Middleware_exports);
var import_const = require("./const.cjs");
var import_Context = require("./Context.cjs");
var defineMiddleWare = (handle, name = handle.name, isConnect) => {
  const ref = /* @__PURE__ */ Object.create(null);
  const key = Symbol();
  Reflect.set(ref, "name", name || "");
  Reflect.set(ref, "handle", handle);
  Reflect.set(ref, "isConnect", isConnect);
  Reflect.set(ref, import_const.KEY, key);
  Reflect.set(ref, "setName", (name2) => {
    Reflect.set(ref, "name", name2);
  });
  return ref;
};
var defineConnectMiddleWare = (handle, name) => {
  return defineMiddleWare(handle, name, true);
};
var transformConnectToTvvins = (raw) => {
  return async (ctx, next) => {
    const { req, res } = ctx.$;
    await raw(req, res, next);
  };
};
var connectMiddlewareWrap = (handle, app) => {
  return (req, res, next) => {
    const ctx = new import_Context.Context(req, res, app);
    return handle(ctx, () => next());
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  connectMiddlewareWrap,
  defineConnectMiddleWare,
  defineMiddleWare,
  transformConnectToTvvins
});
