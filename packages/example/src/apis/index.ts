import { Stream } from "stream"
import { defineAPI } from "../plugins/rpc"

export const test = defineAPI((payload:Record<string,string>)=>{
  
  // do something write some logic
  return payload
})