import { Bellman } from "@mcswift/bellman";
import { HandledResult, Schema } from "../common/type";

const utf8Decoder = new TextDecoder('utf8')
const byteToUTF8 = (bytes: Uint8Array | ArrayBufferView) => {
  const input = ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : bytes
  return utf8Decoder.decode(input)
}
let sessionId = ""
const bellman  = new Bellman()
let lock = false
export const rpc = async (payload: any, id: string, url: string) => {
  if(bellman.status==="padding"&&lock){
    console.debug(1)
    await bellman.signal
  }else if(!sessionId){
    console.debug(2)
    lock = true
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
  
  console.debug(3)
  const rt = getPayloadType(payload)
  const response =await fetch(url, {
    method: "POST",
    headers: { 
      "x-tvvins-rpc-id": id,
      "content-type":rt,
      "x-tvvins-rpc-session-id":sessionId
    },
    body: rt==="application/json"?JSON.stringify(payload):payload,
  });
  const type = response.headers.get("content-type")
  
  if(type==="application/json"){
    if(!response.body)return ""
    const responseBody = JSON.parse(await textDecode(response.body)) as HandledResult<unknown>
    const { val, schema,isError=false } = responseBody
    const r = recoveryData(val,schema)
    if(isError){
      // @ts-ignore
      console.error(val.message)
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
  return result.join(" ")
}
const getPayloadType = (val:unknown)=>{
  if(typeof val ==="string")return "text/plain"
  return "application/json"
}
const directTypes = [
  "string",
  "number",
  "boolean",
]
const recoveryData =(val:any, schema:Schema)=>{
  if(directTypes.includes(schema.type)) return val
  if(schema.type==="bigint") return BigInt(val)
  if(schema.type==="symbol") return val?Symbol.for(val):Symbol()
  if(schema.type==="NaN") return NaN
  if(schema.type==="Infinity") return Infinity
  if(schema.type==="null") return null
  if(schema.type==="date") return new Date(val)
  if(schema.type==="array"){
    const result:unknown[] = []
    for(const [i, v] of (val as unknown[]).entries()){
      const r = recoveryData(v,(schema.children as Schema[])[i]);
      result.push(r)
    }
    return result
  }
  if(schema.type==="set"){
    const result:Set<unknown> = new Set()
    for(const [i, v] of (val as unknown[]).entries()){
      const r = recoveryData(v,(schema.children as Schema[])[i]);
      result.add(r)
    }
    return result
  }
  if(schema.type==="record"){
    const result:Record<string,unknown> = {}
    for(const [k, v] of Object.entries((val as Record<string,unknown>))){
      const r = recoveryData(v,(schema.children as Record<string, Schema>)[k]);
      result[k] =r
    }
    return result
  }
  if(schema.type==="map"){
    const result:Map<string,unknown> = new Map()
    for(const [k, v] of Object.entries((val as Record<string,unknown>))){
      const r = recoveryData(v,(schema.children as Record<string, Schema>)[k]);
      result.set(k,v)
    }
    return result
  }
  return val
}
