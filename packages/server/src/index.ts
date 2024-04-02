import { Server } from "./Server"
import { createStaticMiddleware } from "./static"
import { loadConfig } from "./utils"
export * from "./utils"

export const createApp = async (
)=>{
  const isDev = process.env.TVVINS_MODE==="development"
  const config = await loadConfig(isDev)
  const server = new Server(config);
  if(config.useDefaultStatic??true){
    const staticMiddleware = await createStaticMiddleware({
      configFile:config.viteConfigFile
    })
    server.on("pre-mount",()=>{
      server.useConnectMiddleWare(staticMiddleware,"official static")
    })
  }
  return server
}
