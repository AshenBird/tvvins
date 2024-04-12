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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useTvvins: () => useTvvins
});
module.exports = __toCommonJS(src_exports);
var import_node_process = require("node:process");
var import_App = require("./App.cjs");
var import_options = require("./options.cjs");
__reExport(src_exports, require("./type.cjs"), module.exports);
__reExport(src_exports, require("./Middleware.cjs"), module.exports);
var useTvvins = (options) => {
  const mode = import_node_process.env["TVVINS_MODE"];
  const resolved = (0, import_options.resolveOptions)(options, mode);
  if (mode === "runtime" || mode === "dev") {
    const app = new import_App.App(resolved);
    return app;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useTvvins,
  ...require("./type.cjs"),
  ...require("./Middleware.cjs")
});
