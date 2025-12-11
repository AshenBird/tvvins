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
  /********************************************/
  /* http 标准响应 */
  export type Response<T extends any = any> = ErrorResponse|SuccessResponse<T>
  
  export type SuccessResponse<T extends any = any> = {
    message: string
    code: 200
    error: true
    data:T
  }
  export type ErrorResponse = {
    message: string
    code: ErrorCode
    error: false
    data:ErrorData
  }
  
  // @todo 这里后面要显式的去声明下所有的状态码
  export type ErrorCode = number
  /********************************************/
  /* http 流式响应 */

  /********************************************/
  /* 错误 */
  export type Error = {
    
  }
  
  export type ErrorData = {
    stack?: string;
    message:string
    rawMessage?: string;
  };
  
  /********************************************/
  /* body-parser */
  export type BodyParseResultBase<T = any> = {
    error: boolean;
    data: T;
  };  
  export type BodyParseErrorResult = BodyParseResultBase<ErrorData> & {
    error: true;
  }
  export type BodyParseResult<T = any> =
  | BodyParseResultBase<T>
  | BodyParseErrorResult;
  export type BodyParser = (req: IncomingMessage) => Promise<BodyParseResult>
}

export type TvvinsResponse<T> = Tvvins.Response<T>
export type TvvinsError = Tvvins.Error