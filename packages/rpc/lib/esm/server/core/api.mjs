// src/server/core/api.ts
import { nanoid } from "nanoid";
import { IDENTITY, NAME } from "./const.mjs";
var isAPI = (val) => {
  return val[IDENTITY] === "api";
};
var _defineAPI = (store, handle, idStore, name) => {
  const ID = Symbol.for(idStore.key);
  const genId = () => {
    const id2 = nanoid();
    if (!store.has(id2))
      return id2;
    return genId();
  };
  const id = genId();
  const christen = (name2) => {
    Reflect.set(handle, NAME, name2);
    Reflect.defineProperty(handle, NAME, {
      writable: false,
      value: name2,
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
      if (p === "update") {
        return (key, id2) => {
          if (key !== ID)
            return;
          Reflect.set(shadow, ID, id2);
          store.set(id2, shadow);
        };
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
      return target.call(t, ...args);
    }
  });
  if (name) {
    christen(name);
  }
  store.set(id, shadow);
  return shadow;
};
export {
  _defineAPI,
  isAPI
};
