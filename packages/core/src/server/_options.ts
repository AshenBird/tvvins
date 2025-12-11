import {
  UserServerOptions,
  TvvinsModule,
  UserModuleOptions,
  ResolvedModuleOptions,
  RpcOption,
  ClientOption,
  ResolvedClientOption,
  ResolvedBrowserClientOption,
  ResolvedElectronClientOption,
  TvvinsPlugin,
} from "./types";
import { join } from "node:path";
import { argv } from "node:process";
import { SemVer } from "semver";
import {
  loadConfigFromFile,
  resolveConfig,
  UserConfig as ViteUserConfig,
  mergeConfig as mergeViteConfig,
} from "vite";

function resolveRpcOptions(raw?: RpcOption): RpcOption {
  if (typeof raw === "undefined") {
    return {
      baseURL: "/tvvins",
      port: 8080,
      accessMethod: "simple-http",
    };
  }
  return raw;
}

async function resolveViteConfig(raw?: undefined | ViteUserConfig) {
  const command = "serve";
  const mode = "development";
  // @todo 根据环境变量配置开发阶段
  const readResult = await loadConfigFromFile({
    command,
    mode,
  }).catch(() => null);
  const fileConfig = readResult ? readResult.config : {};
  const mergedConfig = raw ? mergeViteConfig(fileConfig, raw) : fileConfig;
  const resolvedConfig = await resolveConfig(mergedConfig, command);
  return resolvedConfig;
}

async function resolveClientOption(
  raw?: ClientOption
): Promise<ResolvedClientOption> {
  if (typeof raw === "boolean" && !raw) {
    return raw;
  }

  if (typeof raw === "undefined" || raw === true) {
    const result: ResolvedBrowserClientOption = {
      type: "browser",
      baseURL: "/",
      port: 8080,
      proxyByTvvins: true,
      vite: await resolveViteConfig(),
    };
    return result;
  }

  const vite = await resolveViteConfig(raw?.vite);
  if (!raw.type || raw.type === "browser") {
    const { baseURL = "/", port = 8080, proxyByTvvins = true } = raw;
    const result: ResolvedBrowserClientOption = {
      type: "browser",
      baseURL,
      port,
      proxyByTvvins,
      vite,
    };
    return result;
  }

  const result: ResolvedElectronClientOption = {
    type: "electron",
    vite,
  };
  return result;
}

export async function resolveOptions<
  P extends TvvinsPlugin[],
  S extends UserServerOptions,
  M extends TvvinsModule[]
>(raw: UserModuleOptions<P, S, M>): Promise<ResolvedModuleOptions<P, S, M>> {
  const {
    plugins = [],
    servers = [],
    modules = [],
    name = "",
    version = "",
    useGlobalExceptionCatch = false,
    entryPath = join(process.cwd(), argv[1]),
    client = true,
    // rpc = resolveRpcOptions(),
  } = raw;
  
  const result: ResolvedModuleOptions<P, S, M> = {
    plugins: plugins as P,
    servers: servers as S,
    modules: modules as M,
    name,
    version: new SemVer(version || "0.0.0"),
    useGlobalExceptionCatch,
    entryPath,
    client: await resolveClientOption(client),
  };
  return result;
}
