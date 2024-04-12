import type {Tvvins} from "../../type"
import { createStaticMiddleware } from "./static"
export const viewPlugin:Tvvins.Plugin = (options)=>{
  const result:Tvvins.PluginObj = {
    name: "@tvvins/view",
    middlewares:[
      createStaticMiddleware(options.build.vite)
    ]
  }
  return result
}

