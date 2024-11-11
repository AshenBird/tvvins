var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/build.ts
var build_exports = {};
__export(build_exports, {
  build: () => build
});
import { argv, cwd } from "node:process";
import { join, resolve, sep } from "node:path";
import { build as esbuild } from "esbuild";
import { emptyDirSync, ensureDirSync, ensureFileSync } from "fs-extra";
import { build as viteBuild } from "vite";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
var build;
var init_build = __esm({
  "src/build.ts"() {
    "use strict";
    build = async (options) => {
      const { Logger } = await import("@mcswift/base-utils/logger");
      const [nodePath, entryPath] = argv;
      const base = cwd();
      const { build: buildOption } = options;
      const { output, plugins, hooks } = buildOption;
      const outdir = resolve(base, output);
      if (hooks.beforeBuild) {
        for (const hook of hooks.beforeBuild) {
          hook();
        }
      }
      ensureDirSync(outdir);
      emptyDirSync(outdir);
      await viteBuild(options.vite);
      Logger.info("client build finish");
      await esbuild({
        entryPoints: [entryPath],
        target: "node20",
        platform: "node",
        outdir: join(outdir, "server"),
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
      Logger.info("server build finish");
      const dependencies = JSON.parse(readFileSync(resolve(cwd(), "./package.json"), { encoding: "utf-8" })).dependencies;
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
          "start": `cross-env TVVINS_STAGE=production TVVINS_MODE=server  node server/${entryPath.split(sep).pop()?.replace(".ts", ".mjs")}`
        },
        private: true
      };
      const packagePath = resolve(outdir, "./package.json");
      ensureFileSync(packagePath);
      writeFileSync(packagePath, JSON.stringify(targetPackage, void 0, 2), { encoding: "utf-8" });
      Logger.info("production package.json has init");
      ensureFileSync(resolve(outdir, postInstallPath));
      const idStorePathSource = join(cwd(), "node_modules/@tvvins/rpc/idStore.json");
      const idStorePathTarget = join(outdir, "idStore.json");
      copyFileSync(idStorePathSource, idStorePathTarget);
      if (hooks.builded) {
        for (const hook of hooks.builded) {
          hook();
        }
      }
    };
  }
});

// src/index.ts
import { env } from "node:process";
import { App } from "./App.mjs";
import { resolveOptions } from "./options.mjs";
import { logger } from "./logger.mjs";
import process from "node:process";
export * from "./type.mjs";
export * from "./Middleware.mjs";
var useTvvins = (options) => {
  process.on("uncaughtException", (err, origin) => {
    logger.error(err);
  });
  try {
    const mode = env["TVVINS_MODE"];
    const stage = env["TVVINS_STAGE"];
    if (mode === "server") {
      const app = new App();
      resolveOptions(options, mode).then((resolved) => {
        app.start(resolved);
      });
      return app;
    }
    const buildCtrl = async () => {
      const resolved = await resolveOptions(options, mode);
      const { build: build2 } = await Promise.resolve().then(() => (init_build(), build_exports));
      build2(resolved);
    };
    buildCtrl();
  } catch (e) {
    logger.error(e);
  }
};
export {
  useTvvins
};
