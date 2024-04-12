import { argv, cwd } from "node:process";
import { Tvvins } from "./type"
import { resolve } from "node:path";
import { build as esbuild } from "esbuild";
import { emptyDirSync, ensureDirSync } from "fs-extra";
export const build = async (options:Tvvins.ResolvedInitOptions)=>{
  const [ nodePath, entryPath ] =argv
  const base = cwd();
  const {build:buildOption} = options
  const { output,plugins } = buildOption
  const outdir = resolve(base, output);
  // const sourcePath = resolve(base, source);
  ensureDirSync(outdir);
  emptyDirSync(outdir);
  await esbuild({
    entryPoints: [entryPath],
    target: "node20",
    platform: "node",
    outdir,
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
}