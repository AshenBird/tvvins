import { IncomingMessage, type Server, ServerResponse } from "node:http"
import { Context } from "./Context"
import type { Server as ConnectServer, HandleFunction } from "connect"

export type Middleware = (ctx:Context,next:()=>any)=>any

export type Config = {
  port:number
  entry:string
  source:string
  viteConfigFile:string
  useDefaultStatic:boolean,
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
type BaseMiddleWareRecord ={
  key: string | symbol;
}
interface TvvinsMiddleWareRecord  extends BaseMiddleWareRecord {
  handle: Middleware
  isConnect:false
}
interface ConnectMiddleWareRecord  extends BaseMiddleWareRecord {
  handle: HandleFunction
  isConnect:true
}
export type MiddleWareRecord =  TvvinsMiddleWareRecord|ConnectMiddleWareRecord