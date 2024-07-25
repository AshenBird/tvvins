import { join, resolve } from "path";
import { Tvvins } from "./type";
import { mergeArray, mergeRecord } from "./utils";
import { cwd } from "process";
import { viewPlugin } from "./plugins/view";
import type { ConfigEnv, UserConfig, UserConfigExport } from "vite";
import { mergeConfig, loadConfigFromFile, resolveConfig } from "vite"
import {pathToFileURL} from "node:url"
const DEFAULT_OPTION: Required<Tvvins.InitOptions> & {
  build: Required<Tvvins.InitBuildOptions>
} = {
  host: "localhost",
  port: 8000,
  plugins: [],
  modules: [],
  middlewares: [],
  build: {
    source: "./src",
    output: "./dist",
  },
  vite: {
    publicDir: resolve(cwd(), "./public")
  }
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

export const resolveOptions = async <T extends Tvvins.Mode>(
  raw: Tvvins.InitOptions,
  mode: T
): Promise<T extends "server" ? Tvvins.ResolvedRunTimeInitOptions : Tvvins.ResolvedInitOptions> => {
  const merged = mergeOptions(DEFAULT_OPTION, raw);
  Reflect.set(merged, "mode", mode);
  const buildPlugins: Tvvins.ResolvedInitBuildOptions["plugins"] = [];
  // const viteUserConfigPath = pathToFileURL(join(process.cwd(), "vite.config.ts")).toString()
  // const viteUserConfig = (await import(viteUserConfigPath)).default||{} await unwrapViteConfig(viteUserConfig)
  let vite = mergeConfig({}, await unwrapViteConfig(merged?.vite || {})) as UserConfig

  merged.plugins.push(viewPlugin)
  for (const plugin of merged.plugins) {
    const { middlewares = [], build, vite: pVite = {}, name } = plugin(
      merged as Tvvins.MergedInitOptions
    );
    merged.middlewares = mergeArray(merged.middlewares, middlewares);
    vite = mergeConfig(vite, await unwrapViteConfig(pVite))
    merged.vite = vite
    if (build) {
      buildPlugins.push(...(build.plugins || []));
    }
  }
  // if (mode === "server") {
  //   Reflect.deleteProperty(merged, "build");
  //   return merged as unknown as T extends "server"
  //     ? Tvvins.ResolvedRunTimeInitOptions
  //     : Tvvins.ResolvedInitOptions
  // }
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
