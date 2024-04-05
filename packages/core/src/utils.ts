import { NextHandleFunction, Server as ConnectServer, SimpleHandleFunction } from "connect";
import { Config, Middleware, RequestHandle, UserConfig } from "./type";
import { Context } from "./Context";
import { join } from "node:path";
import { cwd } from "node:process";
import { pathToFileURL } from "node:url";
import { IncomingMessage, ServerResponse } from "node:http";
import type { App } from "./Server";

const DEFAULT_CONFIG:Config = {
  port: 8000,
  entry: "main",
  source: "./src",
  viteConfigFile: cwd(),
  useDefaultStatic: true,
  host: "localhost"
}

export const defineConfig = (userConfig:UserConfig)=>{
  return Object.assign({},DEFAULT_CONFIG,userConfig)
}

export const transformConnectToTvvins = (raw:ConnectServer|SimpleHandleFunction|NextHandleFunction)=>{
  return async (ctx:Context,next:()=>Promise<unknown>)=>{
    const { req,res } = ctx.$
    await raw(req,res,next)
  }
}

export const connectMiddlewareWrap = (handle:RequestHandle,app:App):ConnectServer|SimpleHandleFunction|NextHandleFunction=>{
  return (req:IncomingMessage,res:ServerResponse,next:Function)=>{
    const ctx = new Context(req,res,app)
    return handle(ctx,()=>next())
  }
}
  
export const loadConfig = async (isDev:boolean)=>{
  const configRawPath = join(cwd(),"tvvins.config."+(isDev?"ts":"js"))
  const {default :config} = await import(pathToFileURL(configRawPath).toString())
  return config as Config
}