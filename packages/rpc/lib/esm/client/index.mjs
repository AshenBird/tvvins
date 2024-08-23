// src/client/index.ts
import { Bellman } from "@mcswift/bellman";
var utf8Decoder = new TextDecoder("utf8");
var byteToUTF8 = (bytes) => {
  const input = ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : bytes;
  return utf8Decoder.decode(input);
};
var sessionId = "";
var bellman = new Bellman();
var lock = false;
var rpc = async (payload, id, url) => {
  if (bellman.status === "padding" && lock) {
    console.debug(1);
    await bellman.signal;
  } else if (!sessionId) {
    console.debug(2);
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
  console.debug(3);
  const rt = getPayloadType(payload);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-tvvins-rpc-id": id,
      "content-type": rt,
      "x-tvvins-rpc-session-id": sessionId
    },
    body: rt === "application/json" ? JSON.stringify(payload) : payload
  });
  const type = response.headers.get("content-type");
  if (type === "application/json") {
    if (!response.body)
      return "";
    const responseBody = JSON.parse(await textDecode(response.body));
    const { val, schema, isError = false } = responseBody;
    const r = recoveryData(val, schema);
    if (isError) {
      console.error(val.message);
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
  if (typeof val === "string")
    return "text/plain";
  return "application/json";
};
var directTypes = [
  "string",
  "number",
  "boolean"
];
var recoveryData = (val, schema) => {
  if (directTypes.includes(schema.type))
    return val;
  if (schema.type === "bigint")
    return BigInt(val);
  if (schema.type === "symbol")
    return val ? Symbol.for(val) : Symbol();
  if (schema.type === "NaN")
    return NaN;
  if (schema.type === "Infinity")
    return Infinity;
  if (schema.type === "null")
    return null;
  if (schema.type === "date")
    return new Date(val);
  if (schema.type === "array") {
    const result = [];
    for (const [i, v] of val.entries()) {
      const r = recoveryData(v, schema.children[i]);
      result.push(r);
    }
    return result;
  }
  if (schema.type === "set") {
    const result = /* @__PURE__ */ new Set();
    for (const [i, v] of val.entries()) {
      const r = recoveryData(v, schema.children[i]);
      result.add(r);
    }
    return result;
  }
  if (schema.type === "record") {
    const result = {};
    for (const [k, v] of Object.entries(val)) {
      const r = recoveryData(v, schema.children[k]);
      result[k] = r;
    }
    return result;
  }
  if (schema.type === "map") {
    const result = /* @__PURE__ */ new Map();
    for (const [k, v] of Object.entries(val)) {
      const r = recoveryData(v, schema.children[k]);
      result.set(k, v);
    }
    return result;
  }
  return val;
};
export {
  rpc
};
