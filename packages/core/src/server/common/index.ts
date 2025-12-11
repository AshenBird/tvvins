const directed = ["string", "number", "boolean"]
export const deepJSONObject = (val: any, indent = 0):any => {
  if(directed.includes(typeof val))return val;
  if(!val)return undefined;
  if(val instanceof Date)return val.getTime();
  if(Array.isArray(val))return val.map((v)=>deepJSONObject(v, indent))
  if(typeof val === "function"){
    return val.toString()
  }
  if(typeof val === "object"){
    const result:any = {}
    for(const [ k ,v] of Object.entries(val)){
      result[k]=deepJSONObject(v, indent)
    }
    return result
  }
  return val
}
export const createResult = (val: any,message="success") => {
  return {
    result: deepJSONObject(val),
    message,
    code:200
  }
}
export const createError = (message="error",code=500,stack:string[]=[]) => {
  return {
    result: stack,
    message,
    code
  }
}
