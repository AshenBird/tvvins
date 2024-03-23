/**
 * 用于在 vite 中转换为 客户端可用的实现
 */
import { pluginFac } from "./utils";
import { parse, } from 'node:path'
export const rpcPlugin = pluginFac(
  "@tvvins/rpc",
  (code: string, id: string, methodNames: string[]) => {
    let result = `
      import axios from "axios";
    `
    methodNames.forEach((methodName: string) => {
      result += `
      export const ${methodName} = (payload,headers)=>{
        return axios.request({
          method:"POST",
          url:"/${parse(id).name}/${methodName}",
          data:payload
        })
      };
    `
    })
    return result
  }
)

