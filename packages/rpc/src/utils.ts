import { relative } from 'node:path'
import { isAPI } from './api'
import { createUnplugin } from 'unplugin'
export const pluginFac = (
  name:string,
  codeGen: (code: string, id: string, methodNames: string[]) => string,
) => {
  const transform = async (code: string, id: string) => {
    const path = relative(__dirname, id)
    const apiList = await import(path);
    const result = []
    for (const [k, API] of Object.entries(apiList)) {
      if (!isAPI(API)) continue;
      result.push(k)
    }
    // apiMap.set(id,result);
    if (!result.length) return code;
    return codeGen(code, id, result)
  }
  return createUnplugin(() => ({
    name,
    enforce: "pre",
    transformInclude: (id: string) => {
      // @todo
      return id.includes("apis")
    },
    transform: async (code, id) => {
      return transform(code, id)
    }
  }))
}
