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
import { Logger } from "@mcswift/base-utils/logger";
import { NAME } from "./core/const.mjs";
import { Session } from "./core/session.mjs";
import { nanoid } from "nanoid";
var logger = new Logger("Tvvins.RPC");
var useRPC = (options = {}) => {
  const { base = "/rpc", dirs = "./api", middlewares = [] } = options;
  const idStore = new Store();
  const store = /* @__PURE__ */ new Map();
  const sessionStore = /* @__PURE__ */ new Map();
  const handle = async (ctx, next) => {
    const errorSymbol = Symbol();
    if (!ctx.request.url.startsWith(base)) {
      return next();
    }
    const isSessionRequest = () => ctx.request.url.startsWith(base + "/session");
    const id = ctx.$.req.headers["x-tvvins-rpc-id"];
    const sessionId = ctx.$.req.headers["x-tvvins-rpc-session-id"] || nanoid();
    if (isSessionRequest()) {
      ctx.$.res.setHeader("x-tvvins-rpc-session-id", sessionId);
      resHandle(ctx.$.res, {});
      return;
    }
    if (!id)
      return next();
    const h = store.get(id);
    if (!h)
      return next();
    logger.info("\u5904\u7406\u8BF7\u6C42:", id);
    const payload = await bodyParse(ctx.$.req);
    logger.info("\u63A5\u5230\u7684\u6570\u636E", payload);
    const data = payload.data;
    let session = sessionStore.get(sessionId);
    if (!session) {
      session = new Session(sessionId);
      sessionStore.set(sessionId, session);
    }
    const name = Reflect.get(h, NAME);
    if (name) {
      for (const middleware2 of middlewares) {
        try {
          const r = await middleware2(payload, session, name);
          if (typeof r === "boolean") {
            if (!r)
              return resHandle(ctx.$.res, r, true);
            continue;
          }
          if (r.code < 300)
            continue;
          if (r.code < 400) {
            return r;
          }
          if (r.code < 500) {
            return r;
          }
          return r;
        } catch (e) {
          return resHandle(ctx.$.res, {
            code: 500,
            message: e?.message || "middlewares Error",
            stacks: e?.stack?.split("/n") || []
          }, true);
        }
      }
    }
    const context = {
      session
    };
    const result = await h.apply(context, data).then((res) => {
      if (res)
        return res;
      return null;
    }).catch((e) => {
      logger.error(e);
      return {
        [errorSymbol]: true,
        code: 500,
        message: e?.message || "API Error",
        stacks: e?.stack?.split("/n") || []
      };
    });
    ctx.$.res.setHeader("x-tvvins-rpc-session-id", "sessionId");
    resHandle(ctx.$.res, result, result !== null && typeof result === "object" && Reflect.get(result, errorSymbol));
  };
  const middleware = defineMiddleWare(handle, "tvvins-rpc");
  const defineAPI = (handle2, name) => {
    return _defineAPI(store, handle2, idStore, name);
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
                    contents = contents + `;${name}.update(ID,'${id}')`;
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
    // useSession,
  };
};
export {
  BodyParserManager,
  useRPC
};
