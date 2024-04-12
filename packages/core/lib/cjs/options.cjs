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

// src/options.ts
var options_exports = {};
__export(options_exports, {
  mergeOptions: () => mergeOptions,
  resolveOptions: () => resolveOptions
});
module.exports = __toCommonJS(options_exports);
var import_utils = require("./utils.cjs");
var DEFAULT_OPTION = {
  host: "localhost",
  port: 8e3,
  plugins: [],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist"
  }
};
var mergeOptions = (a, b) => {
  return (0, import_utils.mergeRecord)(a, b);
};
var resolveOptions = (raw, mode) => {
  const merged = mergeOptions(DEFAULT_OPTION, raw);
  Reflect.set(merged, "mode", mode);
  const buildPlugins = [];
  for (const plugin of merged.plugins) {
    const { middlewares = [], build } = plugin(
      merged
    );
    merged.middlewares = (0, import_utils.mergeArray)(merged.middlewares, middlewares);
    if (build) {
      buildPlugins.push(build);
    }
  }
  if (mode === "runtime") {
    Reflect.deleteProperty(merged, "build");
    return merged;
  }
  Reflect.set(merged.build, "plugins", buildPlugins);
  return merged;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeOptions,
  resolveOptions
});
