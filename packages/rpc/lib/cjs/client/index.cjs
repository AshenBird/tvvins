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

// src/client/index.ts
var client_exports = {};
__export(client_exports, {
  onResponseError: () => onResponseError,
  rpc: () => rpc
});
module.exports = __toCommonJS(client_exports);
var import_bellman = require("@mcswift/bellman");
var import_data = require("../common/data.cjs");
var utf8Decoder = new TextDecoder("utf8");
var byteToUTF8 = (bytes) => {
  const input = ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : bytes;
  return utf8Decoder.decode(input);
};
var sessionId = "";
var bellman = new import_bellman.Bellman();
var lock = false;
var responseErrorHooks = /* @__PURE__ */ new Map();
var onResponseError = (hook) => {
  const id = Symbol();
  responseErrorHooks.set(id, hook);
  return () => {
    responseErrorHooks.delete(id);
  };
};
var rpc = async (payload, id, url, times = 0) => {
  if (bellman.status === "padding" && lock) {
    await bellman.signal;
  } else if (!sessionId) {
    lock = true;
    const r = await fetch(url + "/session", {
      method: "POST"
    });
    const sid = r.headers.get("x-tvvins-rpc-session-id");
    if (!sid) {
      const err = new Error("can't get sessionId");
      bellman.reject(err);
      throw err;
    }
    bellman.resolve();
    sessionId = sid;
    lock = false;
  }
  const rt = getPayloadType(payload);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-tvvins-rpc-id": id,
      "content-type": rt,
      "x-tvvins-rpc-session-id": sessionId
    },
    body: JSON.stringify((0, import_data.encode)(payload))
  });
  const type = response.headers.get("content-type");
  if (type === "application/json") {
    if (!response.body)
      return "";
    const responseBody = JSON.parse(await textDecode(response.body));
    const { val, schema, isError = false } = responseBody;
    const r = (0, import_data.decode)(val, schema);
    if (isError) {
      console.debug(r);
      console.error(r.message);
      for (const errorHook of responseErrorHooks.values()) {
        const errorResult = await errorHook(r);
        if (typeof errorResult === "boolean") {
          if (errorResult)
            continue;
          return r;
        }
        if (errorResult === "continue")
          continue;
        if (errorResult === "break")
          continue;
        if (times >= 10)
          continue;
        return await rpc(payload, id, url, times + 1);
      }
    }
    return r;
  }
  if (type === "text/plain") {
    if (!response.body)
      return "";
    return await textDecode(response.body);
  }
  return response.body;
};
var textDecode = async (body) => {
  const result = [];
  const reader = body.getReader();
  for (; ; ) {
    if (!reader)
      return null;
    const frame = await reader.read();
    if (frame.value) {
      const raw = byteToUTF8(frame.value);
      result.push(raw);
    }
    if (frame.done)
      break;
  }
  return result.join(" ");
};
var getPayloadType = (val) => {
  if (val.some((arg) => arg instanceof FormData)) {
    if (val.length > 1) {
      throw new Error("API accept only one param when use formdata param.");
    }
    return "FormData";
  }
  return "application/json";
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  onResponseError,
  rpc
});
