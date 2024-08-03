"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/App.ts
var App_exports = {};
__export(App_exports, {
  App: () => App
});
module.exports = __toCommonJS(App_exports);
var import_node_http = require("node:http");
var import_connect = __toESM(require("connect"));
var import_node_events = require("node:events");
var import_Middleware = require("./Middleware.cjs");
var App = class extends import_node_events.EventEmitter {
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
    this._connect = (0, import_connect.default)();
  }
  async start(options) {
    this._options = options;
    Object.freeze(this._options);
    this._httpServer = (0, import_node_http.createServer)(this._connect);
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
    for (const middleware of this.middleWares) {
      if (!middleware) {
        continue;
      }
      if (middleware.isConnect) {
        this._connect.use(middleware.handle);
        continue;
      }
      const cm = (0, import_Middleware.connectMiddlewareWrap)(middleware.handle, this);
      this._connect.use(cm);
    }
    this.emit("listen");
    if (!this._httpServer)
      return null;
    if (!this.options)
      return null;
    this._httpServer.listen(this.options.port);
    const { Logger } = await import("@mcswift/base-utils");
    Logger.info(`listening ${this.options.host}${this.options.port}`);
  }
  use(middleware, name) {
    this.middleWares.push(middleware);
    return this;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  App
});
