// src/server/core/response.ts
import { Readable, Duplex, Transform } from "node:stream";
import { DATA, FILENAME, IDENTITY, TYPE } from "./const.mjs";
import { encode } from "../../common/data.mjs";
var isReadableStream = (val) => {
  return val instanceof Readable || val instanceof Duplex || val instanceof Transform;
};
var resHandle = (res, result, isError = false) => {
  if (isReadableStream(result)) {
    res.setHeader("Content-Type", "application/octet-stream");
    result.pipe(res);
    result.on("end", () => {
      res.end();
    });
    return;
  }
  if (result && typeof result === "object" && Reflect.has(result, IDENTITY)) {
    refHandle(res, result);
    return;
  }
  if (typeof result === "string") {
    res.setHeader("Content-Type", "text/plain");
    res.write(JSON.stringify(encode(result)));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ ...encode(result), isError }));
  }
  res.end();
};
var refHandle = (res, ref) => {
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
var fileHandle = (res, ref) => {
  const type = Reflect.get(ref, TYPE);
  const stream = Reflect.get(ref, DATA);
  res.setHeader("Content-Type", type);
  stream.pipe(res);
  stream.on("end", () => {
    res.end();
  });
};
var fileRef = (val, fileName, type) => {
  const ref = /* @__PURE__ */ Object.create(null);
  Reflect.set(ref, DATA, val);
  Reflect.set(ref, FILENAME, fileName);
  Reflect.set(ref, TYPE, type);
  Reflect.set(ref, IDENTITY, "file");
  return ref;
};
export {
  fileRef,
  isReadableStream,
  resHandle
};
