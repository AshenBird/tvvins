import { type ZodType } from "zod";
import type { z } from "zod";
import { API, ApiHandle } from "../type";
export declare const isAPI: <T = unknown, Q = unknown>(val: unknown) => val is API<T, Q>;
export declare const _defineAPI: <Payload, Result, Schema extends ZodType<any, z.ZodTypeDef, any>>(store: Map<string, API>, handle: ApiHandle<Payload, Result>, schema?: Schema) => API<Payload, Result>;
