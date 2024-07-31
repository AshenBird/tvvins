import { Readable, Duplex, Transform } from "node:stream";

import { ServerResponse } from "http";
import { DATA, FILENAME, IDENTITY, TYPE } from "./const";
export const isReadableStream = (
  val: unknown
): val is Readable | Duplex | Transform => {
  return (
    val instanceof Readable || val instanceof Duplex || val instanceof Transform
  );
};

export const resHandle = (res: ServerResponse, result: unknown) => {

  // 可写流操作，可读流就过分了吧
  if (isReadableStream(result)) {
    res.setHeader("Content-Type", "application/octet-stream");
    result.pipe(res);
    result.on("end", () => {
      res.end();
    });
    return;
  }
  if (result && typeof result === "object" && Reflect.has(result, IDENTITY)) {
    refHandle(res, result)
    return
  }
  if (typeof result === "string") {
    res.setHeader("Content-Type", "text/plain");
    res.write(commonHandle(result));
  } else {
    // 大部分的值都用 json 返回
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(commonHandle(result)));
  }
  res.end()
};

const toRecord = (val: object) => {
  const result: Record<string | number | symbol, unknown> = {};
  for (const [k, v] of Object.entries(val)) {
    Reflect.set(result, k, commonHandle(v));
  }
  return result;
};
const cleanArray = (val: unknown[]) => {
  const result: unknown[] = []
  for (const v of val) {
    result.push(commonHandle(v))
  }
  return result
}

const bigIntHandle = (val: BigInt) => {
  return val.toString()
}

const mapToRecord = (val: Map<unknown, unknown>) => {
  const result: Record<string, unknown> = {}
  for (const [k, v] of val) {
    Reflect.set(result, Object.prototype.toString.bind(k)(), commonHandle(v))
  }
  return result
}
const setToArray = (val: Set<unknown>) => {
  const result: unknown[] = []
  for (const v of val) {
    result.push(commonHandle(v))
  }
  return result
}

const commonHandle = (val: unknown) => {
  if (typeof val === "bigint") return bigIntHandle(val);
  if (typeof val === "function") return null
  if (typeof val === "undefined") return null
  if (typeof val === "symbol") return val.description || "[symbol]"
  if (typeof val === "boolean") return val
  if (typeof val === "string") return val
  if (typeof val === "number" && isNaN(val)) return "NaN"
  if (typeof val === "number" && !isFinite(val)) return "Infinity"
  if (typeof val === "number") return val
  if (val === null) return val
  if (Array.isArray(val)) return cleanArray(val)
  if (val instanceof Map) return mapToRecord(val)
  if (val instanceof Set) return setToArray(val)

  if (val instanceof Date) return date2timestamp(val);
  return toRecord(val)
}

const date2timestamp = (val: Date) => {
  return val.getTime()
}
const refHandle = (res: ServerResponse, ref: object) => {
  const identity = Reflect.get(ref, IDENTITY)
  if (identity === "api") {
    res.end()
    return;
  }
  if (identity === "file") {
    fileHandle(res, ref)
    return;
  }

}
const fileHandle = (res: ServerResponse, ref: object) => {
  const type = Reflect.get(ref, TYPE) as string
  const stream = Reflect.get(ref, DATA) as Readable
  res.setHeader("Content-Type", type)
  stream.pipe(res)
  stream.on("end", () => {
    res.end();
  });
}

/**
 * 
 * @param val 
 * @param fileName 
 * @param type mime type 
 */
export const fileRef = (val: Readable, fileName: string, type: string) => {
  const ref = Object.create(null)
  Reflect.set(ref, DATA, val)
  Reflect.set(ref, FILENAME, fileName)
  Reflect.set(ref, TYPE, type)
  Reflect.set(ref, IDENTITY, "file")
  return ref
}