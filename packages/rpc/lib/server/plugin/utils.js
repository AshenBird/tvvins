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
import { relative } from "node:path";
import { isAPI } from "../core/api";
import { createUnplugin } from "unplugin";
const pluginFac = (name, codeGen) => {
  const transform = (code, id) => __async(void 0, null, function* () {
    const path = relative(__dirname, id);
    const apiList = yield import(path);
    const result = [];
    for (const [k, API] of Object.entries(apiList)) {
      if (!isAPI(API))
        continue;
      result.push(k);
    }
    if (!result.length)
      return code;
    return codeGen(code, id, result);
  });
  return createUnplugin(() => ({
    name,
    enforce: "pre",
    transformInclude: (id) => {
      return id.includes("apis");
    },
    transform: (code, id) => __async(void 0, null, function* () {
      return transform(code, id);
    })
  }));
};
export {
  pluginFac
};
