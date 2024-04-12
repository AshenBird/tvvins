import { Config, PluginConfigFn} from "@tvvins/core";
import { createUnplugin } from "unplugin";
import { transform } from "./utils";
import { Plugin } from "vite";
import { normalize, relative, resolve,sep } from "node:path";
export type RPCPluginOptions = {
  apiDir: string;
};
const unplugin = createUnplugin((dirs: string[]) => ({
  name: "@tvvins/rpc",
  enforce: "pre",
  transformInclude: (id: string) => {
    const result = dirs.some((dir) => {
      const r = !normalize(relative(dir,id)).startsWith(`..${sep}`)
      return r
    });
    return result
  },
  async transform(code,id){
    return await transform(code,id)
  },
}));

export const vitePlugin = (dirs: string[]): Plugin => unplugin.vite(dirs) as Plugin;
export const RPC = (dirs: string | string[]):PluginConfigFn => {
  return (config: Config) => {
    const _dirs = typeof dirs === "string" ? [dirs] : dirs;
    const apiDir = _dirs.map((dir) => resolve(config.source, dir));
    return {
      vite: {
        plugins: [vitePlugin(apiDir)],
      },
    };
  };
};
