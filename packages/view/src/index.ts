import type {Tvvins} from "@tvvins/core"
import { createStaticMiddleware } from "./static"
import type { UserConfigExport } from "vite"
export const createTvvinsView = (viteOptions:UserConfigExport):Tvvins.Plugin=>(options:Tvvins.InitOptions)=>{
  const result:Tvvins.PluginObj = {
    name: "@tvvins/view",
    middlewares:[
      createStaticMiddleware(options,viteOptions)
    ]
  }
  return result
}

