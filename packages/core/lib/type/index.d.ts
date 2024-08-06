import { App } from "./App";
import { Tvvins } from "./type";
export * from "./type";
export type { Context } from "./Context";
export * from "./Middleware";
export declare const useTvvins: (options: Tvvins.InitOptions) => App | undefined;
export declare const useLog: (channel: string) => import("log4js").Logger;
