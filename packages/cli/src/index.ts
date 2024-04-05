import { Logger } from "@mcswift/base-utils";
import { Cli } from "@mcswift/cli"
import { getCommandFile } from "@mcswift/node"
import {  join, resolve } from "path";
import { cwd, stdin } from "process";
import { pathToFileURL } from "node:url";
import { spawn } from "child_process";
import dotenv from "dotenv"
dotenv.config()
const tvvins = new Cli("tvvins");

const loadConfig = async ()=>{
  const configRawPath = join(cwd(),"tvvins.config.ts")
  const {default :config} = await import(pathToFileURL(configRawPath).toString())
  Logger.debug(config)
  return config
}

const start = async (isDev:boolean)=>{
  const config = await loadConfig()
  const {source,entry} = config
  const command = await getCommandFile("tsx",import.meta.dirname)
  if(!command)return;
  const sourcePath = resolve(cwd(),source);
  const entryPath = resolve(sourcePath,entry+".ts")
  const args = []
  if(isDev)args.push("watch");
  args.push('--no-warnings',"--ignore","./vite.config.ts.timestamp-*",entryPath)
  spawn(command,args,{
    stdio:"inherit",
    shell:true,
    env:Object.assign({TVVINS_MODE:"development",TVVINS_HOST:config.host},process.env)
  })
}

tvvins.use("start",async ()=>{
  start(false)
})

tvvins.use("dev",async ()=>{
  start(true)
})

tvvins.use("build",()=>{
  // start(true)
})

tvvins.start()
