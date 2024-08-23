import { type InlineConfig, type UserConfig, } from "vite"
import { join } from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";
import type { IncomingMessage, NextHandleFunction } from "connect";
import { ServerResponse } from "node:http";
import { defineMiddleWare } from "../../Middleware";
import { Tvvins } from "../../type";
import { unwrapViteConfig } from "../../options";
import { cwd } from "node:process";
import { logger } from "../../logger";

const createViteDevServer = async (viteOptions: InlineConfig) => {
  const {mergeConfig,createServer} = await import("vite")
  const viteConfig = mergeConfig(await unwrapViteConfig(viteOptions), {
    server: { middlewareMode: true }
  })
  return createServer(viteConfig)
}

export const createDevMiddleware = (viteOptions: InlineConfig) => {
  const createServerJob = createViteDevServer(viteOptions)
  const handle = async (req: IncomingMessage, res: ServerResponse, next: Function) => {
    const server = await createServerJob
    return server.middlewares(req, res, next)
  }
  return defineMiddleWare(handle, "official-view", true)
}
// export const _createViteServer = createServer

const matchContentType = (path: string) => {
  if (path.endsWith(".js")) return "application/x-javascript; charset=utf-8"
  if (path.endsWith(".html")) return "text/html; charset=utf-8"
  if (path.endsWith(".css")) return "text/css; charset=utf-8"
  if (path.endsWith(".json")) return "application/json; charset=utf-8"
  if (path.endsWith(".ico")) return "application/x-ico"
  if (path.endsWith(".png")) return "image/png"
  // @todo 常见动态资源及可遍历
  return "text/plain"
}

const createProdMiddleware = (viteOptions: UserConfig): Tvvins.Middleware => {
  const handle: NextHandleFunction = async (req, res, next) => {
    // const { outDir } = (await resolveViteConfig(await unwrapViteConfig(viteOptions), "build")).build;

    const url = new URL(req.url || "/", `http://${req.headers.host}`).pathname
    if (!url)
      return next();
    let path = join(cwd(), `client`, url === "/" ? "index.html" : url);
    // @todo 记录访问
    const end = () => {
      const contentType = matchContentType(path);
      const buffer = readFileSync(path);
      res.writeHead(200, {
        "content-type": contentType
      }).end(buffer);
    }
    if (!existsSync(path)) {
      logger.error("没找到静态资源:",path)
      next();
    } else {
      if (statSync(path).isDirectory()) {
        for (const fp of ["index.html", "index.htm"]) {
          const p = join(path, fp);
          if (existsSync(p)) {
            path = p;
            end()
            return
          }
        }
      } else {
        end()
        return
      }
    }
    next()
    if (!req.headers.accept?.includes('text/html')) return
    path = join(cwd(), `client`, "index.html");
    end()
  }
  return defineMiddleWare(handle, "official-view", true)
}


// @todo 动态加载 node 的变化
export const createStaticMiddleware = (viteOptions: UserConfig) => {
  const isDev = process.env.TVVINS_STAGE === "development"
  if (!isDev) return createProdMiddleware(viteOptions)
  return createDevMiddleware(viteOptions)
}

