import { env } from "node:process";
import { App } from "./App";
import { resolveOptions } from "./options";
import { Tvvins } from "./type";
import { build } from "./build";
export * from "./type";
export type { Context } from "./Context";
export * from "./Middleware";
export const useTvvins = (options: Tvvins.InitOptions) => {
  const mode = env["TVVINS_MODE"] as Tvvins.Mode
  
  const resolved = resolveOptions(options,mode) as Tvvins.ResolvedInitOptions
  if(mode === "runtime"|| mode==="dev"){
    const app = new App(resolved);
    return app;
  }
  build(resolved)
};
