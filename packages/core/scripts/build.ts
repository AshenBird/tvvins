import { getFilePaths } from "@mcswift/node"
import { mandatoryFileExtensionsPlugin } from "@mcswift/esbuild"
import { resolve } from "path";
import { generatorDeclare } from "@mcswift/tsc";
import { BuildOptions, build } from "esbuild"
import { emptyDirSync, ensureDirSync } from "fs-extra";
import { join } from "node:path";
import { cwd } from "node:process";
const out = resolve(__dirname,"../lib")
const src = resolve(__dirname,"../src")
const fileList = getFilePaths(src)
const esbuildOptions:BuildOptions = {
  entryPoints:fileList,
  target:"node20",
  platform:"node",
  packages:"external",
}
export const main = async ()=>{
  buildCJS()
  buildESM()
  genTypes()
}
const buildCJS = async()=>{
  const outdir = join(out,"cjs")
  ensureDirSync(outdir)
  emptyDirSync(outdir)
  await build({
    ...esbuildOptions,
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
const buildESM = async()=>{
  const outdir = join(out,"esm")
  ensureDirSync(outdir)
  emptyDirSync(outdir)
  await build({
    ...esbuildOptions,
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
  const outdir = join(out,"type")
  ensureDirSync(outdir)
  emptyDirSync(outdir)
  await generatorDeclare("./src", outdir, cwd(), "tsconfig.lib.json");
}
main()