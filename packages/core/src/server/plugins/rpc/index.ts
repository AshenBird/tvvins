import { TvvinsFunctionPlugin, TvvinsModule } from "@/server/types"

export const rpcPlugin = ():TvvinsFunctionPlugin => {
  const result:TvvinsFunctionPlugin = (app:TvvinsModule,name:string)=>{
    return {
      server: {
      },
      client:{
        
      }
    }
  }
  return result
}