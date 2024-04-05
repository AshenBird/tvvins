

import { API, ApiHandle, RPCOptions } from "../type";
import { Context } from "@tvvins/core";
import { bodyParse } from "./body-parse";
import { ZodType } from "zod";
import { _defineAPI } from "./api";
import { resHandle } from "./response";
import { defineMiddleWare } from "@tvvins/core/src/Middleware";

export { BodyParserManager } from "./body-parse"
export const useRPC = (options: Partial<RPCOptions> ={}) => {
  const { base = "/rpc" } = options;
  const store = new Map<string, API>();
  const handle = async (ctx: Context, next: () => unknown) => {
    if (!ctx.request.url.startsWith(base)) {
      return next();
    }
    const id = ctx.$.req.headers["x-tvvins-rpc-id"];
    if (!id) return next();
    const h = store.get(id as string);
    if (!h) return next();
    const payload = await bodyParse(ctx.$.req);
    // 用户处理逻辑
    const result = await h(payload);
    resHandle(ctx.$.res,result)
  };
  const middleware = defineMiddleWare(handle,"tvvins-rpc")
  const defineAPI = <Payload, Result, Schema extends ZodType>(
    handle: ApiHandle<Payload, Result>,
    schema?: Schema
  ) => {
    return _defineAPI<Payload, Result, Schema>(store,handle,schema)
  };
  return {
    defineAPI,
    middleware
  }
};
