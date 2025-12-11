import type { Tvvins } from "./types"

export const createErrorResponse = (code:number,message:string,e:Error):Tvvins.ErrorResponse=>{
  const data = createErrorResult(message,e)
  return {
    code,
    message,
    error:false,
    data
  }
}
export const createErrorResult = (message?:string,e?:Error):Tvvins.ErrorData=>{
  return {
    stack:e?.stack||new Error().stack,
    message:message||e?.message||"ERROR",
    rawMessage:e?.message||"ERROR"
  }
}