"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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

// src/build.ts
var build_exports = {};
__export(build_exports, {
  build: () => build
});
var import_node_process, import_node_path, import_esbuild, import_fs_extra, import_vite, import_node_fs, import_base_utils, build;
var init_build = __esm({
  "src/build.ts"() {
    "use strict";
    import_node_process = require("node:process");
    import_node_path = require("node:path");
    import_esbuild = require("esbuild");
    import_fs_extra = require("fs-extra");
    import_vite = require("vite");
    import_node_fs = require("node:fs");
    import_base_utils = require("@mcswift/base-utils");
    build = async (options) => {
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
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useLog: () => useLog,
  useTvvins: () => useTvvins
});
module.exports = __toCommonJS(src_exports);
var import_node_process2 = require("node:process");
var import_App = require("./App.cjs");
var import_options = require("./options.cjs");
__reExport(src_exports, require("./type.cjs"), module.exports);
__reExport(src_exports, require("./Middleware.cjs"), module.exports);
var import_log4js = require("log4js");
var useTvvins = (options) => {
  const mode = import_node_process2.env["TVVINS_MODE"];
  const stage = import_node_process2.env["TVVINS_STAGE"];
  if (mode === "server") {
    const app = new import_App.App();
    (0, import_options.resolveOptions)(options, mode).then((resolved) => {
      app.start(resolved);
    });
    return app;
  }
  const buildCtrl = async () => {
    const resolved = await (0, import_options.resolveOptions)(options, mode);
    const { build: build2 } = await Promise.resolve().then(() => (init_build(), build_exports));
    build2(resolved);
  };
  buildCtrl();
};
var useLog = (channel) => {
  return (0, import_log4js.getLogger)(channel);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useLog,
  useTvvins,
  ...require("./type.cjs"),
  ...require("./Middleware.cjs")
});
