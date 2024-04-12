import type { Tvvins } from "./type";
import type { NextHandleFunction, Server as ConnectServer, SimpleHandleFunction } from "connect";
import { Context } from "./Context";
export declare const defineMiddleWare: <T extends boolean = false>(handle: T extends false ? Tvvins.RequestHandle : Tvvins.ConnectHandle, name?: string, isConnect?: T) => T extends false ? Tvvins.TvvinsMiddleware : Tvvins.ConnectMiddleware;
export declare const defineConnectMiddleWare: (handle: Tvvins.ConnectHandle, name?: string) => Tvvins.ConnectMiddleware;
export declare const transformConnectToTvvins: (raw: ConnectServer | SimpleHandleFunction | NextHandleFunction) => (ctx: Context, next: () => Promise<unknown>) => Promise<void>;
export declare const connectMiddlewareWrap: (handle: Tvvins.RequestHandle, app: Tvvins.App) => ConnectServer | SimpleHandleFunction | NextHandleFunction;
