import { API, ApiHandle, RPCOptions } from "../type";
import { ZodType } from "zod";
export { BodyParserManager } from "./body-parse";
export declare const useRPC: (options?: Partial<RPCOptions>) => {
    defineAPI: <Payload, Result, Schema extends ZodType<any, import("zod").ZodTypeDef, any>>(handle: ApiHandle<Payload, Result>, schema?: Schema) => API<Payload, Result>;
    middleware: import("@tvvins/core").TvvinsMiddleware;
};
