import { createServer } from "vite"
import * as Path from "node:path"
import process from "node:process"

export const viteServerPromise = createServer({
  configFile:Path.join(process.cwd(),"vite.config.ts"),
  server:{
    middlewareMode:true
  }
})
