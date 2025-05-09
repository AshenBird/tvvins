import { Server as HttpServer } from "node:http";
import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import type { App } from "./App";
import type { Tvvins } from "./type"
export class Context {
  get $() {
    return {
      req: this.req,
      res: this.res,
      server: this._server.httpServer as HttpServer,
    };
  }
  get server() {
    return this._server;
  }
  get request() {
    const options = this.server.options as Tvvins.ResolvedInitOptions;
    const url = `http://${options.host}:${options.port}${this.req.url}`;
    const { host, hash, hostname, href } = new URL(url);
    return {
      headers: this.req.headers,
      url: this.req.url || "/",
      host,
      hash,
      hostname,
      href,
    };
  }
  private req: IncomingMessage;
  private res: ServerResponse;
  private _server: App;
  constructor(req: IncomingMessage, res: ServerResponse, server: App) {
    this.req = req;
    this.res = res;
    this._server = server;
  }
  setType(contentType: string) {
    this.req.headers["content-type"] = contentType;
    return this;
  }
  setHeader(key: keyof IncomingMessage["headers"], value: string) {
    this.req.headers[key] = value;
  }
  write(content: unknown) {
    return this.res.write(content);
  }
}
