import { Config, ListenArgs, ListenReturn, MiddleWareRecord, Middleware } from "./type";
import {
  createServer,
  type Server as HttpServer,
} from "node:http";
import type {Server as ConnectServer, HandleFunction } from "connect"
import connect from "connect"
import { EventEmitter } from "node:events";
import { connectMiddlewareWrap } from "./utils";

const META = Symbol("meta")
export class Server extends EventEmitter {
  private middleWares: MiddleWareRecord[] = [];
  private _config: Config;
  private _httpServer: HttpServer|undefined;
  private _connect: ConnectServer
  get isDevelopment() {
    return process.env.TVVINS_MODE==="development";
  }
  get httpServer() {
    return this._httpServer;
  }
  get config() {
    return this._config;
  }
  constructor(config: Config) {
    super()
    this._config = config;
    this._connect = connect()
    this._httpServer = createServer(this._connect);
    Object.freeze(this._config);
  }
  listen(...args: ListenArgs|[]): ListenReturn {
    this.emit("pre-mount")
    for(const {isConnect,handle} of this.middleWares){
      if(isConnect){
        this._connect.use(handle)
        continue;
      }
      const cm = connectMiddlewareWrap(handle,this)
      this._connect.use(cm)
    }
    this.emit("listen")
    return (this._httpServer as HttpServer).listen(...(args.length>0?args:[this.config.port]));
  }
  use(handle: Middleware, name?: string | symbol) {
    const key = name || Function.prototype.toString.bind(handle)();
    this.middleWares.push({
      handle,
      key,
      isConnect:false
    });
    Reflect.set(handle,META,{
      key
    })
    return this
  }
  useConnectMiddleWare(handle:HandleFunction,name?: string | symbol){
    const key = name || Function.prototype.toString.bind(handle)();
    this.middleWares.push({
      handle,
      key,
      isConnect:true
    });
    Reflect.set(handle,META,{
      key
    })
    return this
  }
}
