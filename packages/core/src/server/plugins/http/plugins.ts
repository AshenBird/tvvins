import Express from "express"
import Http from "node:http"
import { HttpPluginConfig, HttpPluginPortConfig, HttpPluginResolvedConfig, HttpPluginRootConfig, HttpStore } from "./type"
import { TvvinsModule,  TvvinsOptionalPlugin } from "../../types"
import { BASE_URL_KEY, ROUTER_KEY } from "./const"
import { Logger } from "../../logger"
import { resolveConfig } from "./config"

const HTTP_PLUGIN_KEY = Symbol("httpPlugin")
export const getHttpServer = (app: TvvinsModule) => {
  return app.getStore(HTTP_PLUGIN_KEY).httpServer as Http.Server
}

const logger = new Logger("HTTP-plugin")

const createStore = (app: TvvinsModule, config: HttpPluginConfig): [HttpPluginResolvedConfig, HttpStore, boolean] => {
  const history = app.getStore(HTTP_PLUGIN_KEY)
  const resolvedConfig = resolveConfig(config)
  if (history && history.portMap.size > 0) {
    const { portMap } = history as HttpStore

    const { port, baseURL } = resolvedConfig
    const portRecord = portMap.get(port)
    if (portRecord) {
      const { express, roots } = portRecord

      // const baseUrlList = roots.map(item=>item.resolvedConfig.baseUrl) 
      if (roots.has(baseURL)) {
        throw new Error(`不能对\`:${port}${baseURL}\`,声明多个 http plugin`)
      }
      const router = Express.Router()
      express.use(baseURL, router)
      portRecord.roots.set(baseURL, {
        config,
        resolvedConfig,
        router
      })
      return [resolvedConfig, history, true]
    }
    const express = Express()
    const router = Express.Router()
    express.use(baseURL, router)
    const roots = new Map<string, HttpPluginRootConfig>()
    roots.set(baseURL, {
      config,
      resolvedConfig,
      router
    })
    portMap.set(port, {
      express,
      roots
    })
    return [resolvedConfig, history as HttpStore, false]
  }
  const { baseURL, port } = resolvedConfig
  const router = Express.Router()
  const express = Express()
  express.use(baseURL, router)
  const roots = new Map<string, HttpPluginRootConfig>()
  roots.set(baseURL, {
    config,
    resolvedConfig,
    router
  })
  const portMap = new Map<number, HttpPluginPortConfig>()
  portMap.set(port, {
    express,
    roots
  })
  const httpServer = Http.createServer((req, res) => {
    const p = req.socket.localPort;
    if (!p) {
      console.error('甚是奇怪，httpServer 没有监听任何端口')
      res.statusCode = 500
      res.end()
      return
      // throw new Error('甚是奇怪，httpServer 没有监听任何端口')
    }
    const portRecord = portMap.get(p)
    if (!portRecord) {

      console.error(`没有对 ${p} 监听的 http 插件实例`)
      res.statusCode = 500
      res.end()
      return
      // throw new Error(`${}`)
    }
    const { express: handle } = portRecord
    handle(req, res)
  });

  const store = {
    httpServer,
    portMap
  }
  app.setStore(HTTP_PLUGIN_KEY, store)
  return [resolvedConfig, store, false]
}

export const httpPlugin = (config: HttpPluginConfig) => {
  return function (app: TvvinsModule) {
    const [{ port, baseURL }, store, hasListen] = createStore(app, config)
    const { httpServer, portMap } = store
    const { roots } = portMap.get(port) as HttpPluginPortConfig
    const { router } = roots.get(baseURL) as HttpPluginRootConfig
    const result:  TvvinsOptionalPlugin = {
      server: {
        onServer(_app: TvvinsModule, server: any) {
          if (typeof server !== "object" || Array.isArray(server)) return;
          if (server[ROUTER_KEY]) {
            router.use(server[BASE_URL_KEY], server[ROUTER_KEY])
          }
        },

        onLaunch(_app: TvvinsModule) {
          if (hasListen) return
          httpServer.listen(port, () => {
            logger.info(`http server is running on port ${port}`)
            // console.log(`http server is running on port ${config.port}`)
          })
        },
        proxy(app: TvvinsModule, server: any) {

        },
      }
    }
    return result
  }
}