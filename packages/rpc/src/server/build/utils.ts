
import { isAPI } from '../core/api'
import { pathToFileURL } from 'node:url'

const codeGen = (id: string, methods: Record<string,string>) => {
  let result = `
    import {rpc} from "@tvvins/rpc/client";
  `
  for(const [ key,name ] of Object.entries(methods)){
    result += `
      export const ${name} = async (payload)=>{
        return await rpc(payload,"${key}","/rpc")
      };
    `
  }
  return result
}
export const transform = async (code: string, id: string,idKey:string) => {
  const url = pathToFileURL(id)
  const ID = Symbol.for(idKey)
  const apiList = await import(url.toString());
  const result:Record<string,string> = {}
  for (const [k, API] of Object.entries(apiList)) {
    if (!isAPI(API)) continue;
    result[Reflect.get(API,ID) as string] = k
  }
  if (!Object.keys(result).length) return code;
  return codeGen(id, result)
}
