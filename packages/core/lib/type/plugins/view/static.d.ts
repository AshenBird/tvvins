import { InlineConfig, type UserConfig, createServer } from "vite";
import { Tvvins } from "../../type";
export declare const createDevMiddleware: (viteOptions: InlineConfig) => Tvvins.ConnectMiddleware;
export declare const _createViteServer: typeof createServer;
export declare const createStaticMiddleware: (viteOptions: UserConfig) => Tvvins.Middleware;
