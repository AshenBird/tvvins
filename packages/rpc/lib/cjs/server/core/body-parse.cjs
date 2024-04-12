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

// src/server/core/body-parse.ts
var body_parse_exports = {};
__export(body_parse_exports, {
  BodyParserManager: () => BodyParserManager,
  bodyParse: () => bodyParse
});
module.exports = __toCommonJS(body_parse_exports);
var import_error = require("./error.cjs");
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
      data: (0, import_error.createErrorResult)(400, "please use right json ", err)
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
        data: (0, import_error.createErrorResult)(400, "request parse error", e)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BodyParserManager,
  bodyParse
});
