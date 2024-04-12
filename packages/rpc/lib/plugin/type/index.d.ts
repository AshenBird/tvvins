import { PluginConfigFn } from "@tvvins/core";
import { Plugin } from "vite";
export type RPCPluginOptions = {
    apiDir: string;
};
export declare const vitePlugin: (dirs: string[]) => Plugin;
export declare const RPC: (dirs: string | string[]) => PluginConfigFn;
