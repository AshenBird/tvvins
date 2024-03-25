import { Middleware } from "koa"
import c2k from "koa-connect"
import { createServer,resolveConfig } from "vite"
import {isAbsolute, join} from "node:path";
import { cwd } from "node:process";
import { existsSync, readFileSync,  statSync } from "node:fs";

const createViteServer = async ()=>{
  const server = await createServer({
    server:{middlewareMode:true},
    appType:"spa"
  })
  return c2k(server.middlewares)
}

const createDevMiddleware = ( createTask:Promise<Middleware> ):Middleware=>{
  return async (ctx,next)=>{
    const viteMiddleware =  await createTask
    await viteMiddleware(ctx,next)
  }
}

const fideViteConfig = (configFile?:string)=>{
  const c = cwd()
  if(configFile){
    if(isAbsolute(configFile))return configFile
    join(c,configFile)
  }
  for(const p of ["vite.config.ts"]){
    const result = join(c,p);
    if(existsSync(result))return result;
  }
  return undefined
}

const matchContentType = (path:string)=>{
  if(path.endsWith(".js"))return "application/x-javascript; charset=utf-8"
  if(path.endsWith(".html"))return "text/html; charset=utf-8"
  if(path.endsWith(".css"))return "text/css; charset=utf-8"
  if(path.endsWith(".json"))return "application/json; charset=utf-8"
  if(path.endsWith(".ico"))return "application/x-ico"
  // @todo 常见动态资源及可遍历
  return "text/plain"
}

const createProdMiddleware = (configFile?:string):Middleware=>{
  const viteConfigFile = fideViteConfig(configFile)
  if(!viteConfigFile){
    throw new Error("[@tvvins/koa-middleware] can't find vite config file.")
  }
  const resolveConfigTask = resolveConfig({
    configFile:viteConfigFile
  },"build")
  
  return async (ctx,next)=>{
    const { outDir }  = (await resolveConfigTask).build
    const {url} = ctx.request
    let path =join(outDir,url)
    if(!existsSync(path)){
      return
    }
    FindFile:
    if(statSync(path).isDirectory()){
      for(const fp of ["index.html","index.htm"]){
        const p = join(path,fp)
        if(existsSync(p)){
          path = p
          break FindFile
        }
      }
      return
    }
    const contentType = matchContentType(path)
    console.debug(contentType,path)
    next()
    ctx.type = contentType
    const buffer = readFileSync(path)
    ctx.response.body = buffer
  }
}


// @todo 动态加载 node 的变化
export const createMiddleware = (options:{
  isDevelopment?:boolean,
  configFile?:string
})=>{
  const { isDevelopment = false,configFile }  = options
  if(!isDevelopment) return createProdMiddleware(configFile)
  const createTask =  createViteServer()
  return createDevMiddleware(createTask)
}

