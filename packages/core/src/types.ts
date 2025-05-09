import type { TvvinsService } from "./Service"
import type { UserConfig } from "vite"
import type { HandleFunction, NextHandleFunction } from "connect"
import { IncomingMessage, ServerResponse } from "http"


export interface CustomService extends  TvvinsService{
  [k:string]:any
}
export type ServiceClass = {
  new ():CustomService
}
export type ConnectMiddleware = NextHandleFunction|HandleFunction
export namespace Tvvins {
  /********************************************/
  /* 配置项类型 */
  export type Options = {
    port:number // 生产环境
    rpc:RpcOptions
    service:  ServiceClass[]
    middlewares: ConnectMiddleware[]
    develop:DevelopOptions,
  }
  export type UserOptions = Partial<Options&{
    rpc:UserRpcOptions
  }>
  export type DevelopOptions = UserConfig['server']
  export type RpcOptions = {
    uri:`/${string}`
  } 
  export type UserRpcOptions = (Partial<RpcOptions>) | (`/${string}`)
  /********************************************/
  /* 上下文 */
  export type Context = {
    req: IncomingMessage,
    res: ServerResponse
  }
  
}