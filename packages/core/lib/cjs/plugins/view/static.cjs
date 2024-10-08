"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugins/view/static.ts
var static_exports = {};
__export(static_exports, {
  createDevMiddleware: () => createDevMiddleware,
  createStaticMiddleware: () => createStaticMiddleware
});
module.exports = __toCommonJS(static_exports);
var import_node_path = require("node:path");
var import_node_fs = require("node:fs");
var import_Middleware = require("../../Middleware.cjs");
var import_options = require("../../options.cjs");
var import_node_process = require("node:process");
var import_logger = require("../../logger.cjs");
var createViteDevServer = async (viteOptions) => {
  const { mergeConfig, createServer } = await import("vite");
  const viteConfig = mergeConfig(await (0, import_options.unwrapViteConfig)(viteOptions), {
    server: { middlewareMode: true }
  });
  return createServer(viteConfig);
};
var createDevMiddleware = (viteOptions) => {
  const createServerJob = createViteDevServer(viteOptions);
  const handle = async (req, res, next) => {
    const server = await createServerJob;
    return server.middlewares(req, res, next);
  };
  return (0, import_Middleware.defineMiddleWare)(handle, "official-view", true);
};
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
  if (path.endsWith(".png"))
    return "image/png";
  return "text/plain";
};
var createProdMiddleware = (viteOptions) => {
  const handle = async (req, res, next) => {
    const url = new URL(req.url || "/", `http://${req.headers.host}`).pathname;
    if (!url)
      return next();
    let path = (0, import_node_path.join)((0, import_node_process.cwd)(), `client`, url === "/" ? "index.html" : url);
    const filePath = decodeURIComponent(path);
    const end = (p) => {
      const contentType = matchContentType(p);
      const buffer = (0, import_node_fs.readFileSync)(p);
      res.writeHead(200, {
        "content-type": contentType
      }).end(buffer);
    };
    if (!(0, import_node_fs.existsSync)(filePath)) {
      import_logger.logger.error("\u6CA1\u627E\u5230\u9759\u6001\u8D44\u6E90:", filePath);
      next();
    } else {
      if ((0, import_node_fs.statSync)(filePath).isDirectory()) {
        for (const fp of ["index.html", "index.htm"]) {
          const p = (0, import_node_path.join)(filePath, fp);
          if ((0, import_node_fs.existsSync)(p)) {
            end(p);
            return;
          }
        }
      } else {
        end(filePath);
        return;
      }
    }
    next();
    if (!req.headers.accept?.includes("text/html"))
      return;
    const index = (0, import_node_path.join)((0, import_node_process.cwd)(), `client`, "index.html");
    end(index);
  };
  return (0, import_Middleware.defineMiddleWare)(handle, "official-view", true);
};
var createStaticMiddleware = (viteOptions) => {
  const isDev = process.env.TVVINS_STAGE === "development";
  if (!isDev)
    return createProdMiddleware(viteOptions);
  return createDevMiddleware(viteOptions);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDevMiddleware,
  createStaticMiddleware
});
