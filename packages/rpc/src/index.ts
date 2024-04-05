import type { Plugin } from "vite"
import { rpcPlugin } from "./server/plugin/http"
export * from "./server"
export const VitePlugin = rpcPlugin.vite as (options?: unknown) => Plugin[]