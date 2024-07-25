import { env } from "node:process";
import { App } from "./App";
import { resolveOptions } from "./options";
import { Tvvins } from "./type";
import { build } from "./build";
import { createStaticMiddleware } from "./plugins/view/static";
export * from "./type";
export type { Context } from "./Context";
export * from "./Middleware";
export const useTvvins = (options: Tvvins.InitOptions) => {
  const mode = env["TVVINS_MODE"] as Tvvins.Mode
  
  if(mode === "server"){
    const app = new App();
    resolveOptions(options,mode).then((resolved)=>{
      app.start(resolved)
    })
    return app;
  }
  resolveOptions(options,mode).then((resolved)=>{
    build(resolved)
  })
};
