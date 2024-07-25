// src/server/build/index.ts
import { createUnplugin } from "unplugin";
import { transform } from "./utils.mjs";
import { normalize, relative, sep } from "node:path";
var unplugin = createUnplugin(
  (options) => ({
    name: "@tvvins/rpc",
    enforce: "pre",
    transformInclude: (id) => {
      const { dirs } = options;
      const result = dirs.some((dir) => {
        const r = !normalize(relative(dir, id)).startsWith(`..${sep}`);
        return r;
      });
      return result;
    },
    async transform(code, id) {
      return await transform(code, id, options.idStore.key);
    }
  })
);
var vitePlugin = (dirs, idStore) => ({
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
    return await transform(code, id, idStore.key);
  }
});
export {
  vitePlugin
};
