import {Server as  HttpServer} from "node:http"
import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url"
import type {Server} from "./Server"
export class Context {
  get $(){
    return {
      req:this.req,
      res:this.res,
      server:this._server.httpServer as HttpServer
    }
  }
  get server(){
    return this._server
  }
  get request(){
    const { host,hash,hostname,href } = new URL(this.req.url||"/")
    return {
      headers:this.req.headers,
      url:this.req.url||"/",
      host,hash,hostname,href
    }
  }
  private req:IncomingMessage
  private res:ServerResponse
  private _server:Server
  constructor(req:IncomingMessage,res:ServerResponse,server:Server){
    this.req =req
    this.res =res
    this._server = server
  }
  setType(contentType:string){
    this.req.headers["content-type"] = contentType
    return this
  }
  setHeader(key:keyof IncomingMessage["headers"],value:string){
    this.req.headers[key] = value
  }
  write(content:unknown){
    return this.res.write(content)
  }
}