import type { Tvvins } from "./type";
import { createServer, type Server as HttpServer } from "node:http";
import type { Server as ConnectServer } from "connect";
import connect from "connect";
import { EventEmitter } from "node:events";
import { connectMiddlewareWrap } from "./Middleware";
import { logger } from "./logger";
export class App extends EventEmitter<Tvvins.AppEventMap> {
  private middleWares: Tvvins.Middleware[] = [];
  private _options: Tvvins.ResolvedInitOptions|Tvvins.ResolvedRunTimeInitOptions|null =null
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
  constructor() {
    super();
    this._connect = connect();
  }
  public async start(options:Tvvins.ResolvedInitOptions|Tvvins.ResolvedRunTimeInitOptions) {
    this._options = options
    Object.freeze(this._options);
    this._httpServer = createServer(this._connect);
    // 注册中间件
    for (const middleware of this._options.middlewares) {
      this.use(middleware);
    }
    this.listen();
  }
  private async listen() {
    // 构建模式直接退出
    if (process.env["TVVINS_MODE"] === "build") {
      return;
    }
    this.emit("pre-mount");
    this._connect.use((req,res,next)=>{
      logger.info(req.url)
      next()
    })
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
    // @todo 监听信息输出
    this._httpServer.listen(this.options.port);
    const { Logger} = await import("@mcswift/base-utils/logger")
    Logger.info(`listening ${this.options.host}${this.options.port}`)
  }
  use(middleware: Tvvins.Middleware, name?: string | symbol) {
    this.middleWares.push(middleware);
    return this;
  }
}
