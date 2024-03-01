var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { nanoid } from "nanoid";
import { ID, IDENTITY } from "@tvvins/core";
const zod2ValidateResult = () => {
};
const isAPI = (val) => {
  return val[IDENTITY] === "api";
};
const defineAPI = (handle, schema) => {
  const middlewareStore = /* @__PURE__ */ new Set();
  const id = nanoid();
  const shadow = new Proxy(handle, {
    get(target, p) {
      if (p === IDENTITY) {
        return "api";
      }
      if (p === ID) {
        return id;
      }
      return target[p];
    },
    apply: (target, t, args) => __async(void 0, null, function* () {
      return target.call(t, args[0], args[1]);
    })
  });
  return shadow;
};
export {
  defineAPI,
  isAPI,
  zod2ValidateResult
};
