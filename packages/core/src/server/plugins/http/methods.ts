import { createResult, createError } from "../../common";
import { type Request, type Response } from "express"
import type { APIFunc } from "../../types";
import { ROUTER_KEY } from "./const";
import type { HttpMethodName, TvvinsHttpServer } from "./type";
const requestDecoratorHigherOrderFac = (method: HttpMethodName) => {
  return (url: string) => {
    return (value: APIFunc, context: DecoratorContext) => {
      if (context.kind !== 'method') {
        throw new Error('只能用于属性')
      }
      const request = async function (this: TvvinsHttpServer, req: Request, resp: Response) {
        const payload = req.method.toLowerCase() === "get" ? req.query : req.body
        try {
          const result = await value.call(this, payload);
          resp.json(createResult(result))
        } catch (err: any) {
          console.error(err)
          resp.json(createError(err?.message || "未知错误", 500))
        }
        return;
      };

      context.addInitializer(function () {
        const instance = this as TvvinsHttpServer
        // const baseUrl = instance[BASE_URL_KEY]
        const router = instance[ROUTER_KEY]
        router[method.toLowerCase() as Lowercase<HttpMethodName>](url, request.bind(instance))
      })
      return value
    }
  }
}
export const Get = requestDecoratorHigherOrderFac("Get")
export const Post = requestDecoratorHigherOrderFac("Post")
export const Put = requestDecoratorHigherOrderFac("Put")
export const Delete = requestDecoratorHigherOrderFac("Delete")
export const Connect = requestDecoratorHigherOrderFac("Connect")
export const Options = requestDecoratorHigherOrderFac("Options")
export const Trace = requestDecoratorHigherOrderFac("Trace")
export const Patch = requestDecoratorHigherOrderFac("Patch")
export const Head = requestDecoratorHigherOrderFac("Head")

export default {
  Get,
  Post,
  Put,
  Delete,
  Connect,
  Options,
  Trace,
  Patch,
  Head,
} as const