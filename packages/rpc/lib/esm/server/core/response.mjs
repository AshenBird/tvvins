// src/server/core/response.ts
import { Readable, Duplex, Transform } from "node:stream";
import { DATA, FILENAME, IDENTITY, TYPE } from "./const.mjs";
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
    res.write(commonHandle(result));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ ...commonHandle(result), isError }));
  }
  res.end();
};
var toRecord = (val) => {
  const result = {};
  const schemas = {};
  for (const [k, v] of Object.entries(val)) {
    const vr = commonHandle(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    Reflect.set(result, k, _v);
    Reflect.set(schemas, k, schema);
  }
  return {
    val: result,
    schema: {
      type: "record",
      children: schemas
    }
  };
};
var cleanArray = (val) => {
  const result = [];
  const schemas = [];
  for (const v of val) {
    const vr = commonHandle(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    result.push(_v);
    schemas.push(schema);
  }
  return {
    val: result,
    schema: {
      type: "array",
      children: schemas
    }
  };
};
var bigIntHandle = (val) => {
  const r = {
    schema: {
      type: "bigint"
    },
    val: val.toString()
  };
  return r;
};
var mapToRecord = (val) => {
  const result = {};
  const schemas = {};
  for (const [k, v] of val) {
    const vr = commonHandle(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    Reflect.set(result, Object.prototype.toString.bind(k)(), _v);
    Reflect.set(schemas, Object.prototype.toString.bind(k)(), schema);
  }
  return {
    val: result,
    schema: {
      type: "map",
      children: schemas
    }
  };
};
var setToArray = (val) => {
  const result = [];
  const schemas = [];
  for (const v of val) {
    const vr = commonHandle(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    result.push(_v);
    schemas.push(schema);
  }
  return {
    val: result,
    schema: {
      type: "set",
      children: schemas
    }
  };
};
var commonHandle = (val) => {
  if (typeof val === "bigint")
    return bigIntHandle(val);
  if (typeof val === "function")
    return null;
  if (typeof val === "undefined")
    return null;
  if (typeof val === "symbol")
    return { val: val.description || "[symbol]", schema: { type: "symbol" } };
  if (typeof val === "boolean")
    return { val, schema: { type: "boolean" } };
  if (typeof val === "string")
    return { val, schema: { type: "string" } };
  if (typeof val === "number" && isNaN(val))
    return { val: "NaN", schema: { type: "NaN" } };
  if (typeof val === "number" && !isFinite(val))
    return { val: "Infinity", schema: { type: "Infinity" } };
  if (typeof val === "number")
    return { val, schema: { type: "number" } };
  if (val === null)
    return { val, schema: { type: "null" } };
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
  return {
    val: val.getTime(),
    schema: {
      type: "date"
    }
  };
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
