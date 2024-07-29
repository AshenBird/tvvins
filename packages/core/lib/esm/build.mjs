// src/build.ts
import { argv, cwd } from "node:process";
import { resolve } from "node:path";
import { build as esbuild } from "esbuild";
import { emptyDirSync, ensureDirSync } from "fs-extra";
import { build as viteBuild } from "vite";
var build = async (options) => {
  const [nodePath, entryPath] = argv;
  const base = cwd();
  const { build: buildOption } = options;
  const { output, plugins } = buildOption;
  const outdir = resolve(base, output);
  ensureDirSync(outdir);
  emptyDirSync(outdir);
  const viewTask = await viteBuild(options.vite);
  console.debug("client build finish");
  const serverTask = await esbuild({
    entryPoints: [entryPath],
    target: "node20",
    platform: "node",
    outdir: `${outdir}/server`,
    format: "cjs",
    packages: "external",
    bundle: true,
    outExtension: {
      ".js": ".cjs"
    },
    plugins: [
      ...plugins
    ]
  });
  console.debug("server build finish");
};
export {
  build
};
