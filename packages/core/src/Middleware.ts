import { KEY } from "./const";
import { ConnectHandle, ConnectMiddleware, Middleware, RequestHandle, TvvinsMiddleware } from "./type";


export const defineMiddleWare = <T extends boolean = false>(
  handle: T extends false?RequestHandle:ConnectHandle,
  name: string = handle.name,
  isConnect?: T
) => {
  const ref = Object.create(null) satisfies T extends false?TvvinsMiddleware:ConnectMiddleware;
  const key = Symbol();
  Reflect.set(ref, "name", name || "");
  Reflect.set(ref, "handle", handle);
  Reflect.set(ref, "isConnect", isConnect);
  Reflect.set(ref, KEY, key);
  Reflect.set(ref, "setName", (name: string) => {
    Reflect.set(ref, "name", name);
  });
  return ref as T extends false?TvvinsMiddleware:ConnectMiddleware;
};

export const defineConnectMiddleWare = (
  handle: ConnectHandle,
  name?: string
) => {
  return defineMiddleWare(handle,name,true);
};
