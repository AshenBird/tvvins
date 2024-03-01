/**
 * 用于在服务端定义 api
 */
import type { ZodType } from "zod";
import type { z } from "zod";
import { ID, IDENTITY } from "@tvvins/core";
export interface ApiHandle<Payload, Result, _Headers, Context = unknown> {
    (this: Context, payload?: Payload, headers?: _Headers): Promise<Result> | Result;
}
export interface API<Payload, Result, _Headers> extends ApiHandle<Payload, Result, _Headers> {
    [ID]: string;
    [IDENTITY]: "api";
}
export interface ApiWithValidate<Payload, Result, _Headers, Context = unknown> {
    (this: Context, payload: Payload, headers?: _Headers): Promise<Result> | Result;
    [ID]: string;
    [IDENTITY]: "api";
}
export declare const zod2ValidateResult: () => void;
export declare const isAPI: <T = unknown, S = unknown, Q = unknown>(val: unknown) => val is API<T, S, Q>;
export declare const defineAPI: <Payload, Result, _Headers, Schema extends ZodType<any, z.ZodTypeDef, any>, Context = unknown>(handle: ApiHandle<Payload, Result, _Headers, unknown>, schema?: Schema | undefined) => Schema extends undefined ? API<Payload, Result, _Headers> : ApiWithValidate<z.TypeOf<Schema>, Result, _Headers, unknown>;
