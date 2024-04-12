"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/Context.ts
var Context_exports = {};
__export(Context_exports, {
  Context: () => Context
});
module.exports = __toCommonJS(Context_exports);
var import_node_url = require("node:url");
var Context = class {
  get $() {
    return {
      req: this.req,
      res: this.res,
      server: this._server.httpServer
    };
  }
  get server() {
    return this._server;
  }
  get request() {
    const options = this.server.options;
    const url = `http://${options.host}:${options.port}${this.req.url}`;
    const { host, hash, hostname, href } = new import_node_url.URL(url);
    return {
      headers: this.req.headers,
      url: this.req.url || "/",
      host,
      hash,
      hostname,
      href
    };
  }
  req;
  res;
  _server;
  constructor(req, res, server) {
    this.req = req;
    this.res = res;
    this._server = server;
  }
  setType(contentType) {
    this.req.headers["content-type"] = contentType;
    return this;
  }
  setHeader(key, value) {
    this.req.headers[key] = value;
  }
  write(content) {
    return this.res.write(content);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Context
});
