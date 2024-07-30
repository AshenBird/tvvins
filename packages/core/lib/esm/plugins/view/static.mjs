// src/plugins/view/static.ts
import { createServer, mergeConfig } from "vite";
import { join } from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";
import { defineMiddleWare } from "../../Middleware.mjs";
import { unwrapViteConfig } from "../../options.mjs";
import { cwd } from "node:process";
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
    const url = new URL(req.url || "/", `http://${req.headers.host}`).pathname;
    if (!url)
      return next();
    let path = join(cwd(), `client`, url === "/" ? "index.html" : url);
    console.debug(url);
    const end = () => {
      const contentType = matchContentType(path);
      const buffer = readFileSync(path);
      res.writeHead(200, {
        "content-type": contentType
      }).end(buffer);
    };
    if (!existsSync(path)) {
      next();
    } else {
      if (statSync(path).isDirectory()) {
        for (const fp of ["index.html", "index.htm"]) {
          const p = join(path, fp);
          if (existsSync(p)) {
            path = p;
            end();
            return;
          }
        }
      } else {
        end();
        return;
      }
    }
    next();
    if (!req.headers.accept?.includes("text/html"))
      return;
    path = join(cwd(), `client`, "index.html");
    end();
  };
  return defineMiddleWare(handle, "official-view", true);
};
var createStaticMiddleware = (viteOptions) => {
  const isDev = process.env.TVVINS_STAGE === "development";
  if (!isDev)
    return createProdMiddleware(viteOptions);
  return createDevMiddleware(viteOptions);
};
export {
  _createViteServer,
  createDevMiddleware,
  createStaticMiddleware
};
