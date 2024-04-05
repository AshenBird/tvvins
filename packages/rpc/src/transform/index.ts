
import type { Plugin } from "vite"
import { rpcPlugin } from "../server/plugin/http"
export const tvvinsRPC = {
  rpc:rpcPlugin.vite as (options?: unknown) => Plugin | Plugin[]
}