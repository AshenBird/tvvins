import { KEY } from "./const";
import type { Tvvins } from "./type";
import type { NextHandleFunction, Server as ConnectServer, SimpleHandleFunction } from "connect";
import { Context } from "./Context";
import type { IncomingMessage, ServerResponse } from "node:http";


export const defineMiddleWare = <T extends boolean = false>(
  handle: T extends false ? Tvvins.RequestHandle : Tvvins.ConnectHandle,
  name: string = handle.name,
  isConnect?: T
) => {
  const ref = Object.create(null) satisfies T extends false
    ? Tvvins.TvvinsMiddleware
    : Tvvins.ConnectMiddleware;
  const key = Symbol();
  Reflect.set(ref, "name", name || "");
  Reflect.set(ref, "handle", handle);
  Reflect.set(ref, "isConnect", isConnect);
  Reflect.set(ref, KEY, key);
  Reflect.set(ref, "setName", (name: string) => {
    Reflect.set(ref, "name", name);
  });
  return ref as T extends false
    ? Tvvins.TvvinsMiddleware
    : Tvvins.ConnectMiddleware;
};

export const defineConnectMiddleWare = (
  handle: Tvvins.ConnectHandle,
  name?: string
) => {
  return defineMiddleWare(handle, name, true);
};
export const transformConnectToTvvins = (raw:ConnectServer|SimpleHandleFunction|NextHandleFunction)=>{
  return async (ctx:Context,next:()=>Promise<unknown>)=>{
    const { req,res } = ctx.$
    await raw(req,res,next)
  }
}

export const connectMiddlewareWrap = (handle:Tvvins.RequestHandle,app:Tvvins.App):ConnectServer|SimpleHandleFunction|NextHandleFunction=>{
  return (req:IncomingMessage,res:ServerResponse,next:Function)=>{
    const ctx = new Context(req,res,app)
    return handle(ctx,()=>next())
  }
}
