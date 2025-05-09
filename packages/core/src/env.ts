import process from "node:process"
/**
 * TVVINS_MODE: build | run
 * TVVINS_STAGE: development | production | test
 */
export const env = process.env

export const isBuild = ()=>env.TVVINS_MODE=== "build"

export const isDevelopment = ()=>env.TVVINS_STAGE = "development"