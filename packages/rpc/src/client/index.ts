import { Bellman } from "@mcswift/bellman";
import { HandledResult, Schema } from "../common/type";
import { encode,decode } from "../common/data";

const utf8Decoder = new TextDecoder('utf8')
const byteToUTF8 = (bytes: Uint8Array | ArrayBufferView) => {
  const input = ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : bytes
  return utf8Decoder.decode(input)
}
let sessionId = ""
const bellman  = new Bellman()
let lock = false

export type ErrorHookResult = "continue"|"retry"|"break"|boolean
export type ResponseErrorHook = (resp:any)=>Promise<ErrorHookResult>|ErrorHookResult

const responseErrorHooks = new Map<symbol,ResponseErrorHook>()
export const onResponseError = (hook:ResponseErrorHook)=>{
  const id = Symbol()
  responseErrorHooks.set(id,hook)
  return ()=>{
    responseErrorHooks.delete(id)
  }
}
export const rpc = async (payload: any[], id: string, url: string,times=0):Promise<any> => {
  if(bellman.status==="padding"&&lock){
    await bellman.signal
  }else if(!sessionId){
    lock = true;
    const r = await fetch(url+"/session",{
      method:"POST",
    })
    const sid = r.headers.get("x-tvvins-rpc-session-id")
    if(!sid){
      const err = new Error("can't get sessionId")
      bellman.reject(err)
      throw err;
    }
    bellman.resolve()
    sessionId = sid
    lock = false
  }
  
  const rt = getPayloadType(payload)
  const response =await fetch(url, {
    method: "POST",
    headers: { 
      "x-tvvins-rpc-id": id,
      "content-type":rt,
      "x-tvvins-rpc-session-id":sessionId
    },
    body:JSON.stringify(encode(payload)),
  });
  const type = response.headers.get("content-type")
  
  if(type==="application/json"){
    if(!response.body)return ""
    const responseBody = JSON.parse(await textDecode(response.body)) as HandledResult<unknown>
    const { val, schema,isError=false } = responseBody
    const r = decode(val,schema)
    if(isError){
      console.debug(r)
      console.error(r.message)
      for(const errorHook of responseErrorHooks.values()){
        const errorResult = await errorHook(r)
        if(typeof errorResult ==="boolean"){
          if(errorResult)continue;
          return r
        }
        if(errorResult==="continue")continue;
        if(errorResult==="break")continue;
        // 超过最大重试次数
        if(times>=10)continue;
        return await rpc(payload, id, url,times+1)
      }
      
    }
    return r
  }
  /**
   * @deprecated 不再会有纯字符串了
   */
  if(type==="text/plain"){
    if(!response.body)return ""
    return await textDecode(response.body)
  }
  return response.body
};
const textDecode = async (body:ReadableStream<Uint8Array>)=>{
  const result:string[] = []
  const reader = body.getReader()
  for(;;){
    if(!reader)return null as never
    const frame = await reader.read()
    if(frame.value){
      const raw =byteToUTF8(frame.value)
      result.push(raw)
    }
    if(frame.done)break;
  }
  return result.join("")
}
const getPayloadType = (val:unknown[])=>{
  if(val.some(arg=>arg instanceof FormData)){
    if(val.length > 1){
      throw new Error("API accept only one param when use formdata param.")
    }
    // @todo formdata content-type 优化
    return "FormData"
  }
  return "application/json"
}
