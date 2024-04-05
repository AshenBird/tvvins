import { BodyParseErrorData } from "../type"

export const createErrorResult = (code:number,message:string,e:Error):BodyParseErrorData=>{
  return {
    code,
    message,
    stack:e.stack||new Error().stack,
    rawMessage:e.message
  }
}