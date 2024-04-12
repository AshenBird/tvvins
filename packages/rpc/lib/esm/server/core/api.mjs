// src/server/core/api.ts
import { nanoid } from "nanoid";
import { ID, IDENTITY, NAME } from "./const.mjs";
var isAPI = (val) => {
  return val[IDENTITY] === "api";
};
var _defineAPI = (store, handle, schema) => {
  console.debug(new Error().stack);
  const genId = () => {
    const id2 = nanoid();
    if (!store.has(id2))
      return id2;
    return genId();
  };
  const id = genId();
  const christen = (name) => {
    Reflect.set(handle, NAME, name);
    Reflect.defineProperty(handle, NAME, {
      writable: false,
      value: name,
      enumerable: false,
      configurable: false
    });
    return shadow;
  };
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === IDENTITY) {
        return "api";
      }
      if (p === ID) {
        return id;
      }
      if (p === "christen") {
        return christen;
      }
      if (p === "name") {
        return Reflect.get(handle, NAME) || id;
      }
      return target[p];
    },
    apply: async (target, t, args) => {
      return target.call(t, args[0]);
    }
  });
  store.set(id, shadow);
  return shadow;
};
export {
  _defineAPI,
  isAPI
};
