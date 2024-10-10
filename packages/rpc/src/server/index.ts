import { type Tvvins, defineMiddleWare } from "@tvvins/core";
import { API, APIContext, ApiHandle, RPCMiddleware, RPCOptions } from "./type";
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
import { NAME, SESSION, SESSION_GETTER } from "./core/const";
import { Session } from "./core/session";
import { nanoid } from "nanoid";
const logger = new Logger("Tvvins.RPC")
// class RPC {
//   private idStore = new Store()
//   private store = new Map<string, API>();
//   private sessionStore = new Map<string, Session>()
//   private base:string
//   private dirs: string | string[];
//   private middlewares: RPCMiddleware[]
//   private middleware:Tvvins.Middleware
//   constructor(options: Partial<RPCOptions> = {}){
//     const { base = "/rpc", dirs = "./api", middlewares = [] } = options;
//     this.base = base,
//     this.dirs = dirs
//     this.middlewares = middlewares
//     this.middleware = defineMiddleWare(this.handle.bind(this), "tvvins-rpc");
//   }
//   async handle(ctx: Tvvins.Context, next: () => unknown){
//     if (!ctx.request.url.startsWith(this.base)) {
//       return next();
//     }
//     const isSessionRequest = () => ctx.request.url.startsWith(this.base + "/session")
//     const id = ctx.$.req.headers["x-tvvins-rpc-id"];
//     const sessionId = (ctx.$.req.headers["x-tvvins-rpc-session-id"] as string) || nanoid();
//     if (isSessionRequest()) {
//       ctx.$.res.setHeader("x-tvvins-rpc-session-id", sessionId);
//       resHandle(ctx.$.res, {});
//       return
//     }
//     if (!id) return next();
//     const h = this.store.get(id as string);
//     if (!h) return next();
//     logger.info("处理请求:", id)
//     const payload = await bodyParse(ctx.$.req);
//     const data = payload.data||{}
//     /*--- session  ---*/
//     let session = this.sessionStore.get(sessionId)
//     if (!session) {
//       session = new Session(sessionId)
//       this.sessionStore.set(sessionId, session)
//     }
//     // Reflect.set(data, SESSION, session)
//     const name = Reflect.get(h, NAME)
//     if (name) {
//       for (const middleware of this.middlewares) {
//         try {
//           const r = await middleware(payload, session, name)
//           if (typeof r === "boolean") {
//             if (!r) return resHandle(ctx.$.res, r,true);
//             continue;
//           }
//           if (r.code < 300) continue
//           if (r.code < 400) {
//             //@todo 重定向逻辑
//             return r
//           }
//           if (r.code < 500) {
//             //@todo 重定向逻辑
//             return r
//           }
//           // 服务端错误
//           return r
//         } catch (e) {
//           return resHandle(ctx.$.res,{
//             code: 500,
//             message: (e as Error)?.message || "middlewares Error",
//             stacks: (e as Error)?.stack?.split("/n")||[]
//           },true)
//         }
//       }
//     }
//     // 用户处理逻辑
//     const result = await h.apply(session,data).catch(e => {
//       logger.error(e)
//       return {
//         code: 500,
//         message: e?.message || "API Error",
//         stacks: (e as Error)?.stack?.split("/n")||[]
//       }
//     });
//     ctx.$.res.setHeader("x-tvvins-rpc-session-id", "sessionId");
//     resHandle(ctx.$.res, result,true);
//   }
//   defineAPI<Payload, Result>(
//     handle: ApiHandle<Payload, Result>,
//     name?: string
//   ){
//     return _defineAPI<Payload, Result>(this.store, handle, this.idStore, name);
//   };
//   getSession  (payload: any)  {
//     const r = Reflect.get(payload, SESSION)
//     return r
//   }
//   plugin: Tvvins.Plugin =(appOptions) => {
//     const dirs = this.dirs
//     const middleware = this.middleware
//     const idStore = this.idStore
//     const _dirs = typeof dirs === "string" ? [dirs] : dirs;
//     const apiDir = _dirs.map((dir) => resolve(appOptions.build.source, dir));
//     const result: Tvvins.PluginObj = {
//       name: "@tvvins/rpc",
//       middlewares: [middleware],
//       build: {
//         plugins: [
//           {
//             name: "tvvins-rpc-server-prebuild",
//             setup(builder) {
//               builder.onLoad({ filter: /[.\\n]*/ }, async (args) => {
//                 let contents = readFileSync(args.path, { encoding: "utf-8" });
//                 // const apiDir = resolve(appOptions.build.source, "./apis");
//                 let path = args.path;
//                 const stat = statSync(path);
//                 if (!stat.isFile()) {
//                   path = join(path, "index.ts");
//                 }
//                 const isInclude = apiDir.some((d) => !normalize(relative(d, path)).startsWith(
//                   `..${sep}`
//                 ));
//                 if (isInclude) {
//                   contents = contents + `;const ID = Symbol.for('${idStore.key}');`
//                   const mod = await import(pathToFileURL(path).toString())
//                   for (const name of Object.keys(mod)) {
//                     const id = idStore.get(normalize(path), name);
//                     contents = contents + `;${name}.update(ID,'${id}')`;
//                   }
//                 }
//                 return {
//                   contents,
//                   loader: "ts",
//                 };
//               });
//             },
//           },
//         ],
//       },
//       vite: {
//         plugins: [
//           // @ts-ignore
//           vitePlugin(apiDir, idStore)
//         ]
//       }
//     };
//     return result
//   }
// }

