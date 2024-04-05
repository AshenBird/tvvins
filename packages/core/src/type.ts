import { type Server } from "node:http"
import type { Context } from "./Context"
import type { Server as ConnectServer, HandleFunction } from "connect"

export type RequestHandle = (ctx:Context,next:()=>any)=>any
export type Middleware = ConnectMiddleware|TvvinsMiddleware
export type ConnectHandle = HandleFunction|ConnectServer
type MiddlewareBase = {
  name?:string
  setName:(name:string)=>void
}
export interface ConnectMiddleware extends MiddlewareBase {
  isConnect:true
  handle:ConnectHandle
}
export interface TvvinsMiddleware extends MiddlewareBase {
  isConnect:false
  handle:RequestHandle
}
export interface Plugin{}
export type ServerInitOptions = {
  plugins?:Plugin[]
  middlewares?:Middleware[]
  useOfficialView?:boolean
  autoBoot?:boolean
}


export type Config = {
  port:number
  entry:string
  source:string
  viteConfigFile:string
  useDefaultStatic:boolean,
  host:string
}
export type DevConfig = Partial<Config>&{
  watch:WatchOption
}

export type WatchOption = {
  ignores?:string[]
}

export type UserConfig = Partial<Config>&{
  development?:DevConfig
  production?:Partial<Config>
}

export type ListenArgs = Parameters<Server["listen"]>
export type ListenReturn  = ReturnType<Server["listen"]>




