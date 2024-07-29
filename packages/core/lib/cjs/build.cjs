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

// src/build.ts
var build_exports = {};
__export(build_exports, {
  build: () => build
});
module.exports = __toCommonJS(build_exports);
var import_node_process = require("node:process");
var import_node_path = require("node:path");
var import_esbuild = require("esbuild");
var import_fs_extra = require("fs-extra");
var import_vite = require("vite");
var import_node_fs = require("node:fs");
var build = async (options) => {
  const [nodePath, entryPath] = import_node_process.argv;
  const base = (0, import_node_process.cwd)();
  const { build: buildOption } = options;
  const { output, plugins } = buildOption;
  const outdir = (0, import_node_path.resolve)(base, output);
  (0, import_fs_extra.ensureDirSync)(outdir);
  (0, import_fs_extra.emptyDirSync)(outdir);
  const viewTask = (0, import_vite.build)(options.vite);
  console.debug("client build finish");
  const serverTask = (0, import_esbuild.build)({
    entryPoints: [entryPath],
    target: "node20",
    platform: "node",
    outdir: `${outdir}/server`,
    format: "esm",
    packages: "external",
    bundle: true,
    outExtension: {
      ".js": ".mjs"
    },
    plugins: [
      ...plugins
    ]
  });
  console.debug("server build finish");
  await Promise.all([viewTask, serverTask]);
  const dependencies = JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path.resolve)((0, import_node_process.cwd)(), "./package.json"), { encoding: "utf-8" })).dependencies;
  const targetPackage = {
    dependencies: {
      ...dependencies,
      "cross-env": "7.0.3"
    },
    scripts: {
      "start": `cross-env TVVINS_STAGE=production TVVINS_MODE=server  node ${(0, import_node_path.resolve)(`${outdir}/server`, (0, import_node_path.relative)(options.build.source, entryPath)).replace(".ts", ".mjs")}`
    },
    private: true
  };
  const packagePath = (0, import_node_path.resolve)(outdir, "./package.json");
  console.debug(packagePath);
  (0, import_fs_extra.ensureFileSync)(packagePath);
  (0, import_node_fs.writeFileSync)(packagePath, JSON.stringify(targetPackage, void 0, 2), { encoding: "utf-8" });
  console.debug((0, import_node_fs.existsSync)(packagePath));
  console.debug("package.json init");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  build
});
