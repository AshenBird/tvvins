import type { Context } from "./Context";
import type { Server as ConnectServer, HandleFunction } from "connect";
import type { UserConfig as ViteUserConfig, UserConfigExport } from "vite";
import type { Plugin as EsbuildPlugin } from "esbuild";
import type { App as A } from "./App"
import type { Context as C } from "./Context"
export declare namespace Tvvins {
  export type App = A
  export type Context = C
  export type InitOptions = {
    host?: string; // @default "localhost"
    port?: number; // @default 8000
    plugins?: Tvvins.Plugin[]; // @default []
    modules?: Module[]; // @default []
    middlewares?: Middleware[]; // @default []
    build?: InitBuildOptions; // @default {},
    vite?: UserConfigExport
  };

  export type AppEventMap = {
    "pre-mount": [];
    listen: [];
  };

  export type InitBuildOptions = {
    source?: string; // @default "./src"
    output?: string; // @default "./dist"
    hooks?:{
      beforeBuild?:((...age:any[])=>any)[]
      builded?:((...age:any[])=>any)[]
    },
    env?:Record<string,string>
    envFile?:string
  };
  export type Mode = "build" | "server"
  export type Stage = "development" | "production" | "test"
  export type MergedInitOptions = Omit<Required<InitOptions>, "build"|"vite"> & {
    build: Required<InitBuildOptions>
    mode: Mode
    stage: Stage
    vite:ViteUserConfig
  }
  export interface ResolvedInitBuildOptions extends Required<InitBuildOptions> {
    plugins: EsbuildPlugin[]
  }
  export interface ResolvedInitOptions extends Omit<MergedInitOptions, "plugins" | "build"|"vite"> {
    plugins: PluginObj[]
    build: ResolvedInitBuildOptions
    vite:ViteUserConfig
  }
  export type ResolvedRunTimeInitOptions = Omit<ResolvedInitOptions, "build">


  export type Middleware = ConnectMiddleware | TvvinsMiddleware;
  export type ConnectHandle = HandleFunction | ConnectServer;
  type MiddlewareBase = {
    name?: string;
    setName: (name: string) => void;
  };
  export interface ConnectMiddleware extends MiddlewareBase {
    isConnect: true;
    handle: ConnectHandle;
  }
  export interface TvvinsMiddleware extends MiddlewareBase {
    isConnect: false;
    handle: RequestHandle;
  }

  /*--- Middleware -----*/
  export type RequestHandle = (ctx: Context, next: () => any) => any;

  /*--- Plugin -----*/
  export interface PluginObj {
    name: string;
    middlewares?: Middleware[];
    build?: {
      plugins?: EsbuildPlugin[]
    };
    vite?:UserConfigExport
  }
  export interface Plugin<T extends Record<string,unknown> = {}> {
    (option: MergedInitOptions&T): PluginObj;
  }
  export interface ResolvedPlugin { }

  /*--- Module -----*/
  export interface Module { }
}

/*--------------------------------------------------*/
export type PluginConfig = {
  vite: UserConfigExport;
};
export type PluginConfigFn = (
  config: Config
) => PluginConfig | Promise<PluginConfig>;

type ConfigBase = {
  port: number;
  entry: string;
  source: string;
  useDefaultStatic: boolean;
  host: string;
  build: {
    output: string;
  };
};

export interface Config extends ConfigBase {
  vite: UserConfigExport;
  plugins: (PluginConfig | Promise<PluginConfig> | PluginConfigFn)[];
}

export type DevConfig = Partial<Config>;

export type UserConfig = Partial<Config> & {
  development?: DevConfig;
  production?: Partial<Config>;
};
