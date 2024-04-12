import { Tvvins } from "./type";
import { mergeArray, mergeRecord } from "./utils";

const DEFAULT_OPTION: Required<Tvvins.InitOptions> = {
  host: "localhost",
  port: 8000,
  plugins: [],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist",
  },
};

export const mergeOptions = <
  T extends Tvvins.InitOptions,
  S extends Tvvins.InitOptions
>(
  a: T,
  b: S
) => {
  return mergeRecord(a, b);
};

export const resolveOptions = <T extends Tvvins.Mode>(
  raw: Tvvins.InitOptions,
  mode: T
): T extends "runtime"
  ? Tvvins.ResolvedRunTimeInitOptions
  : Tvvins.ResolvedInitOptions => {
  const merged = mergeOptions(DEFAULT_OPTION, raw);
  // const mode = env["TVVINS_MODE"] as Tvvins.Mode
  Reflect.set(merged, "mode", mode);
  const buildPlugins: Tvvins.ResolvedInitBuildOptions["plugins"] = [];
  for (const plugin of merged.plugins) {
    const { middlewares = [], build } = plugin(
      merged as Tvvins.MergedInitOptions
    );
    merged.middlewares = mergeArray(merged.middlewares, middlewares);
    if (build) {
      buildPlugins.push(build);
    }
  }
  if (mode === "runtime") {
    Reflect.deleteProperty(merged, "build");
    return merged as unknown as T extends "runtime"
    ? Tvvins.ResolvedRunTimeInitOptions
    : Tvvins.ResolvedInitOptions
  }
  Reflect.set(merged.build, "plugins", buildPlugins);
  return merged as unknown as Tvvins.ResolvedInitOptions;
};
