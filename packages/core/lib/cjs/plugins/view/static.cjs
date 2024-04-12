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

// src/plugins/view/static.ts
var static_exports = {};
__export(static_exports, {
  _createViteServer: () => _createViteServer,
  createDevMiddleware: () => createDevMiddleware,
  createStaticMiddleware: () => createStaticMiddleware
});
module.exports = __toCommonJS(static_exports);
var import_vite = require("vite");
var import_node_path = require("node:path");
var import_node_fs = require("node:fs");
var import_Middleware = require("../../Middleware.cjs");
var import_options = require("../../options.cjs");
var createViteDevServer = async (viteOptions) => {
  const viteConfig = (0, import_vite.mergeConfig)(await (0, import_options.unwrapViteConfig)(viteOptions), {
    server: { middlewareMode: true }
  });
  return (0, import_vite.createServer)(viteConfig);
};
var createDevMiddleware = (viteOptions) => {
  const createServerJob = createViteDevServer(viteOptions);
  const handle = async (req, res, next) => {
    const server = await createServerJob;
    return server.middlewares(req, res, next);
  };
  return (0, import_Middleware.defineMiddleWare)(handle, "official-view", true);
};
var _createViteServer = import_vite.createServer;
var matchContentType = (path) => {
  if (path.endsWith(".js"))
    return "application/x-javascript; charset=utf-8";
  if (path.endsWith(".html"))
    return "text/html; charset=utf-8";
  if (path.endsWith(".css"))
    return "text/css; charset=utf-8";
  if (path.endsWith(".json"))
    return "application/json; charset=utf-8";
  if (path.endsWith(".ico"))
    return "application/x-ico";
  return "text/plain";
};
var createProdMiddleware = (viteOptions) => {
  const handle = async (req, res, next) => {
    const { outDir } = (await (0, import_vite.resolveConfig)(await (0, import_options.unwrapViteConfig)(viteOptions), "build")).build;
    const { url } = req;
    if (!url)
      return next();
    let path = (0, import_node_path.join)(outDir, url);
    if (!(0, import_node_fs.existsSync)(path)) {
      return;
    }
    FindFile:
      if ((0, import_node_fs.statSync)(path).isDirectory()) {
        for (const fp of ["index.html", "index.htm"]) {
          const p = (0, import_node_path.join)(path, fp);
          if ((0, import_node_fs.existsSync)(p)) {
            path = p;
            break FindFile;
          }
        }
        return;
      }
    const contentType = matchContentType(path);
    next();
    const buffer = (0, import_node_fs.readFileSync)(path);
    res.writeHead(200, {
      "content-type": contentType
    }).end(buffer);
  };
  return (0, import_Middleware.defineMiddleWare)(handle, "official-view", true);
};
var createStaticMiddleware = (viteOptions) => {
  const isDev = process.env.TVVINS_MODE === "dev";
  if (!isDev)
    return createProdMiddleware(viteOptions);
  return createDevMiddleware(viteOptions);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _createViteServer,
  createDevMiddleware,
  createStaticMiddleware
});
