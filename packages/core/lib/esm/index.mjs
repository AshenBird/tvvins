// src/index.ts
import { env } from "node:process";
import { App } from "./App.mjs";
import { resolveOptions } from "./options.mjs";
import { build } from "./build.mjs";
export * from "./type.mjs";
export * from "./Middleware.mjs";
var useTvvins = (options) => {
  const mode = env["TVVINS_MODE"];
  const stage = env["TVVINS_STAGE"];
  if (mode === "server") {
    const app = new App();
    resolveOptions(options, mode).then((resolved) => {
      app.start(resolved);
    });
    return app;
  }
  resolveOptions(options, mode).then((resolved) => {
    build(resolved);
  });
};
export {
  useTvvins
};
