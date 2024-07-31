import { type InlineConfig, type UserConfig } from "vite";
import { Tvvins } from "../../type";
export declare const createDevMiddleware: (viteOptions: InlineConfig) => Tvvins.ConnectMiddleware;
export declare const createStaticMiddleware: (viteOptions: UserConfig) => Tvvins.Middleware;
