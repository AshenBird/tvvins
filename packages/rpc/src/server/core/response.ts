import { Readable, Duplex, Transform } from "node:stream";

import { ServerResponse } from "http";
import { DATA, FILENAME, IDENTITY, TYPE } from "./const";
import { HandledResult, Schema } from "../../common/type";


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
  // 引用转义
  if (result && typeof result === "object" && Reflect.has(result, IDENTITY)) {
    refHandle(res, result);
    return;
  }
  
  // 大部分情况
  if (typeof result === "string") {
    // 这个情况已经基本不存在了
    res.setHeader("Content-Type", "text/plain");
    res.write(commonHandle(result));
  } else {
    // 大部分的值都用 json 返回
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(commonHandle(result)));
  }
  res.end();
};

const toRecord = (val: object) => {
  const result: Record<string | number | symbol, unknown> = {};
  const schemas: Record<string, Schema> = {};
  for (const [k, v] of Object.entries(val)) {
    const vr = commonHandle(v);
    if (!vr) continue;
    const { val: _v, schema } = vr;
    Reflect.set(result, k, commonHandle(_v));
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
const cleanArray = (val: unknown[]) => {
  const result: unknown[] = [];
  const schemas: Schema[] = [];
  for (const v of val) {
    const vr = commonHandle(v);
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

const bigIntHandle = (val: BigInt) => {
  const r: HandledResult<string> = {
    schema: {
      type: "bigint",
    },
    val: val.toString(),
  };
  return r;
};

const mapToRecord = (val: Map<unknown, unknown>) => {
  const result: Record<string, unknown> = {};
  const schemas: Record<string, Schema> = {};
  for (const [k, v] of val) {
    const vr = commonHandle(v);
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
};
const setToArray = (val: Set<unknown>) => {
  const result: unknown[] = [];
  const schemas: Schema[] = [];
  for (const v of val) {
    const vr = commonHandle(v);
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

const commonHandle = (
  val: unknown
): { val: unknown; schema: Schema } | null => {
  if (typeof val === "bigint") return bigIntHandle(val);
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
  if (Array.isArray(val)) return cleanArray(val);
  if (val instanceof Map) return mapToRecord(val);
  if (val instanceof Set) return setToArray(val);

  if (val instanceof Date) return date2timestamp(val);
  return toRecord(val);
};

const date2timestamp = (val: Date) => {
  return {
    val: val.getTime(),
    schema: {
      type: "date" as const,
    },
  };
};
const refHandle = (res: ServerResponse, ref: object) => {
  const identity = Reflect.get(ref, IDENTITY);
  if (identity === "api") {
    res.end();
    return;
  }
  if (identity === "file") {
    fileHandle(res, ref);
    return;
  }
};
const fileHandle = (res: ServerResponse, ref: object) => {
  const type = Reflect.get(ref, TYPE) as string;
  const stream = Reflect.get(ref, DATA) as Readable;
  res.setHeader("Content-Type", type);
  stream.pipe(res);
  stream.on("end", () => {
    res.end();
  });
};

/**
 *
 * @param val
 * @param fileName
 * @param type mime type
 */
export const fileRef = (val: Readable, fileName: string, type: string) => {
  const ref = Object.create(null);
  Reflect.set(ref, DATA, val);
  Reflect.set(ref, FILENAME, fileName);
  Reflect.set(ref, TYPE, type);
  Reflect.set(ref, IDENTITY, "file");
  return ref;
};
