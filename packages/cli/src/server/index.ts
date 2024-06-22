import { nanoid } from "@mcswift/base-utils";
import { Config, loadConfig } from "@tvvins/core"
import { build } from "esbuild";
import { resolve } from "node:path";
import { cwd,env } from "node:process";
import { Worker } from "node:worker_threads"
const main =async (isDev:boolean)=>{
  const config =await loadConfig(isDev);
  const listenKeyName = nanoid()
  const payload = Object.assign({
    listenKeyName
   },config)
  const entry = getEntryPath(config)
  if(isDev){
    return createDevelopWorker(config,entry)
  }
}

const createDevelopWorker = (config:Config,entry:string)=>{
  build({
    
  })
  const worker = new Worker(entry,{
    env:Object.assign({TVVINS_MODE:"development",TVVINS_HOST:config.host},env)
  })

  
}

const getEntryPath = (config:Config)=>{
  const {source,entry} = config
  const sourcePath = resolve(cwd(),source);
  return resolve(sourcePath,entry+".ts")
}