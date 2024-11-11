import { Readable, Duplex, Transform } from "node:stream";

import { ServerResponse } from "http";
import { DATA, FILENAME, IDENTITY, TYPE } from "./const";
import { encode } from "../../common/data";


export const isReadableStream = (
  val: unknown
): val is Readable | Duplex | Transform => {
  return (
    val instanceof Readable || val instanceof Duplex || val instanceof Transform
  );
};

export const resHandle = (res: ServerResponse, result: unknown,isError = false) => {
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
    res.write(JSON.stringify(encode(result)));
  } else {
    // 大部分的值都用 json 返回
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({...encode(result),isError}));
  }
  res.end();
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
