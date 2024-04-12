const utf8Decoder = new TextDecoder('utf8')
const byteToUTF8 = (bytes: Uint8Array | ArrayBufferView) => {
  const input = ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : bytes
  return utf8Decoder.decode(input)
}

export const rpc = async (payload: any, id: string, url: string) => {
  const rt = getPayloadType(payload)
  const response =await fetch(url, {
    method: "POST",
    headers: { 
      "x-tvvins-rpc-id": id,
      "content-type":rt
    },
    body: rt==="application/json"?JSON.stringify(payload):payload,
  });
  const type = response.headers.get("content-type")
  
  if(type==="application/json"){
    if(!response.body)return ""
    return JSON.parse(await textDecode(response.body))
  }
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
