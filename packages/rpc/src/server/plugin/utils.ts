import { relative, resolve } from 'node:path'
import { isAPI } from '../core/api'
import { createUnplugin } from 'unplugin'
import { fileURLToPath, pathToFileURL } from 'node:url'
export const pluginFac = (
  name:string,
  codeGen: (code: string, id: string, methodNames: string[]) => string,
) => {
  const transform = async (code: string, id: string) => {
    const dirname = resolve(fileURLToPath(import.meta.url),"../")
    const url = pathToFileURL(id)//relative(dirname, id)
    console.debug(url.toString())
    const apiList = await import(url.toString());
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
