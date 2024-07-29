// src/server/build/utils.ts
import { isAPI } from "../core/api.mjs";
import { pathToFileURL } from "node:url";
import { normalize } from "node:path";
var codeGen = (id, methods) => {
  let result = `
    import {rpc} from "@tvvins/rpc/client";
  `;
  for (const [key, name] of Object.entries(methods)) {
    result += `
      export const ${name} = async (payload)=>{
        return await rpc(payload,"${key}","/rpc")
      };
    `;
  }
  return result;
};
var transform = async (code, id, store) => {
  const url = pathToFileURL(id);
  const ID = Symbol.for(store.key);
  const apiList = await import(url.toString());
  const result = {};
  for (const [k, API] of Object.entries(apiList)) {
    if (!isAPI(API))
      continue;
    const i = Reflect.get(API, ID);
    result[i] = k;
    store.set(normalize(id), k, i);
  }
  if (!Object.keys(result).length)
    return { code, map: null };
  return {
    code: codeGen(id, result),
    map: null
  };
};
export {
  transform
};
