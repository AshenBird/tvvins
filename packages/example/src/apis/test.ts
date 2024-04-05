import { defineAPI } from "@/main"

export const test = defineAPI((payload:string)=>{
  // do something write some logic
  return payload
})