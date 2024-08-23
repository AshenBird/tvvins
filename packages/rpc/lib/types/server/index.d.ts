import { type Tvvins } from "@tvvins/core";
import { API, ApiHandle, RPCOptions } from "./type";
export { BodyParserManager } from "./core/body-parse";
export declare const useRPC: (options?: Partial<RPCOptions>) => {
    plugin: Tvvins.Plugin;
    defineAPI: <Payload, Result>(handle: ApiHandle<Payload, Result>, name?: string) => API<Payload, Result>;
    getSession: (payload: any) => any;
};
