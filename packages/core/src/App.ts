import type { Tvvins } from "./type";
import { createServer, type Server as HttpServer } from "node:http";
import type { Server as ConnectServer } from "connect";
import connect from "connect";
import { EventEmitter } from "node:events";
import { connectMiddlewareWrap } from "./Middleware";

export class App extends EventEmitter<Tvvins.AppEventMap> {
  private middleWares: Tvvins.Middleware[] = [];
  private _options: Tvvins.ResolvedInitOptions|Tvvins.ResolvedRunTimeInitOptions
  private _httpServer: HttpServer | undefined;
  private _connect: ConnectServer;
  get isDevelopment() {
    return process.env.TVVINS_STAGE === "development";
  }
  get httpServer() {
    return this._httpServer;
  }
  get options() {
    return this._options;
  }
  constructor(options:Tvvins.ResolvedInitOptions|Tvvins.ResolvedRunTimeInitOptions) {
    super();
    this._options = options
    Object.freeze(this._options);
    this._connect = connect();
    this._httpServer = createServer(this._connect);
    this.init();
  }
  private async init() {
    // 注册中间件
    for (const middleware of this._options.middlewares) {
      this.use(middleware);
    }
    this.listen();
  }
  private async listen() {
    if (process.env["TVVINS_MODE"] === "build") {
      return;
    }
    this.emit("pre-mount");
    for (const middleware of this.middleWares) {
      if(!middleware){
        continue
      }
      if (middleware.isConnect) {
        this._connect.use(middleware.handle);
        continue;
      }
      const cm = connectMiddlewareWrap(middleware.handle, this);
      this._connect.use(cm);
    }
    this.emit("listen");
    if (!this._httpServer) return null as never;
    if (!this.options) return null as never;
    console.debug(this.options.port)
    this._httpServer.listen(this.options.port);
  }
  use(middleware: Tvvins.Middleware, name?: string | symbol) {
    this.middleWares.push(middleware);
    return this;
  }
}
