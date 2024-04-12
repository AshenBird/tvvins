// src/options.ts
import { resolve } from "path";
import { mergeArray, mergeRecord } from "./utils.mjs";
import { cwd } from "process";
import { viewPlugin } from "./plugins/view/index.mjs";
import { mergeConfig } from "vite";
var DEFAULT_OPTION = {
  host: "localhost",
  port: 8e3,
  plugins: [viewPlugin],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist",
    vite: {
      publicDir: resolve(cwd(), "./public")
    }
  }
};
var mergeOptions = (a, b) => {
  return mergeRecord(a, b);
};
var resolveOptions = (raw, mode) => {
  const merged = mergeOptions(DEFAULT_OPTION, raw);
  Reflect.set(merged, "mode", mode);
  const buildPlugins = [];
  let vite = {};
  for (const plugin of merged.plugins) {
    const { middlewares = [], build } = plugin(
      merged
    );
    merged.middlewares = mergeArray(merged.middlewares, middlewares);
    if (build) {
      buildPlugins.push(...build.plugins || []);
      vite = mergeConfig(vite, unwrapViteConfig(build.vite || {}));
    }
  }
  if (mode === "runtime") {
    Reflect.deleteProperty(merged, "build");
    return merged;
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
