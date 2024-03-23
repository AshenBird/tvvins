import { createServer, request } from "node:http";
import Koa from "koa"
import { koaBody } from "koa-body"
export const app = new Koa();
app.use(koaBody)

export const httpServer = createServer(app.callback())

