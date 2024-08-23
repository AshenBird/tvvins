/**
 * 用于在服务端定义 api
 */
import { nanoid } from "nanoid";
import { type ZodType } from "zod";
import type { z } from "zod";
import { IDENTITY, NAME } from "./const";
import { API, ApiHandle, IDStore } from "../type";
import { Store } from "./store";
export const isAPI = <T = unknown, Q = unknown>(
  val: unknown
): val is API<T,Q> => {
  return (val as API<T, Q>)[IDENTITY] === "api";
};



export const _defineAPI = <
  Payload,
  Result,
  // Schema extends ZodType
>(
  store:Map<string,API>,
  handle: ApiHandle<Payload, Result>,
  idStore:Store,
  name?:string
  // schema?: Schema
) => {
  const ID = Symbol.for(idStore.key);
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
  Reflect.set(handle,ID,id)
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === IDENTITY) {
        return "api";
      }
      if (p === ID) {
        return Reflect.get(handle,ID)
      }
      if(p==="christen"){
        return christen
      }
      if(p==="name"){
        return Reflect.get(handle,NAME)||id
      }
      if(p==="update"){
        return (key:Symbol,id:string)=>{
          if(key!==ID)return
          Reflect.set(shadow,ID,id)
          store.set(id,shadow)
        }
      }
      // @ts-ignore
      return target[p];
    },
    set(target,p,nv){
      if(p===ID){
        Reflect.set(handle,ID,nv)
        return true
      }
      return false
    },
    apply: async (target, t, args) => {
      return target.call(t, args[0]);
    },
  })  as API<Payload, Result>
  if(name){
    christen(name)
  }
  // @ts-ignore
  store.set(id,shadow)
  return shadow
};
