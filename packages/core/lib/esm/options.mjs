// src/options.ts
import { resolve } from "path";
import { mergeArray, mergeRecord } from "./utils.mjs";
import { cwd } from "process";
import { viewPlugin } from "./plugins/view/index.mjs";
import { mergeConfig } from "vite";
var DEFAULT_OPTION = {
  host: "localhost",
  port: 8e3,
  plugins: [],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist"
  },
  vite: {
    publicDir: resolve(cwd(), "./public")
  }
};
var mergeOptions = (a, b) => {
  return mergeRecord(a, b);
};
var resolveOptions = async (raw, mode) => {
  const merged = mergeOptions(DEFAULT_OPTION, raw);
  Reflect.set(merged, "mode", mode);
  const buildPlugins = [];
  let vite = mergeConfig({}, await unwrapViteConfig(merged?.vite || {}));
  merged.plugins.push(viewPlugin);
  for (const plugin of merged.plugins) {
    const { middlewares = [], build, vite: pVite = {}, name } = plugin(
      merged
    );
    merged.middlewares = mergeArray(merged.middlewares, middlewares);
    vite = mergeConfig(vite, await unwrapViteConfig(pVite));
    merged.vite = vite;
    if (build) {
      buildPlugins.push(...build.plugins || []);
    }
  }
  Reflect.set(merged.build, "plugins", buildPlugins);
  Reflect.set(merged.build, "vite", vite);
  return merged;
};
var unwrapViteConfig = async (userConfig) => {
  const configEnv = {
    command: "serve",
    mode: "development"
  };
  const config = await (typeof userConfig === "function" ? userConfig(configEnv) : userConfig);
  return config;
};
export {
  mergeOptions,
  resolveOptions,
  unwrapViteConfig
};
