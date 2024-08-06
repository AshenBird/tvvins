// src/client/index.ts
var utf8Decoder = new TextDecoder("utf8");
var byteToUTF8 = (bytes) => {
  const input = ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : bytes;
  return utf8Decoder.decode(input);
};
var rpc = async (payload, id, url) => {
  const rt = getPayloadType(payload);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-tvvins-rpc-id": id,
      "content-type": rt
    },
    body: rt === "application/json" ? JSON.stringify(payload) : payload
  });
  const type = response.headers.get("content-type");
  if (type === "application/json") {
    if (!response.body)
      return "";
    const responseBody = JSON.parse(await textDecode(response.body));
    const { val, schema } = responseBody;
    return recoveryData(val, schema);
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
