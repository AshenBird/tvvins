import { BuildOptions, build as _build } from 'esbuild'
import * as Path from 'node:path'
import * as FS from 'node:fs'
import * as FileSystem from "fs-extra"
// import * as ChildProcess from 'node:child_process'

// import { mandatoryFileExtensionsPlugin } from '@mcswift/utils/cli'
import { getFilePaths } from '@mcswift/utils/node'
import { Logger } from '@mcswift/utils'
// import { resolveCliOption } from "@mcswift/utils/cli"
import { cwd } from 'node:process'

export const build = async () => {
  Logger.info(`@tvvins/cli is building`)
  const root = cwd()
  const bin = Path.join(root, 'bin')
  const src = Path.join(root, 'src')
  // 获得全部要构建的文件
  const fileList = getFilePaths(src, ['./bin'])
  // 清空构建目录
  FileSystem.ensureDirSync(bin)
  FileSystem.emptyDirSync(bin)
  const tasks: Promise<unknown>[] = []
  // 配置通用构建配置
  const commonOption: Partial<BuildOptions> = {
    drop: ['debugger'],
    target: ['chrome87'],
  }
  tasks.push(
    _build({
      ...commonOption,
      entryPoints: [src],
      target: 'node16',
      bundle: true,
      // outdir: bin,
      platform: 'node',
      packages: 'external',
      format: 'esm',
      outfile: Path.join(bin, 'index.mjs'),
      outExtension: { '.js': '.mjs' },
    })
  )
  // commonjs 构建
  // tasks.push(
  //   _build({
  //     ...commonOption,
  //     entryPoints: [Path.join(src, 'bin')],
  //     bundle: true,
  //     outdir: bin,
  //     target: 'node16',
  //     platform: 'node',
  //     packages: 'external',
  //     outExtension: { '.js': '.cjs' },
  //     format: 'cjs',
  //   })
  // )
  await Promise.all(tasks)
  const replaceTasks: Promise<void>[] = []
  // for (const libFilePath of libFileList) {
  //   if (libFilePath.endsWith('.tsbuildinfo')) {
  //     replaceTasks.push(FS.promises.rm(libFilePath))
  //     continue
  //   }
    // replaceTasks.push(replacePackage(libFilePath))
  // }
  await Promise.all(replaceTasks)
  Logger.log(`@tvvins/cli has build`)
  return
}

build()