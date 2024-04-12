import {  ConfigEnv, UserConfigExport, createServer, mergeConfig,resolveConfig as resolveViteConfig } from "vite"
import { join} from "node:path";
import { existsSync, readFileSync,  statSync } from "node:fs";
import type { IncomingMessage, NextHandleFunction } from "connect";
import { ServerResponse } from "node:http";
import { Tvvins, defineMiddleWare } from "@tvvins/core";

const createViteDevServer = async (viteOptions:UserConfigExport)=>{
  const viteConfig = mergeConfig(await unwrapViteConfig(viteOptions),{
    server:{middlewareMode:true}
  })
  return createServer(viteConfig)
}

export const createDevMiddleware = (viteOptions:UserConfigExport)=>{
  const createServerJob= createViteDevServer(viteOptions)
  const handle = async (req:IncomingMessage,res:ServerResponse,next:Function)=>{
    const server = await createServerJob
    return server.middlewares(req,res,next)
  }
  return defineMiddleWare(handle,"official-view",true)
}
export const _createViteServer=createServer

const matchContentType = (path:string)=>{
  if(path.endsWith(".js"))return "application/x-javascript; charset=utf-8"
  if(path.endsWith(".html"))return "text/html; charset=utf-8"
  if(path.endsWith(".css"))return "text/css; charset=utf-8"
  if(path.endsWith(".json"))return "application/json; charset=utf-8"
  if(path.endsWith(".ico"))return "application/x-ico"
  // @todo 常见动态资源及可遍历
  return "text/plain"
}

const createProdMiddleware = (viteOptions:UserConfigExport):Tvvins.Middleware=>{
  const handle:NextHandleFunction = async (req,res,next)=>{
    const { outDir }  = (await resolveViteConfig(await unwrapViteConfig(viteOptions),"build")).build
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
export const createStaticMiddleware = (options:Tvvins.InitOptions,viteOptions:UserConfigExport)=>{
  const isDev = process.env.TVVINS_MODE==="dev"
  if(!isDev) return createProdMiddleware(viteOptions)
  return createDevMiddleware(viteOptions)
}

export const unwrapViteConfig = async (userConfig: UserConfigExport) => {
  const configEnv: ConfigEnv = {
    command: "serve",
    mode: "development",
  };
  const config = await (typeof userConfig === "function"
    ? userConfig(configEnv)
    : userConfig);

  return config;
};
