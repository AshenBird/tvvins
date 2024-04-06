import type { Config, ListenArgs, ListenReturn, Middleware, RequestHandle } from "./type";
import {
  createServer,
  type Server as HttpServer,
} from "node:http";
import type {Server as ConnectServer } from "connect"
import connect from "connect"
import { EventEmitter } from "node:events";
import { connectMiddlewareWrap, loadConfig } from "./utils";
import { Bellman } from "@mcswift/bellman"
const LISTEN  =Symbol.for("aaa")
export class App extends EventEmitter {
  private middleWares: Middleware[] = [];
  private _config: Config|null = null;
  private _httpServer: HttpServer|undefined;
  private _connect: ConnectServer
  private bellman = new Bellman()
  static beActive(app:App){
    const listen = Reflect.get(app,LISTEN)
    listen();
  }
  get isDevelopment() {
    return process.env.TVVINS_MODE==="development";
  }
  get httpServer() {
    return this._httpServer;
  }
  get config() {
    return this._config;
  }
  constructor() {
    super()
    this.init()
    this._connect = connect()
    this._httpServer = createServer(this._connect);
    Reflect.set(this,LISTEN,this.listen.bind(this))
  }
  private async init(){
    const config = await loadConfig(this.isDevelopment)
    this._config = Object.assign(config,);
    Object.freeze(this._config);
    this.bellman.resolve();
  }
  private async listen(...args: ListenArgs|[]): Promise<ListenReturn> {
    await this.bellman.signal
    this.emit("pre-mount")
    
    for(const middleware of this.middleWares){
      if(middleware.isConnect){
        this._connect.use(middleware.handle)
        continue;
      }
      const cm = connectMiddlewareWrap(middleware.handle,this)
      this._connect.use(cm)
    }
    this.emit("listen")
    return (this._httpServer as HttpServer).listen(...(args.length>0?args:[(this.config as Config).port]));
  }
  use(middleware: Middleware, name?: string | symbol) {
    this.middleWares.push(middleware);
    return this
  }
}
