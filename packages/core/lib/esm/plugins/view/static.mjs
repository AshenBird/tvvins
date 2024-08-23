// src/plugins/view/static.ts
import { join } from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";
import { defineMiddleWare } from "../../Middleware.mjs";
import { unwrapViteConfig } from "../../options.mjs";
import { cwd } from "node:process";
import { logger } from "../../logger.mjs";
import { fileURLToPath, pathToFileURL } from "node:url";
var createViteDevServer = async (viteOptions) => {
  const { mergeConfig, createServer } = await import("vite");
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
    let path = join(cwd(), `client`, url === "/" ? "index.html" : url);
    const filePath = fileURLToPath(pathToFileURL(path));
    const end = () => {
      const contentType = matchContentType(filePath);
      const buffer = readFileSync(filePath);
      res.writeHead(200, {
        "content-type": contentType
      }).end(buffer);
    };
    if (!existsSync(filePath)) {
      logger.error("\u6CA1\u627E\u5230\u9759\u6001\u8D44\u6E90:", filePath);
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
  createDevMiddleware,
  createStaticMiddleware
};
