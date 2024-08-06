// src/Middleware.ts
import { KEY } from "./const.mjs";
import { Context } from "./Context.mjs";
var defineMiddleWare = (handle, name = handle.name, isConnect) => {
  const ref = /* @__PURE__ */ Object.create(null);
  const key = Symbol();
  Reflect.set(ref, "name", name || "");
  Reflect.set(ref, "handle", handle);
  Reflect.set(ref, "isConnect", !!isConnect);
  Reflect.set(ref, KEY, key);
  Reflect.set(ref, "setName", (name2) => {
    Reflect.set(ref, "name", name2);
  });
  return ref;
};
var defineConnectMiddleWare = (handle, name) => {
  return defineMiddleWare(handle, name, true);
};
var transformConnectToTvvins = (raw) => {
  return async (ctx, next) => {
    const { req, res } = ctx.$;
    await raw(req, res, next);
  };
};
var connectMiddlewareWrap = (handle, app) => {
  return (req, res, next) => {
    const ctx = new Context(req, res, app);
    return handle(ctx, () => next());
  };
};
export {
  connectMiddlewareWrap,
  defineConnectMiddleWare,
  defineMiddleWare,
  transformConnectToTvvins
};
