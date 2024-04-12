// src/server/core/body-parse.ts
import { createErrorResult } from "./error.mjs";
var bodyParse = async (req) => {
  const type = req.headers["content-type"];
  if (!type)
    return {
      error: false,
      data: req
    };
  const parser = handleTypes[type];
  if (!parser)
    return {
      error: false,
      data: req
    };
  return parser(req);
};
var jsonHandle = async (req) => {
  const textResult = await textHandle(req);
  if (textResult.error)
    return textResult;
  try {
    return {
      error: false,
      data: JSON.parse(textResult.data)
    };
  } catch (err) {
    return {
      error: true,
      data: createErrorResult(400, "please use right json ", err)
    };
  }
};
var textHandle = (req) => {
  const chunks = [];
  req.setEncoding("utf-8");
  return new Promise((resolve) => {
    req.on("readable", () => {
      let chunk;
      while (null !== (chunk = req.read())) {
        chunks.push(chunk);
      }
    });
    req.on("error", (e) => {
      resolve({
        error: true,
        data: createErrorResult(400, "request parse error", e)
      });
    });
    req.on("end", () => {
      const data = chunks.join("");
      resolve({
        error: false,
        data
      });
    });
  });
};
var handleTypes = {
  "application/json": jsonHandle,
  "text/plain": textHandle
};
var BodyParserManager = Object.freeze({
  registry: (mime, parser) => {
    if (Reflect.has(handleTypes, mime)) {
      return false;
    }
    Reflect.set(handleTypes, mime, parser);
    return true;
  },
  has: (mime) => {
    return Reflect.has(handleTypes, mime);
  },
  get: (mime) => {
    return Reflect.get(handleTypes, mime);
  }
});
export {
  BodyParserManager,
  bodyParse
};
