import { APIFunc } from "../../types";
import { Router } from "express";
import { BASE_URL_KEY, ROUTER_KEY } from "./const";
import { Express } from "express"
import Http from "node:http"
export type HttpPluginConfig = {
  baseURL?: string
  port?: number
}
export type HttpPluginResolvedConfig = Required<HttpPluginConfig>
export type HttpMethodName =
  | "Get"
  | "Head"
  | "Post"
  | "Put"
  | "Delete"
  | "Connect"
  | "Options"
  | "Trace"
  | "Patch";
export type HttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH"
  | "get"
  | "head"
  | "post"
  | "put"
  | "delete"
  | "connect"
  | "options"
  | "trace"
  | "patch";

export type HttpMethodDecoratorFac = (url: string) => ((value: APIFunc, context: DecoratorContext) => APIFunc)
type HttpMethodDecorators = Record<HttpMethodName, HttpMethodDecoratorFac>
export interface HttpDecoratorFac extends HttpMethodDecorators {

  (baseUrl: string): (Class: any, context: DecoratorContext) => TvvinsHttpServer & InstanceType<typeof Class>

}
export interface TvvinsHttpServer {
  [BASE_URL_KEY]: string
  [ROUTER_KEY]: Router
}
export type HttpPluginPortConfig = {
    readonly express: Express;
    readonly roots: Map<string, HttpPluginRootConfig>
}
export type HttpPluginRootConfig = {
  readonly config: HttpPluginConfig;
  readonly resolvedConfig: HttpPluginResolvedConfig;
  readonly router: Router
}
export type HttpStore = {
  readonly httpServer: Http.Server<typeof Http.IncomingMessage, typeof Http.ServerResponse>;
  readonly portMap: Map<number, HttpPluginPortConfig>
}