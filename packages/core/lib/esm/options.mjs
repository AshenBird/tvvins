// src/options.ts
import { mergeArray, mergeRecord } from "./utils.mjs";
var DEFAULT_OPTION = {
  host: "localhost",
  port: 8e3,
  plugins: [],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist"
  }
};
var mergeOptions = (a, b) => {
  return mergeRecord(a, b);
};
var resolveOptions = (raw, mode) => {
  const merged = mergeOptions(DEFAULT_OPTION, raw);
  Reflect.set(merged, "mode", mode);
  const buildPlugins = [];
  for (const plugin of merged.plugins) {
    const { middlewares = [], build } = plugin(
      merged
    );
    merged.middlewares = mergeArray(merged.middlewares, middlewares);
    if (build) {
      buildPlugins.push(build);
    }
  }
  if (mode === "runtime") {
    Reflect.deleteProperty(merged, "build");
    return merged;
  }
  Reflect.set(merged.build, "plugins", buildPlugins);
  return merged;
};
export {
  mergeOptions,
  resolveOptions
};
