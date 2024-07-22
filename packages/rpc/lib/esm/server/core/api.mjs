// src/server/core/api.ts
import { nanoid } from "nanoid";
import { IDENTITY, NAME } from "./const.mjs";
var isAPI = (val) => {
  return val[IDENTITY] === "api";
};
var _defineAPI = (store, handle, idStore) => {
  const ID = Symbol.for(idStore.key);
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
  Reflect.set(handle, ID, id);
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === IDENTITY) {
        return "api";
      }
      if (p === ID) {
        return Reflect.get(handle, ID);
      }
      if (p === "christen") {
        return christen;
      }
      if (p === "name") {
        return Reflect.get(handle, NAME) || id;
      }
      return target[p];
    },
    set(target, p, nv) {
      if (p === ID) {
        Reflect.set(handle, ID, nv);
        return true;
      }
      return false;
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
