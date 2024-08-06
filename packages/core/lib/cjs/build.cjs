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
var import_base_utils = require("@mcswift/base-utils");
var build = async (options) => {
  const [nodePath, entryPath] = import_node_process.argv;
  const base = (0, import_node_process.cwd)();
  const { build: buildOption } = options;
  const { output, plugins } = buildOption;
  const outdir = (0, import_node_path.resolve)(base, output);
  (0, import_fs_extra.ensureDirSync)(outdir);
  (0, import_fs_extra.emptyDirSync)(outdir);
  await (0, import_vite.build)(options.vite);
  import_base_utils.Logger.info("client build finish");
  await (0, import_esbuild.build)({
    entryPoints: [entryPath],
    target: "node20",
    platform: "node",
    outdir: (0, import_node_path.join)(outdir, "server"),
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
  import_base_utils.Logger.info("server build finish");
  const dependencies = JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path.resolve)((0, import_node_process.cwd)(), "./package.json"), { encoding: "utf-8" })).dependencies;
  const postInstallPath = "./scripts/post-install.mjs";
  const targetPackage = {
    dependencies: {
      ...dependencies,
      "cross-env": "7.0.3"
    },
    devDependencies: {
      "fs-extra": "^11.2.0"
    },
    scripts: {
      "start": `cross-env TVVINS_STAGE=production TVVINS_MODE=server  node server/${entryPath.split(import_node_path.sep).pop()?.replace(".ts", ".mjs")}`
    },
    private: true
  };
  const packagePath = (0, import_node_path.resolve)(outdir, "./package.json");
  (0, import_fs_extra.ensureFileSync)(packagePath);
  (0, import_node_fs.writeFileSync)(packagePath, JSON.stringify(targetPackage, void 0, 2), { encoding: "utf-8" });
  import_base_utils.Logger.info("production package.json has init");
  (0, import_fs_extra.ensureFileSync)((0, import_node_path.resolve)(outdir, postInstallPath));
  const idStorePathSource = (0, import_node_path.join)((0, import_node_process.cwd)(), "node_modules/@tvvins/rpc/idStore.json");
  const idStorePathTarget = (0, import_node_path.join)(outdir, "idStore.json");
  (0, import_node_fs.copyFileSync)(idStorePathSource, idStorePathTarget);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  build
});
