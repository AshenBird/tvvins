// src/index.ts
import { env } from "node:process";
import { App } from "./App.mjs";
import { resolveOptions } from "./options.mjs";
import { build } from "./build.mjs";
import { createStaticMiddleware } from "./plugins/view/static.mjs";
export * from "./type.mjs";
export * from "./Middleware.mjs";
var useTvvins = (options) => {
  const mode = env["TVVINS_MODE"];
  console.debug(mode);
  const resolved = resolveOptions(options, mode);
  if (mode === "server") {
    const app = new App(resolved);
    app.use(createStaticMiddleware(resolved.build.vite));
    return app;
  }
  build(resolved);
};
export {
  useTvvins
};
