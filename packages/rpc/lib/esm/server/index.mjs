// src/server/index.ts
import { defineMiddleWare } from "@tvvins/core";
import { bodyParse } from "./core/body-parse.mjs";
import { resHandle } from "./core/response.mjs";
import { _defineAPI } from "./core/api.mjs";
import { join, normalize, relative, resolve, sep } from "node:path";
import { vitePlugin } from "./build/index.mjs";
import { readFileSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { Store } from "./core/store.mjs";
import { BodyParserManager } from "./core/body-parse.mjs";
var useRPC = (options = {}) => {
  const { base = "/rpc", dirs = "./api" } = options;
  const idStore = new Store();
  const store = /* @__PURE__ */ new Map();
  const handle = async (ctx, next) => {
    if (!ctx.request.url.startsWith(base)) {
      return next();
    }
    const id = ctx.$.req.headers["x-tvvins-rpc-id"];
    if (!id)
      return next();
    const h = store.get(id);
    if (!h)
      return next();
    const payload = await bodyParse(ctx.$.req);
    const result = await h(payload.data);
    resHandle(ctx.$.res, result);
  };
  const middleware = defineMiddleWare(handle, "tvvins-rpc");
  const defineAPI = (handle2) => {
    return _defineAPI(store, handle2, idStore);
  };
  const plugin = (appOptions) => {
    const _dirs = typeof dirs === "string" ? [dirs] : dirs;
    const apiDir = _dirs.map((dir) => resolve(appOptions.build.source, dir));
    const result = {
      name: "@tvvins/rpc",
      middlewares: [middleware],
      build: {
        plugins: [
          {
            name: "tvvins-rpc-server-prebuild",
            setup(builder) {
              builder.onLoad({ filter: /[.\\n]*/ }, async (args) => {
                let contents = readFileSync(args.path, { encoding: "utf-8" });
                let path = args.path;
                const stat = statSync(path);
                if (!stat.isFile()) {
                  path = join(path, "index.ts");
                }
                const isInclude = apiDir.some((d) => !normalize(relative(d, path)).startsWith(
                  `..${sep}`
                ));
                if (isInclude) {
                  contents = contents + `;const ID = Symbol.for('${idStore.key}');`;
                  const mod = await import(pathToFileURL(path).toString());
                  for (const name of Object.keys(mod)) {
                    const id = idStore.get(normalize(path), name);
                    contents = contents + `Reflect.set(${name},ID,'${id}')`;
                  }
                }
                return {
                  contents,
                  loader: "ts"
                };
              });
            }
          }
        ]
      },
      vite: {
        plugins: [
          // @ts-ignore
          vitePlugin(apiDir, idStore)
        ]
      }
    };
    return result;
  };
  return {
    plugin,
    defineAPI
  };
};
export {
  BodyParserManager,
  useRPC
};
