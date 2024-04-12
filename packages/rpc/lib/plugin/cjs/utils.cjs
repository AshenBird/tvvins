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

// src/plugin/utils.ts
var utils_exports = {};
__export(utils_exports, {
  transform: () => transform
});
module.exports = __toCommonJS(utils_exports);
var import_api = require("../server/core/api.cjs");
var import_node_url = require("node:url");
var import_const = require("../server/core/const.cjs");
var codeGen = (code, id, methods) => {
  let result = `
    import {rpc} from "@tvvins/rpc/client";
  `;
  for (const [key, name] of Object.entries(methods)) {
    result += `
      export const ${name} = async (payload)=>{
        return await rpc(payload,"${key}","/rpc")
      };
    `;
  }
  return result;
};
var transform = async (code, id) => {
  const url = (0, import_node_url.pathToFileURL)(id);
  const apiList = await import(url.toString());
  const result = {};
  for (const [k, API] of Object.entries(apiList)) {
    if (!(0, import_api.isAPI)(API))
      continue;
    result[Reflect.get(API, import_const.ID)] = k;
  }
  if (!Object.keys(result).length)
    return code;
  return codeGen(code, id, result);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transform
});
