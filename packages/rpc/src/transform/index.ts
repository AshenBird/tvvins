import { httpPlugin } from "./http"
import type { Plugin } from "vite"
export const tvvinsRPC = {
  http:httpPlugin.vite as (options?: unknown) => Plugin | Plugin[]
}