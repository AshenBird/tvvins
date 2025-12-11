import { HttpPluginConfig, HttpPluginResolvedConfig } from "./type"

export const resolveConfig = (config:HttpPluginConfig):HttpPluginResolvedConfig=> {
  const {baseUrl = "/",port=3000} = config
  return {
    baseUrl,
    port
  }
}