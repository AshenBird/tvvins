// src/server/core/response.ts
import { Readable, Duplex, Transform } from "node:stream";
import { DATA, FILENAME, IDENTITY, TYPE } from "./const.mjs";
var isReadableStream = (val) => {
  return val instanceof Readable || val instanceof Duplex || val instanceof Transform;
};
var resHandle = (res, result) => {
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
    res.write(commonHandle(result));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(commonHandle(result)));
  }
  res.end();
};
var toRecord = (val) => {
  const result = {};
  for (const [k, v] of Object.entries(val)) {
    Reflect.set(result, k, commonHandle(v));
  }
  return result;
};
var cleanArray = (val) => {
  const result = [];
  for (const v of val) {
    result.push(commonHandle(v));
  }
  return result;
};
var bigIntHandle = (val) => {
  return val.toString();
};
var mapToRecord = (val) => {
  const result = {};
  for (const [k, v] of val) {
    Reflect.set(result, Object.prototype.toString.bind(k)(), commonHandle(v));
  }
  return result;
};
var setToArray = (val) => {
  const result = [];
  for (const v of val) {
    result.push(commonHandle(v));
  }
  return result;
};
var commonHandle = (val) => {
  if (typeof val === "bigint")
    return bigIntHandle(val);
  if (typeof val === "function")
    return null;
  if (typeof val === "undefined")
    return null;
  if (typeof val === "symbol")
    return val.description || "[symbol]";
  if (typeof val === "boolean")
    return val;
  if (typeof val === "string")
    return val;
  if (typeof val === "number" && isNaN(val))
    return "NaN";
  if (typeof val === "number" && !isFinite(val))
    return "Infinity";
  if (typeof val === "number")
    return val;
  if (val === null)
    return val;
  if (Array.isArray(val))
    return cleanArray(val);
  if (val instanceof Map)
    return mapToRecord(val);
  if (val instanceof Set)
    return setToArray(val);
  if (val instanceof Date)
    return date2timestamp(val);
  return toRecord(val);
};
var date2timestamp = (val) => {
  return val.getTime();
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
