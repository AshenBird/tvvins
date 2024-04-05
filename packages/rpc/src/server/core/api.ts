/**
 * 用于在服务端定义 api
 */
import { nanoid } from "nanoid";
import { type ZodType } from "zod";
import type { z } from "zod";
import { ID, IDENTITY, NAME } from "./const";
import { API, ApiHandle } from "../type";
export const isAPI = <T = unknown, Q = unknown>(
  val: unknown
): val is API<T,Q> => {
  return (val as API<T, Q>)[IDENTITY] === "api";
};



export const _defineAPI = <
  Payload,
  Result,
  Schema extends ZodType
>(
  store:Map<string,API>,
  handle: ApiHandle<Payload, Result>,
  schema?: Schema
) => {
  const genId = ():string=>{
    const id = nanoid()
    // 防碰撞
    if(!store.has(id))return id
    return genId();
  }
  const id = genId();
  
  const christen = (name:string)=>{
    Reflect.set(handle,NAME,name)
    Reflect.defineProperty(handle,NAME,{
      writable:false,
      value:name,
      enumerable:false,
      configurable:false,
    })
    return shadow  
  }
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === IDENTITY) {
        return "api";
      }
      if (p === ID) {
        return id;
      }
      if(p==="christen"){
        return christen
      }
      if(p==="name"){
        return Reflect.get(handle,NAME)||id
      }
      // @ts-ignore
      return target[p];
    },
    apply: async (target, t, args) => {
      // 应该在公共方法里去定义返回方式，要考虑是流式返回还是什么，重要的是如何判断返回的东西
      return target.call(t, args[0]);
    },
  })  as API<Payload, Result>
  // @ts-ignore
  store.set(id,shadow)
  return shadow
};
