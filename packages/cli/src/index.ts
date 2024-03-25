import { Logger } from "@mcswift/utils";
import { Cli } from "@mcswift/utils/cli"
import { createApp  } from "@tvvins/server"
import { join } from "path";
import { cwd } from "process";
import { pathToFileURL } from "node:url";

const tvvins = new Cli("tvvins");

const loadConfig = async ()=>{
  const configRawPath = join(cwd(),"tvvins.config.ts")
  // if(!existsSync(configRawPath))return {}
  // await build({
  //   platform:"node",
  //   target:"node16",
  // })
  const {default :config} = await import(pathToFileURL(configRawPath).toString())
  Logger.info(config)
  return config
}

const start = async (isDev:boolean)=>{
  const config = await loadConfig()
  const app = createApp(isDev)
  app.listen(config.port||8000)
}

tvvins.use("start",async (options)=>{
  start(false)
})

tvvins.use("dev",()=>{
  start(true)
})

tvvins.start()
