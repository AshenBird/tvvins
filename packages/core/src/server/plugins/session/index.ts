import { getApp } from "../../app"
import { TvvinsModule } from "../../types"
import { SESSION_STORE_KEY } from "./const"


export function sessionPlugin(){
  return (app:TvvinsModule)=>{
    app.setStore(SESSION_STORE_KEY,{})
    return {}
  }
}
export class WithSession{
  getSession(){
    return getApp(this).getStore(SESSION_STORE_KEY)
  }
}