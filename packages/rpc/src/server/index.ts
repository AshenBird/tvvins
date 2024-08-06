import { type Tvvins, defineMiddleWare } from "@tvvins/core";
import { API, ApiHandle, RPCOptions } from "./type";
import { bodyParse } from "./core/body-parse";
import { resHandle } from "./core/response";
import { _defineAPI } from "./core/api";
import { join, normalize, relative, resolve, sep } from "node:path";
import { vitePlugin } from "./build";
import { readFileSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { Store } from "./core/store";
export { BodyParserManager } from "./core/body-parse";
import { Logger } from "@mcswift/base-utils/logger"
export const useRPC = (options: Partial<RPCOptions> = {}) => {
  const logger = new Logger("Tvvins.RPC") 
  const { base = "/rpc", dirs = "./api" } = options;
  // key store 
  const idStore = new Store()
  // api store
  const store = new Map<string, API>();
  const handle = async (ctx: Tvvins.Context, next: () => unknown) => {
    if (!ctx.request.url.startsWith(base)) {
      return;
    }
    logger.debug("匹配 RPC 路由:",ctx.request.url)
    const id = ctx.$.req.headers["x-tvvins-rpc-id"];
    if (!id) return;
    logger.debug("获取 RPC-ID:",id)
    const h = store.get(id as string);
    if (!h) return ;
    logger.debug("找到处理函数")
    const payload = await bodyParse(ctx.$.req);
    // 用户处理逻辑
    const result = await h(payload.data);
    resHandle(ctx.$.res, result);
  };
  const middleware = defineMiddleWare(handle, "tvvins-rpc");
  const defineAPI = <Payload, Result>(
    handle: ApiHandle<Payload, Result>,
  ) => {
    return _defineAPI<Payload, Result>(store, handle, idStore);
  };
  const plugin: Tvvins.Plugin = (appOptions) => {
    const _dirs = typeof dirs === "string" ? [dirs] : dirs;
    const apiDir = _dirs.map((dir) => resolve(appOptions.build.source, dir));
    const result: Tvvins.PluginObj = {
      name: "@tvvins/rpc",
      middlewares: [middleware],
      build: {
        plugins: [
          {
            name: "tvvins-rpc-server-prebuild",
            setup(builder) {
              builder.onLoad({ filter: /[.\\n]*/ }, async (args) => {
                let contents = readFileSync(args.path, { encoding: "utf-8" });
                // const apiDir = resolve(appOptions.build.source, "./apis");
                let path = args.path;
                const stat = statSync(path);
                if (!stat.isFile()) {
                  path = join(path, "index.ts");
                }
                const isInclude = apiDir.some((d) => !normalize(relative(d, path)).startsWith(
                  `..${sep}`
                ));
                if (isInclude) {
                  contents = contents + `;const ID = Symbol.for('${idStore.key}');`
                  const mod = await import(pathToFileURL(path).toString())
                  for (const name of Object.keys(mod)) {
                    const id = idStore.get(normalize(path), name);
                    contents = contents + `;${name}.update(ID,'${id}')`;
                  }
                }
                return {
                  contents,
                  loader: "ts",
                };
              });
              // builder.onEnd(()=>{
              //   writeFileSync(join(outdir,"idStore.js"),`
              //     export const isStore = ${JSON.stringify(idStore)};
              //   `.trim())
              // })
            },
          },
        ],
      },
      vite: {
        plugins: [
          // @ts-ignore
          vitePlugin(apiDir, idStore)
        ]
      }
    };
    return result
  }
  return {
    plugin,
    defineAPI,
  };
};
