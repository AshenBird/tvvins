/// <reference types="node" />
/// <reference types="node" />
import type { Tvvins } from "./type";
import { type Server as HttpServer } from "node:http";
import { EventEmitter } from "node:events";
export declare class App extends EventEmitter<Tvvins.AppEventMap> {
    private middleWares;
    private _options;
    private _httpServer;
    private _connect;
    get isDevelopment(): boolean;
    get httpServer(): HttpServer<typeof import("http").IncomingMessage, typeof import("http").ServerResponse> | undefined;
    get options(): Tvvins.ResolvedInitOptions | Tvvins.ResolvedRunTimeInitOptions;
    constructor(options: Tvvins.ResolvedInitOptions | Tvvins.ResolvedRunTimeInitOptions);
    private init;
    private listen;
    use(middleware: Tvvins.Middleware, name?: string | symbol): this;
}
