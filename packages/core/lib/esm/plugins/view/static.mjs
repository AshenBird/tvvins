// src/plugins/view/static.ts
import { createServer, mergeConfig, resolveConfig as resolveViteConfig } from "vite";
import { join } from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";
import { defineMiddleWare } from "../../Middleware.mjs";
import { unwrapViteConfig } from "../../options.mjs";
var createViteDevServer = async (viteOptions) => {
  const viteConfig = mergeConfig(await unwrapViteConfig(viteOptions), {
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
  return defineMiddleWare(handle, "official-view", true);
};
var _createViteServer = createServer;
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
    const { outDir } = (await resolveViteConfig(await unwrapViteConfig(viteOptions), "build")).build;
    const { url } = req;
    if (!url)
      return next();
    let path = join(outDir, url);
    if (!existsSync(path)) {
      return;
    }
    FindFile:
      if (statSync(path).isDirectory()) {
        for (const fp of ["index.html", "index.htm"]) {
          const p = join(path, fp);
          if (existsSync(p)) {
            path = p;
            break FindFile;
          }
        }
        return;
      }
    const contentType = matchContentType(path);
    next();
    const buffer = readFileSync(path);
    res.writeHead(200, {
      "content-type": contentType
    }).end(buffer);
  };
  return defineMiddleWare(handle, "official-view", true);
};
var createStaticMiddleware = (viteOptions) => {
  const isDev = process.env.TVVINS_MODE === "dev";
  if (!isDev)
    return createProdMiddleware(viteOptions);
  return createDevMiddleware(viteOptions);
};
export {
  _createViteServer,
  createDevMiddleware,
  createStaticMiddleware
};
