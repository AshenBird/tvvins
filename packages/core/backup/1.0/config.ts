// import {
//   ConfigEnv,
//   UserConfigExport,
//   UserConfig as ViteUserConfig,
//   mergeConfig,
// } from "vite";
// import {
//   Config,
//   UserConfig,
// } from "./type";
// import { pathToFileURL } from "url";
// import { join } from "node:path";
// import { cwd } from "node:process";
// const DEFAULT_CONFIG: Config = {
//   port: 8000,
//   entry: "main",
//   source: "./src",
//   useDefaultStatic: true,
//   host: "localhost",
//   vite: {},
//   plugins: [],
//   build: {
//     output: "./dist",
//   },
// };
// export const unwrapViteConfig = async (userConfig: UserConfigExport) => {
//   const configEnv: ConfigEnv = {
//     command: "serve",
//     mode: "development",
//   };
//   const config = await (typeof userConfig === "function"
//     ? userConfig(configEnv)
//     : userConfig);

//   return config;
// };

// export const resolveConfig = async (
//   config: UserConfig
// ): Promise<ResolvedConfig> => {
//   const { vite: baseViteConfig = {}, plugins: _plugins = [], ...base } = config;
//   const plugins: ResolvedPluginConfig[] = [];
//   let vite = mergeConfig(
//     {
//       build: {
//         minify: "terser",
//       } as ViteUserConfig,
//     },
//     await unwrapViteConfig(baseViteConfig)
//   ) as ViteUserConfig;
//   for (const raw of _plugins) {
//     const { vite: pluginViteConfig = {}, ...bp } = await (typeof raw ===
//     "function"
//       ? raw(Object.assign(config, DEFAULT_CONFIG))
//       : raw);
//     const p = {
//       ...bp,
//       vite: await unwrapViteConfig(pluginViteConfig),
//     };
//     plugins.push(p);
//     vite = mergeConfig(vite, p.vite, true) as ViteUserConfig;
//   }
//   return {
//     ...DEFAULT_CONFIG,
//     ...base,
//     vite,
//     plugins,
//   };
// };

// export const defineConfig = (userConfig: UserConfig) => {
//   return Object.assign({}, DEFAULT_CONFIG, userConfig);
// };

// let cache: UserConfig | null = null;

// export const loadConfig = async (mode: "build" | "runtime" = "build") => {
//   if (cache) return cache as UserConfig;
//   const configRawPath = join(
//     cwd(),
//     "tvvins.config." + (mode === "build" ? "ts" : "js")
//   );

//   const { default: config } = await import(
//     pathToFileURL(configRawPath).toString()
//   );

//   cache = config;
//   return cache as UserConfig;
// };
