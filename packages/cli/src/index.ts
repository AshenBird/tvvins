import { Logger } from "@mcswift/base-utils";
import { Cli } from "@mcswift/cli"
import { getCommandFile } from "@mcswift/node"
import {  resolve } from "path";
import { cwd} from "node:process";
import { spawn } from "child_process";
import dotenv from "dotenv"
// import  from "@tvvins/core";
import { build } from "./build";
dotenv.config()
const tvvins = new Cli("tvvins");

const start = async (isDev:boolean,entry:string)=>{
  const command = await getCommandFile("tsx",import.meta.dirname)
  if(!command)return;
  // const sourcePath = resolve(cwd(),source);
  const entryPath = resolve(cwd(),entry+".ts")
  const args = []
  if(isDev)args.push("watch");
  args.push('--no-warnings',"--ignore","./vite.config.ts.timestamp-*",entryPath)
  Logger.debug("run dev server")
  spawn(command,args,{
    stdio:"inherit",
    shell:true,
    env:Object.assign({TVVINS_MODE:"development"},process.env)
  })
}

tvvins.use("start",async (options)=>{
  start(false,options.entry as string)
})

tvvins.use("dev",async (options)=>{
  start(true,options.entry as string)
})

tvvins.use("build",()=>{
  // build()
})

tvvins.start()
