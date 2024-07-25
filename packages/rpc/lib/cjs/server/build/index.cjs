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

// src/server/build/index.ts
var build_exports = {};
__export(build_exports, {
  vitePlugin: () => vitePlugin
});
module.exports = __toCommonJS(build_exports);
var import_unplugin = require("unplugin");
var import_utils = require("./utils.cjs");
var import_node_path = require("node:path");
var unplugin = (0, import_unplugin.createUnplugin)(
  (options) => ({
    name: "@tvvins/rpc",
    enforce: "pre",
    transformInclude: (id) => {
      const { dirs } = options;
      const result = dirs.some((dir) => {
        const r = !(0, import_node_path.normalize)((0, import_node_path.relative)(dir, id)).startsWith(`..${import_node_path.sep}`);
        return r;
      });
      return result;
    },
    async transform(code, id) {
      return await (0, import_utils.transform)(code, id, options.idStore.key);
    }
  })
);
var vitePlugin = (dirs, idStore) => ({
  name: "@tvvins/rpc",
  enforce: "pre",
  // transformInclude: (id: string) => {
  //   const { dirs } = options;
  //   const result = dirs.some((dir) => {
  //     const r = !normalize(relative(dir, id)).startsWith(`..${sep}`);
  //     return r;
  //   });
  //   return result;
  // },
  async transform(code, id) {
    const include = dirs.some((dir) => {
      const r = !(0, import_node_path.normalize)((0, import_node_path.relative)(dir, id)).startsWith(`..${import_node_path.sep}`);
      return r;
    });
    return await (0, import_utils.transform)(code, id, idStore.key);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  vitePlugin
});
