// src/Context.ts
import { URL } from "node:url";
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
    const { host, hash, hostname, href } = new URL(url);
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
export {
  Context
};
