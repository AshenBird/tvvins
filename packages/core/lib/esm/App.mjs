// src/App.ts
import { createServer } from "node:http";
import connect from "connect";
import { EventEmitter } from "node:events";
import { connectMiddlewareWrap } from "./Middleware.mjs";
var App = class extends EventEmitter {
  middleWares = [];
  _options;
  _httpServer;
  _connect;
  get isDevelopment() {
    return process.env.TVVINS_MODE === "development";
  }
  get httpServer() {
    return this._httpServer;
  }
  get options() {
    return this._options;
  }
  constructor(options) {
    super();
    this._options = options;
    Object.freeze(this._options);
    this.init();
    this._connect = connect();
    this._httpServer = createServer(this._connect);
  }
  async init() {
    for (const middleware of this._options.middlewares) {
      this.use(middleware);
    }
    this.listen();
  }
  async listen() {
    if (process.env["TVVINS_RUNTIME"] === "builder") {
      return;
    }
    this.emit("pre-mount");
    for (const middleware of this.middleWares) {
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
  }
  use(middleware, name) {
    this.middleWares.push(middleware);
    return this;
  }
};
export {
  App
};
