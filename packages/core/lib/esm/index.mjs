// src/index.ts
import { env } from "node:process";
import { App } from "./App.mjs";
import { resolveOptions } from "./options.mjs";
export * from "./type.mjs";
export * from "./Middleware.mjs";
var useTvvins = (options) => {
  const mode = env["TVVINS_MODE"];
  const resolved = resolveOptions(options, mode);
  if (mode === "runtime" || mode === "dev") {
    const app = new App(resolved);
    return app;
  }
};
export {
  useTvvins
};
