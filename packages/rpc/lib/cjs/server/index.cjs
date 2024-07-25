"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/index.ts
var server_exports = {};
__export(server_exports, {
  BodyParserManager: () => import_body_parse2.BodyParserManager,
  useRPC: () => useRPC
});
module.exports = __toCommonJS(server_exports);
var import_core = require("@tvvins/core");
var import_body_parse = require("./core/body-parse.cjs");
var import_response = require("./core/response.cjs");
var import_api = require("./core/api.cjs");
var import_node_path = require("node:path");
var import_build = require("./build/index.cjs");
var import_node_fs = require("node:fs");
var import_node_url = require("node:url");
var import_store = require("./core/store.cjs");
var import_body_parse2 = require("./core/body-parse.cjs");
var useRPC = (options = {}) => {
  const { base = "/rpc", dirs = "./api" } = options;
  const idStore = new import_store.Store();
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
    const payload = await (0, import_body_parse.bodyParse)(ctx.$.req);
    const result = await h(payload.data);
    (0, import_response.resHandle)(ctx.$.res, result);
  };
  const middleware = (0, import_core.defineMiddleWare)(handle, "tvvins-rpc");
  const defineAPI = (handle2) => {
    return (0, import_api._defineAPI)(store, handle2, idStore);
  };
  const plugin = (appOptions) => {
    const _dirs = typeof dirs === "string" ? [dirs] : dirs;
    const apiDir = _dirs.map((dir) => (0, import_node_path.resolve)(appOptions.build.source, dir));
    const result = {
      name: "@tvvins/rpc",
      middlewares: [middleware],
      build: {
        plugins: [
          {
            name: "tvvins-rpc-server-prebuild",
            setup(builder) {
              builder.onLoad({ filter: /[.\\n]*/ }, async (args) => {
                let contents = (0, import_node_fs.readFileSync)(args.path, { encoding: "utf-8" });
                let path = args.path;
                const stat = (0, import_node_fs.statSync)(path);
                if (!stat.isFile()) {
                  path = (0, import_node_path.join)(path, "index.ts");
                }
                const isInclude = apiDir.some((d) => !(0, import_node_path.normalize)((0, import_node_path.relative)(d, path)).startsWith(
                  `..${import_node_path.sep}`
                ));
                if (isInclude) {
                  contents = contents + `;const ID = Symbol.for('${idStore.key}');`;
                  const mod = await import((0, import_node_url.pathToFileURL)(path).toString());
                  for (const name of Object.keys(mod)) {
                    const id = idStore.get((0, import_node_path.normalize)(path), name);
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
          (0, import_build.vitePlugin)(apiDir, idStore)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BodyParserManager,
  useRPC
});
