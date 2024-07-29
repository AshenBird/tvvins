import { argv, cwd } from "node:process";
import { Tvvins } from "./type"
import { relative, resolve } from "node:path";
import { build as esbuild } from "esbuild";
import { emptyDirSync, ensureDirSync, ensureFileSync } from "fs-extra";
import { build as viteBuild } from "vite"
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
export const build = async (options: Tvvins.ResolvedInitOptions) => {
  const [nodePath, entryPath] = argv
  const base = cwd();
  const { build: buildOption } = options
  const { output, plugins } = buildOption
  const outdir = resolve(base, output);
  // const sourcePath = resolve(base, source);
  ensureDirSync(outdir);
  emptyDirSync(outdir);
  // 视图层构建
  const viewTask = viteBuild(options.vite)

  // 服务端构建
  const serverTask = esbuild({
    entryPoints: [entryPath],
    target: "node20",
    platform: "node",
    outdir: `${outdir}/server`,
    format: "cjs",
    packages: "external",
    bundle: true,
    outExtension: {
      ".js": ".cjs",
    },
    plugins: [
      ...plugins
    ],
  });

  await Promise.all([viewTask, serverTask])
  const dependencies = JSON.parse(readFileSync(resolve(cwd(), "./package.json"), { encoding: "utf-8" })).dependencies
  const targetPackage = {
    dependencies:{
      ...dependencies,
      "cross-env":"7.0.3"
    },
    scripts: {
      "start": `cross-env TVVINS_STAGE=production TVVINS_MODE=server  node start ${resolve(`${outdir}/server`,relative(options.build.source,entryPath))}`
    },
    private:true
  }
  const packagePath = resolve(outdir,"./package.json") 
  ensureFileSync(packagePath)
  writeFileSync(packagePath,JSON.stringify(targetPackage,undefined,2),{encoding:"utf-8"})
}