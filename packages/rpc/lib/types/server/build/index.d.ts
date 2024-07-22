import { Plugin } from "vite";
import { Store } from "../core/store";
export type RPCPluginOptions = {
    apiDir: string;
};
export declare const vitePlugin: (dirs: string[], idStore: Store) => Plugin;
