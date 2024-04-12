import { resolve } from "path";
import { Tvvins } from "./type";
import { mergeArray, mergeRecord } from "./utils";
import { cwd } from "process";
import { viewPlugin } from "./plugins/view";
import type { ConfigEnv, UserConfigExport } from "vite";
import { mergeConfig } from "vite"

const DEFAULT_OPTION: Required<Tvvins.InitOptions>&{
  build:Required<Tvvins.InitBuildOptions>
} = {
  host: "localhost",
  port: 8000,
  plugins: [viewPlugin],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist",
    vite:{
      publicDir:resolve(cwd(), "./public")
    }
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
  let vite : Tvvins.ResolvedInitBuildOptions["vite"] ={}
  for (const plugin of merged.plugins) {
    const { middlewares = [], build } = plugin(
      merged as Tvvins.MergedInitOptions
    );
    merged.middlewares = mergeArray(merged.middlewares, middlewares);
    if (build) {
      buildPlugins.push(...(build.plugins||[]));
      vite = mergeConfig(vite,unwrapViteConfig(build.vite||{}))
    }
  }
  if (mode === "runtime") {
    Reflect.deleteProperty(merged, "build");
    return merged as unknown as T extends "runtime"
    ? Tvvins.ResolvedRunTimeInitOptions
    : Tvvins.ResolvedInitOptions
  }
  Reflect.set(merged.build, "plugins", buildPlugins);
  Reflect.set(merged.build, "vite", vite);
  return merged as unknown as Tvvins.ResolvedInitOptions;
};
export const unwrapViteConfig = async (userConfig: UserConfigExport) => {
  const configEnv: ConfigEnv = {
    command: "serve",
    mode: "development",
  };
  const config = await (typeof userConfig === "function"
    ? userConfig(configEnv)
    : userConfig);

  return config;
};
