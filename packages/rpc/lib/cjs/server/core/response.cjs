"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/core/response.ts
var response_exports = {};
__export(response_exports, {
  fileRef: () => fileRef,
  isReadableStream: () => isReadableStream,
  resHandle: () => resHandle
});
module.exports = __toCommonJS(response_exports);
var import_node_stream = require("node:stream");
var import_const = require("./const.cjs");
var import_data = require("../../common/data.cjs");
var isReadableStream = (val) => {
  return val instanceof import_node_stream.Readable || val instanceof import_node_stream.Duplex || val instanceof import_node_stream.Transform;
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
  if (result && typeof result === "object" && Reflect.has(result, import_const.IDENTITY)) {
    refHandle(res, result);
    return;
  }
  if (typeof result === "string") {
    res.setHeader("Content-Type", "text/plain");
    res.write((0, import_data.encode)(result));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ ...(0, import_data.encode)(result), isError }));
  }
  res.end();
};
var refHandle = (res, ref) => {
  const identity = Reflect.get(ref, import_const.IDENTITY);
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
  const type = Reflect.get(ref, import_const.TYPE);
  const stream = Reflect.get(ref, import_const.DATA);
  res.setHeader("Content-Type", type);
  stream.pipe(res);
  stream.on("end", () => {
    res.end();
  });
};
var fileRef = (val, fileName, type) => {
  const ref = /* @__PURE__ */ Object.create(null);
  Reflect.set(ref, import_const.DATA, val);
  Reflect.set(ref, import_const.FILENAME, fileName);
  Reflect.set(ref, import_const.TYPE, type);
  Reflect.set(ref, import_const.IDENTITY, "file");
  return ref;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fileRef,
  isReadableStream,
  resHandle
});
