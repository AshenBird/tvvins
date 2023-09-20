/**
 * 用于在服务端定义 api
 */

import { nanoid } from "nanoid"
import type { ZodType } from "zod"
import type { z } from "zod"
import {ID,IDENTITY} from "@tvvins/core/dev/constant"
export interface ApiHandle<Payload, Result, _Headers, Context = unknown> {
  (this: Context, payload?: Payload, headers?: _Headers): Promise<Result> | Result
}

export interface API<Payload, Result, _Headers> extends ApiHandle<Payload, Result, _Headers> {
  [ID]: string
  [IDENTITY]: "api"
  // use: (middleware: Middleware<Payload, _Headers>) => void
}
export interface ApiWithValidate<Payload, Result, _Headers,Context = unknown> {
  (this: Context, payload: Payload, headers?: _Headers): Promise<Result> | Result
  [ID]: string
  [IDENTITY]: "api"

  // use: (middleware: Middleware<Payload, _Headers>) => void
}

interface Middleware<Payload, _Headers> {
  (payload: Payload, headers: _Headers): Promise<boolean> | boolean
}

export const zod2ValidateResult = () => {

}


interface ValidateResult {
  success: boolean
  info?: {
    "expected": string,
    "received": string,
    "path": string[],
    "message": string
  }
}
interface Validator {
  (val: unknown): ValidateResult
}


export const isAPI = <T = unknown, S = unknown, Q = unknown>(val: unknown): val is API<T, S, Q> => {
  return (val as API<T, S, Q>)[IDENTITY] === "api"
}

export const defineAPI = <Payload, Result, _Headers, Schema extends ZodType,Context=unknown>(
  handle: ApiHandle<Payload, Result, _Headers>,
  schema?: Schema
) => {
  const middlewareStore = new Set<Middleware<Payload, _Headers>>();
  const id = nanoid();
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === IDENTITY) {
        return "api"
      }
      if (p === ID) {
        return id;
      }
      // if (p === "use") {
      //   return (middleware: Middleware<Payload, _Headers>) => {
      //     middlewareStore.add(middleware)
      //     return () => {
      //       middlewareStore.delete(middleware)
      //     }
      //   }
      // }
      // @ts-ignore
      return target[p]
    },
    apply: async (target, t:Context, args) => {
      // for(const middleware  of middlewareStore){
      //   const mr = middleware(args[0],args[1])
      //   if(!mr){
      //     return {
      //       // error info
      //     }
      //   }
      // }
      // 应该在公共方法里去定义返回方式，要考虑是流式返回还是什么，重要的是如何判断返回的东西
      return target.call(t,args[0], args[1])
    }
  })

  return shadow as (
    Schema extends undefined
    ? API<Payload, Result, _Headers>
    : ApiWithValidate<z.infer<Schema>, Result, _Headers>
  )
}