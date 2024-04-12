import type { Server as ConnectServer, HandleFunction } from "connect";
import type { UserConfigExport } from "vite";
import type { Plugin as EsbuildPlugin } from "esbuild";
import type { App as A } from "./App";
import type { Context as C } from "./Context";
export declare namespace Tvvins {
    type App = A;
    type Context = C;
    type InitOptions = {
        host?: string;
        port?: number;
        plugins?: Tvvins.Plugin[];
        modules?: Module[];
        middlewares?: Middleware[];
        build?: InitBuildOptions;
    };
    type AppEventMap = {
        "pre-mount": [];
        listen: [];
    };
    type InitBuildOptions = {
        source?: string;
        output?: string;
    };
    type Mode = "build" | "dev" | "runtime";
    type MergedInitOptions = Required<InitOptions> & {
        mode: Mode;
    };
    interface ResolvedInitBuildOptions extends Required<InitBuildOptions> {
        plugins: EsbuildPlugin[];
    }
    interface ResolvedInitOptions extends Omit<MergedInitOptions, "plugins" | "build"> {
        plugins: PluginObj[];
        build: ResolvedInitBuildOptions;
    }
    type ResolvedRunTimeInitOptions = Omit<ResolvedInitOptions, "build">;
    type Middleware = ConnectMiddleware | TvvinsMiddleware;
    type ConnectHandle = HandleFunction | ConnectServer;
    type MiddlewareBase = {
        name?: string;
        setName: (name: string) => void;
    };
    interface ConnectMiddleware extends MiddlewareBase {
        isConnect: true;
        handle: ConnectHandle;
    }
    interface TvvinsMiddleware extends MiddlewareBase {
        isConnect: false;
        handle: RequestHandle;
    }
    type RequestHandle = (ctx: Context, next: () => any) => any;
    interface PluginObj {
        name: string;
        middlewares?: Middleware[];
        build?: EsbuildPlugin;
    }
    interface Plugin {
        (option: Required<InitOptions>): PluginObj;
    }
    interface ResolvedPlugin {
    }
    interface Module {
    }
}
export type PluginConfig = {
    vite: UserConfigExport;
};
export type PluginConfigFn = (config: Config) => PluginConfig | Promise<PluginConfig>;
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
export {};
