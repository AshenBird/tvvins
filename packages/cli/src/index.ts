#!/usr/bin/env node
/**
 * @module
 * 命令:
 * - start 运行编译后的代码 mode: server stage: production
 * - dev 运行开发服务 mode: server stage: development
 * - build 运行构建命令 mode: build stage: production
 * 
 * TVVINS_MODE:
 * - server
 * - build
 * 
 * TVVINS_STAGE:
 * - development
 * - production
 * - test
 */
import { Logger } from "@mcswift/base-utils";
import { Cli } from "@mcswift/cli"
import { getCommandFile } from "@mcswift/node"
import { resolve } from "path";
import { cwd } from "node:process";
import { spawn } from "child_process";
import dotenv from "dotenv"
dotenv.config()
const tvvins = new Cli("tvvins");

const start = async (isDev:boolean,entry:string)=>{
  const command = await getCommandFile("tsx",import.meta.dirname)
  if(!command)return;
  // const sourcePath = resolve(cwd(),source);
  const entryPath = resolve(cwd(),entry)
  const args = []
  if(isDev){
    args.push("watch",'--no-warnings',"--ignore","./vite.config.ts.timestamp-*",entryPath);
  }else{
    args.push('--no-warnings',entryPath)
  }
  if(isDev){
    Logger.info("Begin Run devServer")
  }
  
  spawn(command,args,{
    stdio:"inherit",
    shell:true,
    env:Object.assign({
      TVVINS_STAGE:isDev?"development":"production",
      TVVINS_MODE:"server",
    },process.env)
  })
}

tvvins.use("start",async (options)=>{
  start(false,options.entry as string)
})

tvvins.use("dev",async (options)=>{
  start(true,options.entry as string)
})

tvvins.use("build",async (options)=>{
  const command = await getCommandFile("tsx",import.meta.dirname)
  if(!command)return;
  // const sourcePath = resolve(cwd(),source);
  const entryPath = resolve(cwd(),options.entry as string)
  const args = []
  args.push('--no-warnings',entryPath)
  Logger.debug("building")
  Logger.debug(args)
  spawn(command,args,{
    stdio:"inherit",
    shell:true,
    env:Object.assign({
      TVVINS_MODE:"build"
    },process.env)
  })
})

tvvins.start()
