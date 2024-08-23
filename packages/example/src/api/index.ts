
import { defineAPI, useSession } from "../plugins/rpc"

export const test = defineAPI(async function() {
  // const session = 
  useSession()
  return {
    aaa:"Aaa"
  }
})
// @todo searchTask

