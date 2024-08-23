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
  resolveOptions: () => resolveOptions,
  unwrapViteConfig: () => unwrapViteConfig
});
module.exports = __toCommonJS(options_exports);
var import_path = require("path");
var import_utils = require("./utils.cjs");
var import_process = require("process");
var import_view = require("./plugins/view/index.cjs");
var import_vite = require("vite");
var DEFAULT_OPTION = {
  host: "localhost",
  port: 8e3,
  plugins: [],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist",
    hooks: {}
  },
  vite: {
    publicDir: (0, import_path.resolve)((0, import_process.cwd)(), "./public")
  }
};
var mergeOptions = (a, b) => {
  return (0, import_utils.mergeRecord)(a, b);
};
var resolveOptions = async (raw, mode) => {
  const merged = mergeOptions(DEFAULT_OPTION, raw);
  Reflect.set(merged, "mode", mode);
  const buildPlugins = [];
  let vite = (0, import_vite.mergeConfig)({}, await unwrapViteConfig(merged?.vite || {}));
  merged.plugins.push(import_view.viewPlugin);
  for (const plugin of merged.plugins) {
    const { middlewares = [], build, vite: pVite = {}, name } = plugin(
      merged
    );
    merged.middlewares = (0, import_utils.mergeArray)(merged.middlewares, middlewares);
    vite = (0, import_vite.mergeConfig)(vite, await unwrapViteConfig(pVite));
    merged.vite = vite;
    if (build) {
      buildPlugins.push(...build.plugins || []);
    }
  }
  vite.build = (0, import_vite.mergeConfig)(vite.build || {}, {
    outDir: `${merged.build.output}/client`
  }, false);
  Reflect.set(merged.build, "plugins", buildPlugins);
  Reflect.set(merged.build, "vite", vite);
  return merged;
};
var unwrapViteConfig = async (userConfig) => {
  const configEnv = {
    command: "serve",
    mode: "development"
  };
  const config = await (typeof userConfig === "function" ? userConfig(configEnv) : userConfig);
  return config;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeOptions,
  resolveOptions,
  unwrapViteConfig
});
