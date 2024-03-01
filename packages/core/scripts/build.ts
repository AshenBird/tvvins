import { cwd } from "node:process";
import { build as _build } from 'esbuild'
import * as Path from 'node:path'
import * as FileSystem from 'fs-extra'
import * as FS from 'fs'
import { getFileList,generatorDeclare, log } from "@mcswift/cli-utils"
log(`building`)
const root = cwd()
const lib = Path.join(root, 'lib')
const src = Path.join(root, 'src')
const build = async()=>{
  // 获得全部要构建的文件
  const fileList = getFileList(src)
  // 清空构建目录
  FileSystem.ensureDirSync(lib)
  FileSystem.emptyDirSync(lib)
  const tasks:Promise<unknown>[] = []
  // 构建
  tasks.push(_build({
    entryPoints: fileList,
    platform: 'node',
    drop: ['debugger'],
    target: ['es2015'],
    bundle: false,
    outdir: lib,
    format: 'esm'
  }))
  // 生成类型
  tasks.push(
    generatorDeclare('./src', './types', root,"tsconfig.json")
  )
  await Promise.all(tasks)
  // 清除 buildInfo 文件
  const replaceTasks: Promise<void>[] = []
  replaceTasks.push(FS.promises.rm(Path.join(cwd(),"tsconfig.tsbuildinfo")))
  await Promise.all(replaceTasks)
  log(`has build`)
}
build()