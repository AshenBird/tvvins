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

// src/server/core/error.ts
var error_exports = {};
__export(error_exports, {
  createErrorResult: () => createErrorResult
});
module.exports = __toCommonJS(error_exports);
var createErrorResult = (code, message, e) => {
  return {
    code,
    message,
    stack: e.stack || new Error().stack,
    rawMessage: e.message
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createErrorResult
});
