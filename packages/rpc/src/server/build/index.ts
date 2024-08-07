import { createUnplugin } from "unplugin";
import { transform } from "./utils";
import { Plugin } from "vite";
import { normalize, relative, sep } from "node:path";

import { Store } from "../core/store";
export type RPCPluginOptions = {
  apiDir: string;
};
const unplugin = createUnplugin(
  (options: { dirs: string[]; idStore: Store }) => ({
    name: "@tvvins/rpc",
    enforce: "pre",
    transformInclude: (id: string) => {
      const { dirs } = options;
      const result = dirs.some((dir) => {
        const r = !normalize(relative(dir, id)).startsWith(`..${sep}`);
        return r;
      });
      return result;
    },
    async transform(code, id) {
      return await transform(code, id, options.idStore);
    },
  })
);
const idList: string[] = []
// export const vitePlugin = (dirs: string[], idStore: Store): Plugin =>
//   unplugin.vite({dirs, idStore}) as Plugin;
export const vitePlugin = (dirs: string[], idStore: Store): Plugin => ({
  name: "@tvvins/rpc",
  enforce: "pre",
  // transformInclude: (id: string) => {
  //   const { dirs } = options;
  //   const result = dirs.some((dir) => {
  //     const r = !normalize(relative(dir, id)).startsWith(`..${sep}`);
  //     return r;
  //   });
  //   return result;
  // },
  async transform(code, id) {
    const include = dirs.some((dir) => {
      const r = !normalize(relative(dir, id)).startsWith(`..${sep}`);
      return r;
    });
    // @todo 重复编译缓存化
    if (!include) return
    return await transform(code, id, idStore);
  },
})