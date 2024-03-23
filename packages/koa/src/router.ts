import Router from "@koa/router"
export const router = new Router()
import type { API, ApiWithValidate } from "./api-core"
import { Stream } from "stream"
import type { Middleware} from "koa"
export type Context = Parameters<Middleware>[0]
const nameSpace = {
  api: "api",
  view: "view"
}
const routesMap = new Map<string, Map<string,
  (API<unknown, unknown, unknown>
    | ApiWithValidate<unknown, unknown, unknown>)>>

// api 路由注册
router.post(`/${nameSpace.api}`, async (ctx, next) => {
  // 假设是裁剪过的url
  const { url } = ctx;
  const [moduleName, apiName] = url.split("/")
  const mod = routesMap.get(moduleName);
  
  if (!mod) {
    return {
      // @todo 一个404错误
    }
  }
  const api = mod.get(apiName);
  if (!api) {
    return {
      // @todo 一个404错误
    }
  }
  // Reflect.defineProperty(api, CONTEXT, {
  //   value:ctx
  // })
  const result = await api.call(ctx,ctx.request.body, ctx.headers);
  if (typeof result === "string") {
    ctx.body = result
    next();
    return;
  }
  if (["number", "boolean", "bigint"].includes(typeof result)) {
    // 你不应该直接返回这些值
    return;
  }

  if (["function", "symbol"].includes(typeof result)) {
    // 有病啊，返回这些值
    return;
  }
  if (typeof result === "undefined") {
    // 原谅你，返回一个 undefined
    next()
    return;
  }
  if (result === null) {
    // 原谅你，返回一个 null
    next()
    return;
  }
  // 此时一定是一个 object 了
  if (result instanceof Stream) {
    // @todo 是一个流，让我像一个流一样的返回你
    result.pipe(ctx.res);
    next()
    // 是不是要单独写个流结束的逻辑
    return;
  }
  try {
    const j = JSON.stringify(result)
    ctx.body = j;
    next();
    return;
  } catch (e) {
    // 哎呀，不是个 json
  }



  // "multipart/form-data"
  // "application/octet-stream"
  // 
  // = await api(.,ctx.headers)
})


