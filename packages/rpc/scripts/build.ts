import { getFilePaths } from "@mcswift/node"
import { mandatoryFileExtensionsPlugin } from "@mcswift/esbuild"
import { resolve } from "path";
import { generatorDeclare } from "@mcswift/tsc";
import { BuildOptions, build } from "esbuild"
import { emptyDirSync, ensureDirSync } from "fs-extra";
import { join } from "node:path";
import { cwd } from "node:process";
import { existsSync, rmSync } from "fs";
const out = resolve(__dirname,"../lib")
const src = resolve(__dirname,"../src")

const esbuildOptions:BuildOptions = {
  target:"node20",
  platform:"node",
  packages:"external",
}
export const main = async ()=>{
  emptyDirSync(out)
  buildModule("client")
  buildModule("server")
  buildModule("common")
  // buildModule("plugin")
  genTypes()
}


const buildModule =async (path:string)=>{
  buildCJS(path)
  buildESM(path)
}


const buildCJS = async(path:string)=>{
  const outdir = join(out,"cjs",path)
  const entryPoints = getFilePaths(join(src,path))
  ensureDirSync(outdir)
  emptyDirSync(outdir)
  await build({
    ...esbuildOptions,
    entryPoints,
    outdir,
    format:"cjs",
    outExtension:{
      ".js":".cjs"
    },
    plugins: [
      mandatoryFileExtensionsPlugin({
        cjsExtension: "cjs",
        esm: false,
      }),
    ],
  })
}
const buildESM = async(path:string)=>{
  const outdir = join(out,"esm",path)
  const entryPoints = getFilePaths(join(src,path))
  ensureDirSync(outdir)
  emptyDirSync(outdir)
  await build({
    ...esbuildOptions,
    entryPoints,
    outdir,
    format:"esm",
    outExtension:{
      ".js":".mjs"
    },
    plugins: [
      mandatoryFileExtensionsPlugin({
        esmExtension: "mjs",
        esm: true,
      }),
    ],
  })
}
const genTypes = async ()=>{
  const outdir = join(out,"types")
  ensureDirSync(outdir)
  emptyDirSync(outdir)
  await generatorDeclare(`./src`, outdir, cwd(), `tsconfig.lib.json`);
  const tsbuildinfo = join(out,"tsconfig.lib.tsbuildinfo")
  if(existsSync(tsbuildinfo))rmSync(tsbuildinfo);
}
main()