import { createServer,resolveConfig } from "vite"
import {isAbsolute, join} from "node:path";
import { cwd } from "node:process";
import { existsSync, readFileSync,  statSync } from "node:fs";
import { IncomingMessage, NextHandleFunction } from "connect";
import { ServerResponse } from "node:http";
import { loadConfig } from "./utils";
import { defineMiddleWare } from "./Middleware";
import { Middleware } from "./type";
export const createDevMiddleware = ()=>{
  const createServerJob = createServer({
    server:{middlewareMode:true},
  })
  const handle = async (req:IncomingMessage,res:ServerResponse,next:Function)=>{
    const server = await createServerJob
    return server.middlewares(req,res,next)
  }
  return defineMiddleWare(handle,"official-view",true)
}
export const _createViteServer=createServer

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

const loadViteConfig = async (isDev:boolean)=>{
  const config = await loadConfig(isDev)
  const viteConfigFile = fideViteConfig(config.viteConfigFile)
  if(!viteConfigFile){
    throw new Error("[@tvvins/static-middleware] can't find vite config file.")
  }
  const result = await resolveConfig({
    configFile:viteConfigFile
  },"build")
  return result
}

const createProdMiddleware = ():Middleware=>{
  const loadConfigTask = loadViteConfig(false)
  const handle:NextHandleFunction = async (req,res,next)=>{
    const { outDir }  = (await loadConfigTask).build
    const {url} = req
    if(!url)return next()
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
    next()
    const buffer = readFileSync(path)
    res.writeHead(200,{
      "content-type":contentType
    }).end(buffer)
  }
  return defineMiddleWare(handle,"official-view",true)
}


// @todo 动态加载 node 的变化
export const createStaticMiddleware = ()=>{
  const isDev = process.env.TVVINS_MODE==="development"
  if(!isDev) return createProdMiddleware()
  return createDevMiddleware()
}

