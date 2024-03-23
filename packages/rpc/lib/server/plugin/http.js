import { pluginFac } from "./utils";
import { parse } from "node:path";
const rpcPlugin = pluginFac(
  "@tvvins/rpc",
  (code, id, methodNames) => {
    let result = `
      import axios from "axios";
    `;
    methodNames.forEach((methodName) => {
      result += `
      export const ${methodName} = (payload,headers)=>{
        return axios.request({
          method:"POST",
          url:"/${parse(id).name}/${methodName}",
          data:payload
        })
      };
    `;
    });
    return result;
  }
);
export {
  rpcPlugin
};
