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
  console.debug(mode)
  const resolved = resolveOptions(options,mode) as Tvvins.ResolvedInitOptions
  if(mode === "server"){
    const app = new App(resolved);
    app.use(createStaticMiddleware(resolved.vite))
    return app;
  }
  build(resolved)
};
