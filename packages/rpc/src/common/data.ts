import { HandledResult, Schema } from "./type";

const directTypes = [
  "string",
  "number",
  "boolean",
]
export const decode =(val:any, schema:Schema)=>{
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
      const r = decode(v,(schema.children as Schema[])[i]);
      result.push(r)
    }
    return result
  }
  if(schema.type==="set"){
    const result:Set<unknown> = new Set()
    for(const [i, v] of (val as unknown[]).entries()){
      const r = decode(v,(schema.children as Schema[])[i]);
      result.add(r)
    }
    return result
  }
  if(schema.type==="record"){
    const result:Record<string,unknown> = {}
    for(const [k, v] of Object.entries((val as Record<string,unknown>))){
      const r = decode(v,(schema.children as Record<string, Schema>)[k]);
      result[k] =r
    }
    return result
  }
  if(schema.type==="map"){
    const result:Map<string,unknown> = new Map()
    for(const [k, v] of Object.entries((val as Record<string,unknown>))){
      const r = decode(v,(schema.children as Record<string, Schema>)[k]);
      result.set(k,v)
    }
    return result
  }
  return val
}
export const encode =(
  val: unknown
): { val: unknown; schema: Schema } | null => {
  if (typeof val === "bigint") return bigIntEncode(val);
  if (typeof val === "function") return null;
  if (typeof val === "undefined") return null;
  if (typeof val === "symbol")
    return { val: val.description || "[symbol]", schema: { type: "symbol" } };
  if (typeof val === "boolean") return { val, schema: { type: "boolean" } };
  if (typeof val === "string") return { val, schema: { type: "string" } };
  if (typeof val === "number" && isNaN(val))
    return { val: "NaN", schema: { type: "NaN" } };
  if (typeof val === "number" && !isFinite(val))
    return { val: "Infinity", schema: { type: "Infinity" } };
  if (typeof val === "number") return { val, schema: { type: "number" } };
  if (val === null) return { val, schema: { type: "null" } };
  if (Array.isArray(val)) return arrayEncode(val);
  if (val instanceof Map) return mapEncode(val);
  if (val instanceof Set) return setEncode(val);
  if (val instanceof Date) return dateEncode(val);
  return encodeRecord(val);
};
const bigIntEncode = (val: BigInt) => {
  const r: HandledResult<string> = {
    schema: {
      type: "bigint",
    },
    val: val.toString(),
  };
  return r;
};
const arrayEncode = (val: unknown[]) => {
  const result: unknown[] = [];
  const schemas: Schema[] = [];
  for (const v of val) {
    const vr = encode(v);
    if (!vr) continue;
    const { val: _v, schema } = vr;
    result.push(_v);
    schemas.push(schema);
  }
  return {
    val: result,
    schema: {
      type: "array" as const,
      children: schemas,
    },
  };
};
const mapEncode = (val: Map<unknown, unknown>) => {
  const result: Record<string, unknown> = {};
  const schemas: Record<string, Schema> = {};
  for (const [k, v] of val) {
    const vr = encode(v);
    if (!vr) continue;
    const { val: _v, schema } = vr;
    Reflect.set(result, Object.prototype.toString.bind(k)(), _v);
    Reflect.set(schemas, Object.prototype.toString.bind(k)(), schema);
  }
  return {
    val: result,
    schema: {
      type: "map" as const,
      children: schemas,
    },
  };
}
const setEncode = (val: Set<unknown>) => {
  const result: unknown[] = [];
  const schemas: Schema[] = [];
  for (const v of val) {
    const vr = encode(v);
    if (!vr) continue;
    const { val: _v, schema } = vr;
    result.push(_v);
    schemas.push(schema);
  }
  return {
    val: result,
    schema: {
      type: "set" as const,
      children: schemas,
    },
  };
};
const dateEncode = (val: Date) => {
  return {
    val: val.getTime(),
    schema: {
      type: "date" as const,
    },
  };
};
const encodeRecord = (val: object) => {
  const result: Record<string | number | symbol, unknown> = {};
  const schemas: Record<string, Schema> = {};
  for (const [k, v] of Object.entries(val)) {
    const vr = encode(v);
    if (!vr) continue;
    const { val: _v, schema } = vr;
    Reflect.set(result, k, _v);
    Reflect.set(schemas, k, schema);
  }
  return {
    val: result,
    schema: {
      type: "record" as const,
      children: schemas,
    },
  };
};