export const useRPC = (options: Partial<RPCOptions> = {}) => {
  // const logger = new Logger("Tvvins.RPC")
  const { base = "/rpc", dirs = "./api", middlewares = [] } = options;
  // key store 
  const idStore = new Store()
  // api store
  const store = new Map<string, API>();
  const sessionStore = new Map<string, Session>()
  const handle = async (ctx: Tvvins.Context, next: () => unknown) => {
    const errorSymbol = Symbol()
    if (!ctx.request.url.startsWith(base)) {
      return next();
    }
    const isSessionRequest = () => ctx.request.url.startsWith(base + "/session")
    const id = ctx.$.req.headers["x-tvvins-rpc-id"];
    const sessionId = (ctx.$.req.headers["x-tvvins-rpc-session-id"] as string) || nanoid();
    if (isSessionRequest()) {
      ctx.$.res.setHeader("x-tvvins-rpc-session-id", sessionId);
      resHandle(ctx.$.res, {});
      return
    }
    if (!id) return next();
    const h = store.get(id as string);
    if (!h) return next();
    logger.info("处理请求:", id)
    const payload = await bodyParse(ctx.$.req);
    logger.info("接到的数据", payload)
    const data = payload.data
    /*--- session  ---*/
    let session = sessionStore.get(sessionId)
    if (!session) {
      session = new Session(sessionId)
      sessionStore.set(sessionId, session)
    }
    // Reflect.set(data, SESSION, session)
    const name = Reflect.get(h, NAME)
    if (name) {
      for (const middleware of middlewares) {
        try {
          const r = await middleware(payload, session, name)
          if (typeof r === "boolean") {
            if (!r) return resHandle(ctx.$.res, r, true);
            continue;
          }
          if (r.code < 300) continue
          if (r.code < 400) {
            //@todo 重定向逻辑
            return r
          }
          if (r.code < 500) {
            //@todo 重定向逻辑
            return r
          }
          // 服务端错误
          return r
        } catch (e) {
          return resHandle(ctx.$.res, {
            code: 500,
            message: (e as Error)?.message || "middlewares Error",
            stacks: (e as Error)?.stack?.split("/n") || []
          }, true)
        }
      }
    }
    const context = {
      session
    }

    // 用户处理逻辑
    const result = await h.apply(context, data).then((res) => {
      if (res) return res
      return null
    }).catch(e => {
      logger.error(e)
      return {
        [errorSymbol]:true,
        code: 500,
        message: e?.message || "API Error",
        stacks: (e as Error)?.stack?.split("/n") || []
      }
    });
    ctx.$.res.setHeader("x-tvvins-rpc-session-id", "sessionId");
    // !!result && !!result.code && result.code >= 400
    resHandle(ctx.$.res, result, result!==null&&typeof result==="object"&&Reflect.get(result,errorSymbol));
  };
  const middleware = defineMiddleWare(handle, "tvvins-rpc");
  const defineAPI = <Result, Handle extends (this: APIContext, ...args: any[]) => Result>(
    handle: Handle,//ApiHandle<Payload, Result>,
    name?: string
  ) => {
    return _defineAPI(store, handle, idStore, name);
  };
  const plugin: Tvvins.Plugin<{
    API?: Record<string, API>
  }> = (appOptions) => {
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
      },
    };
    return result
  }

  return {
    plugin,
    defineAPI,
    // useSession,
  };
};
