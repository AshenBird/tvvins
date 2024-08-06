// src/App.ts
import { createServer } from "node:http";
import connect from "connect";
import { EventEmitter } from "node:events";
import { connectMiddlewareWrap } from "./Middleware.mjs";
import { logger } from "./logger.mjs";
var App = class extends EventEmitter {
  middleWares = [];
  _options = null;
  _httpServer;
  _connect;
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
  async start(options) {
    this._options = options;
    Object.freeze(this._options);
    this._httpServer = createServer(this._connect);
    for (const middleware of this._options.middlewares) {
      this.use(middleware);
    }
    this.listen();
  }
  async listen() {
    if (process.env["TVVINS_MODE"] === "build") {
      return;
    }
    this.emit("pre-mount");
    this._connect.use((req, res, next) => {
      logger.info(req.url);
      next();
    });
    for (const middleware of this.middleWares) {
      if (!middleware) {
        continue;
      }
      if (middleware.isConnect) {
        this._connect.use(middleware.handle);
        continue;
      }
      const cm = connectMiddlewareWrap(middleware.handle, this);
      this._connect.use(cm);
    }
    this.emit("listen");
    if (!this._httpServer)
      return null;
    if (!this.options)
      return null;
    this._httpServer.listen(this.options.port);
    const { Logger } = await import("@mcswift/base-utils/logger");
    Logger.info(`listening ${this.options.host}${this.options.port}`);
  }
  use(middleware, name) {
    this.middleWares.push(middleware);
    return this;
  }
};
export {
  App
};
