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

// src/server/core/index.ts
var core_exports = {};
__export(core_exports, {
  BodyParserManager: () => import_body_parse2.BodyParserManager,
  useRPC: () => useRPC
});
module.exports = __toCommonJS(core_exports);
var import_body_parse = require("./body-parse.cjs");
var import_api = require("./api.cjs");
var import_response = require("./response.cjs");
var import_core = require("@tvvins/core");
var import_body_parse2 = require("./body-parse.cjs");
var useRPC = (options = {}) => {
  const { base = "/rpc" } = options;
  const store = /* @__PURE__ */ new Map();
  const handle = async (ctx, next) => {
    if (!ctx.request.url.startsWith(base)) {
      return next();
    }
    const id = ctx.$.req.headers["x-tvvins-rpc-id"];
    if (!id)
      return next();
    const h = store.get(id);
    if (!h)
      return next();
    const payload = await (0, import_body_parse.bodyParse)(ctx.$.req);
    const result = await h(payload.data);
    (0, import_response.resHandle)(ctx.$.res, result);
  };
  const middleware = (0, import_core.defineMiddleWare)(handle, "tvvins-rpc");
  const defineAPI = (handle2, schema) => {
    return (0, import_api._defineAPI)(store, handle2, schema);
  };
  return {
    defineAPI,
    middleware
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BodyParserManager,
  useRPC
});
