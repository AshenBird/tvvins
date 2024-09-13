
import { defineAPI } from "../plugins/rpc"
export const test = defineAPI(function(id:string,name:string){
  this.session
  return {
    id,
    name
  }
})
// @todo searchTask

// (alias) defineAPI<{
//   aaa: string;
// }, unknown>(handle: ApiHandle<{
//   aaa: string;
// }, unknown>, name?: string): APIWithPayload<{
//   aaa: string;
// }, unknown>