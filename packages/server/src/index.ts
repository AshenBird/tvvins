import { createServer} from "http"
import Koa from "koa"
import type { Middleware } from "Koa"
import { createMiddleware } from "@tvvins/koa-view-middleware"

export const createApp = (isDevelopment=false)=>{
  const middlewares:Middleware[] = []
  const app = new Koa()
  const httpServer = createServer(app.callback())
  type Listen = typeof httpServer.listen
  const viewMiddleware = createMiddleware({
    isDevelopment
  }) 
  const listen:Listen = (...args)=>{
    for(const middleware of middlewares){
      app.use(middleware)
    }
    app.use(viewMiddleware)
    // @ts-ignore
    return httpServer.listen(...args)
  } 
  Object.defineProperty(app.context,"httpServer",{
    value:httpServer,
  })
  Object.defineProperty(app.context,"isDevelopment",{
    value:isDevelopment
  })
  const use = (middleware:Middleware)=>{
    middlewares.push(middleware)
    return result
  }
  const result ={
    use,
    app,
    listen
  }
  return result 
}
