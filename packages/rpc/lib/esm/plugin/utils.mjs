// src/plugin/utils.ts
import { isAPI } from "../server/core/api.mjs";
import { pathToFileURL } from "node:url";
import { ID } from "../server/core/const.mjs";
var codeGen = (code, id, methods) => {
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
var transform = async (code, id) => {
  const url = pathToFileURL(id);
  const apiList = await import(url.toString());
  const result = {};
  for (const [k, API] of Object.entries(apiList)) {
    if (!isAPI(API))
      continue;
    result[Reflect.get(API, ID)] = k;
  }
  if (!Object.keys(result).length)
    return code;
  return codeGen(code, id, result);
};
export {
  transform
};
