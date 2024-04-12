// src/plugin/index.ts
import { createUnplugin } from "unplugin";
import { transform } from "./utils.mjs";
import { normalize, relative, resolve, sep } from "node:path";
var unplugin = createUnplugin((dirs) => ({
  name: "@tvvins/rpc",
  enforce: "pre",
  transformInclude: (id) => {
    const result = dirs.some((dir) => {
      const r = !normalize(relative(dir, id)).startsWith(`..${sep}`);
      return r;
    });
    return result;
  },
  async transform(code, id) {
    return await transform(code, id);
  }
}));
var vitePlugin = (dirs) => unplugin.vite(dirs);
var RPC = (dirs) => {
  return (config) => {
    const _dirs = typeof dirs === "string" ? [dirs] : dirs;
    const apiDir = _dirs.map((dir) => resolve(config.source, dir));
    return {
      vite: {
        plugins: [vitePlugin(apiDir)]
      }
    };
  };
};
export {
  RPC,
  vitePlugin
};
