
import { TransformResult } from 'vite'
import { isAPI } from '../core/api'
import { pathToFileURL } from 'node:url'
import { Store } from '../core/store'
import { normalize } from 'node:path'

const codeGen = (id: string, methods: Record<string,string>) => {
  let result = `
    import {rpc} from "@tvvins/rpc/client";
  `
  for(const [ key,name ] of Object.entries(methods)){
    result += `
      export const ${name} = async (...payload)=>{
        return await rpc(payload,"${key}","/rpc")
      };
    `
  }
  return result
}
export const transform = async (code: string, id: string,store:Store):Promise<TransformResult> => {
  const url = pathToFileURL(id)
  const ID = Symbol.for(store.key)
  const apiList = await import(url.toString());
  const result:Record<string,string> = {}
  for (const [k, API] of Object.entries(apiList)) {
    if (!isAPI(API)) continue;
    const i = Reflect.get(API,ID)
    result[i as string] = k
    store.set(normalize(id),k,i)
  }
  if (!Object.keys(result).length) return {code,map:null};
  return {
    code:codeGen(id, result),
    map:null
  }
}
