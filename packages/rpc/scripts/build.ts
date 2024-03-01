import * as Path from "node:path";
import { cwd } from "node:process";
import * as FileSystem from "fs-extra";
import { BuildOptions, build as _build } from "esbuild";
import {
  getFileList,
  log,
  generatorDeclare,
} from "@mcswift/cli-utils";
import * as FS from "node:fs"
const root = cwd();
const baseLib = Path.join(root, `lib`);
FileSystem.ensureDirSync(baseLib);
FileSystem.emptyDirSync(baseLib);
const build = async (name:string,type:BuildOptions["platform"]) => {
  const src = Path.join(root, `src/${name}`);
  const lib = Path.join(root, `lib/${name}`);
  const fileList = getFileList(src);
  FileSystem.ensureDirSync(lib)
  const tasks:Promise<unknown>[] = []
  const buildTask = _build({
    entryPoints: fileList,
    platform: type,
    drop: ["debugger"],
    target: ["es2015"],
    bundle: false,
    outdir: lib,
    format: "esm",
  });
  const declareTask= generatorDeclare(`./src/${name}`, `./types/${name}`, cwd(), `./tsconfig.${name}.json`);
  tasks.push(buildTask,declareTask)
  await Promise.all(tasks)
  // await FS.promises.rm(Path.join(cwd(),`tsconfig.${name}.tsbuildinfo`))
};

const main = async ()=>{
  const tasks= [
    build("client","browser"),
    build("server","node"),
  ]
  await Promise.all(tasks);
  log("build finish");
}
main()