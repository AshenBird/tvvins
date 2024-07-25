// src/server/build/utils.ts
import { isAPI } from "../core/api.mjs";
import { pathToFileURL } from "node:url";
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
var transform = async (code, id, idKey) => {
  const url = pathToFileURL(id);
  const ID = Symbol.for(idKey);
  const apiList = await import(url.toString());
  const result = {};
  for (const [k, API] of Object.entries(apiList)) {
    if (!isAPI(API))
      continue;
    result[Reflect.get(API, ID)] = k;
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
