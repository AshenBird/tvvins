import { argv, cwd } from "node:process";
import { Tvvins } from "./type"
import { join, resolve, sep } from "node:path";
import { build as esbuild } from "esbuild";
import { emptyDirSync, ensureDirSync, ensureFileSync } from "fs-extra";
import { build as viteBuild } from "vite"
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";


const checkFile = (path:string)=>{
  const withExt = path + ".ts"
  if(existsSync(withExt))return withExt
  const withFile =path + "index.ts"
  if(existsSync(withFile))return withFile
  return ""
}
export const build = async (options: Tvvins.ResolvedInitOptions) => {
  const { Logger } = await import("@mcswift/base-utils/logger")
  const [nodePath, entryPath] = argv
  const base = cwd();
  const { build: buildOption } = options
  const { output, plugins,hooks } = buildOption
  const outdir = resolve(base, output);
  if(hooks.beforeBuild){
    for(const hook of hooks.beforeBuild){
      hook()
    }
  }
  ensureDirSync(outdir);
  emptyDirSync(outdir);
  // 视图层构建
  await viteBuild(options.vite)
  Logger.info("client build finish")
  // const buildTasks:Promise<unknown>[] = []
  // const buildFile = async (entryPath:string,outPath:string)=>{
  await esbuild({
    entryPoints: [entryPath],
    target: "node20",
    platform: "node",
    outdir: join(outdir,"server"),
    format: "esm",
    packages: "external",
    bundle: true,
    outExtension: {
      ".js": ".mjs",
    },
    plugins: [
      ...plugins
    ],
  });
  // }
  // await buildFile(entryPath,join(outdir,"server"))
  // await Promise.all(buildTasks)
  Logger.info("server build finish")
  const dependencies = JSON.parse(readFileSync(resolve(cwd(), "./package.json"), { encoding: "utf-8" })).dependencies
  const postInstallPath = "./scripts/post-install.mjs"
  const targetPackage = {
    dependencies: {
      ...dependencies,
      "cross-env": "7.0.3"
    },
    devDependencies: {
      "fs-extra": "^11.2.0",
    },
    scripts: {
      "start": `cross-env TVVINS_STAGE=production TVVINS_MODE=server  node server/${entryPath.split(sep).pop()?.replace(".ts", ".mjs")}`,
    },
    private: true
  }
  const packagePath = resolve(outdir, "./package.json")
  ensureFileSync(packagePath)
  writeFileSync(packagePath, JSON.stringify(targetPackage, undefined, 2), { encoding: "utf-8" })
  Logger.info("production package.json has init")
  // post install
  ensureFileSync(resolve(outdir, postInstallPath))
  const idStorePathSource = join(cwd(), "node_modules/@tvvins/rpc/idStore.json")
  const idStorePathTarget = join(outdir, "idStore.json")
  copyFileSync(idStorePathSource, idStorePathTarget)
  if(hooks.builded){
    for(const hook of hooks.builded){
      hook()
    }
  }
}


// {
//   name: "rrr",
//   setup(builder: PluginBuild) {
//     builder.onResolve({
//       filter: /[.\\n]*/
//     },(args)=>{
//       if(args.kind==="entry-point")return null
//       // 这里假设所有的导入都是相对路径
//       const path = resolve(args.resolveDir,args.path)
//       const p = checkFile(path)
//       if(p){
        
//         const relativePath = relative(args.importer,p);
//         const target = resolve(resolve(outPath,relativePath),"../");
        
//         console.debug("递归构建:",{
//           path,target,outPath,_path:args.path
//         })
//         // buildTasks.push(buildFile(path,target))
//         return {
//           path:args.path + ".mjs",
//           external:true
//         }
//       }
//       console.debug("npm 依赖:",args)
//     })
//   }
// },