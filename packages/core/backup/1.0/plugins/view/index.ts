import type {Tvvins} from "../../type"
import { createStaticMiddleware } from "./static"
export const viewPlugin:Tvvins.Plugin = (options:Tvvins.MergedInitOptions)=>{
  const result:Tvvins.PluginObj = {
    name: "@tvvins/view",
    middlewares:[
      createStaticMiddleware(options.vite)
    ]
  }
  return result
}

