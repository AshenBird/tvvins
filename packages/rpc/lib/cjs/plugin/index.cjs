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

// src/plugin/index.ts
var plugin_exports = {};
__export(plugin_exports, {
  RPC: () => RPC,
  vitePlugin: () => vitePlugin
});
module.exports = __toCommonJS(plugin_exports);
var import_unplugin = require("unplugin");
var import_utils = require("./utils.cjs");
var import_node_path = require("node:path");
var unplugin = (0, import_unplugin.createUnplugin)((dirs) => ({
  name: "@tvvins/rpc",
  enforce: "pre",
  transformInclude: (id) => {
    const result = dirs.some((dir) => {
      const r = !(0, import_node_path.normalize)((0, import_node_path.relative)(dir, id)).startsWith(`..${import_node_path.sep}`);
      return r;
    });
    return result;
  },
  async transform(code, id) {
    return await (0, import_utils.transform)(code, id);
  }
}));
var vitePlugin = (dirs) => unplugin.vite(dirs);
var RPC = (dirs) => {
  return (config) => {
    const _dirs = typeof dirs === "string" ? [dirs] : dirs;
    const apiDir = _dirs.map((dir) => (0, import_node_path.resolve)(config.source, dir));
    return {
      vite: {
        plugins: [vitePlugin(apiDir)]
      }
    };
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RPC,
  vitePlugin
});
