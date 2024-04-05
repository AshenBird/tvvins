import {  KEY } from "./const";

export const definePlugin = (options:{
  name?:string
})=>{
  const { name="" } = options
  const ref = Object.create(null)
  const key = Symbol();
  Reflect.set(ref,"name",name||"")
  Reflect.set(ref,KEY,key)
  Reflect.set(ref,"setName",(name:string)=>{
    Reflect.set(ref,"name",name)
  })
  return ref
}