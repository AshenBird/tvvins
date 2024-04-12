import type { Context } from "./Context";
import type { Server as ConnectServer, HandleFunction } from "connect";
import type { UserConfigExport } from "vite";
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
    build?: InitBuildOptions; // @default {}
  };
  
export type AppEventMap = {
  "pre-mount": [];
  listen: [];
};

  export type InitBuildOptions = {
    source?: string; // @default "./src"
    output?: string; // @default "./dist"
  };
  export type Mode = "build"|"dev"|"runtime"
  export type MergedInitOptions= Required<InitOptions>&{
    mode:Mode
  }
  export interface ResolvedInitBuildOptions extends Required<InitBuildOptions>{
    plugins:EsbuildPlugin[]
  }
  export interface ResolvedInitOptions extends Omit<MergedInitOptions,"plugins"|"build">{
    plugins:PluginObj[]
    build:ResolvedInitBuildOptions
  }
  export type ResolvedRunTimeInitOptions = Omit<ResolvedInitOptions,"build">


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
  export interface PluginObj{
    name: string;
    middlewares?: Middleware[];
    build?: EsbuildPlugin; 
  }
  // export interface PluginBuildOptions extends InitBuildOptions {
  //   plugin: EsbuildPlugin[];
  // }
  export interface Plugin {
    (option: Required<InitOptions>): PluginObj;
  }
  export interface ResolvedPlugin {}

  /*--- Module -----*/
  export interface Module {}
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
