import { IncomingMessage } from "http"
import { createErrorResult } from "./error"
import { BodyParseResult, type BodyParser } from "../type"
import { JSONValue } from "@mcswift/types"
/**
 * body 中接受的数据类型
 * 1. application/json 进行解析，并返回解析后的数据
 * 2. formdata
 * 3. 
 * 4. text/plain 解析为
 */
export const bodyParse = async (req:IncomingMessage)=>{
  const type = req.headers['content-type']
  if(!type)return req
  const parser = handleTypes[type]
  if(!parser)return req
  return parser(req)
}

const jsonHandle = async (req:IncomingMessage):Promise<BodyParseResult<JSONValue>>=>{
  const textResult = await textHandle(req)
  if(textResult.error)return textResult
  try{
    return {
      error:false,
      data:JSON.parse(textResult.data)
    }
  }catch(err) {
    return {
      error:true,
      data:createErrorResult(400,"please use right json ",err as Error)
    }
  }
}
const textHandle = (req:IncomingMessage):Promise<BodyParseResult<string>>=>{
  const chunks:string[] = []
  req.setEncoding("utf-8");
  return new Promise<BodyParseResult<string>>((resolve)=>{
    req.on('readable', () => {
      let chunk;
      while (null !== (chunk = req.read())) {
        chunks.push(chunk);
      }
    });
    req.on("error",(e)=>{
      resolve({
        error:true,
        data:createErrorResult(400,"request parse error",e)
      })
    })
    req.on('end', () => {
      const data = chunks.join('');
      resolve({
        error:false,
        data
      })
    });
})
}

const handleTypes:Record<string,(req:IncomingMessage)=>Promise<BodyParseResult>>= {
  "application/json":jsonHandle,
  "text/plain":textHandle
}

export const BodyParserManager = Object.freeze({
  registry:(mime:string,parser:BodyParser)=>{
    if(Reflect.has(handleTypes,mime)){
      return false
    }
    Reflect.set(handleTypes,mime,parser)
    return true
  },
  has:(mime:string)=>{
    return Reflect.has(handleTypes,mime)
  },
  get:(mime:string)=>{
    return Reflect.get(handleTypes,mime)
  }
})

// "application/octet-stream",//通用二进制数据，不做处理直接交给