// src/client/index.ts
import { Bellman } from "@mcswift/bellman";
import { encode, decode } from "../common/data.mjs";
var utf8Decoder = new TextDecoder("utf8");
var byteToUTF8 = (bytes) => {
  const input = ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : bytes;
  return utf8Decoder.decode(input);
};
var sessionId = "";
var bellman = new Bellman();
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
    body: JSON.stringify(encode(payload))
  });
  const type = response.headers.get("content-type");
  if (type === "application/json") {
    if (!response.body)
      return "";
    const responseBody = JSON.parse(await textDecode(response.body));
    const { val, schema, isError = false } = responseBody;
    const r = decode(val, schema);
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
export {
  onResponseError,
  rpc
};
