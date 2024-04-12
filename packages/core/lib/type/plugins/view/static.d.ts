import { UserConfigExport, createServer } from "vite";
import { Tvvins } from "../../type";
export declare const createDevMiddleware: (viteOptions: UserConfigExport) => Tvvins.ConnectMiddleware;
export declare const _createViteServer: typeof createServer;
export declare const createStaticMiddleware: (viteOptions: UserConfigExport) => Tvvins.Middleware;
