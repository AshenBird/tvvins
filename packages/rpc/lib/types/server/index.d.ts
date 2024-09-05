import { type Tvvins } from "@tvvins/core";
import { API, RPCOptions } from "./type";
export { BodyParserManager } from "./core/body-parse";
export declare const useRPC: (options?: Partial<RPCOptions>) => {
    plugin: Tvvins.Plugin<{
        API?: Record<string, API> | undefined;
    }>;
    defineAPI: <Result, Handle extends (...args: any[]) => Result>(handle: Handle, name?: string) => import("./type").APIFac<Handle>;
};
