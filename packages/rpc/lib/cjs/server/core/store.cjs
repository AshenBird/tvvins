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

// src/server/core/store.ts
var store_exports = {};
__export(store_exports, {
  Store: () => Store
});
module.exports = __toCommonJS(store_exports);
var import_fs_extra = require("fs-extra");
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_process = require("node:process");
var import_nanoid = require("nanoid");
var Store = class {
  data = /* @__PURE__ */ new Map();
  _key;
  get key() {
    return this._key;
  }
  path = (0, import_node_path.join)((0, import_node_process.cwd)(), "node_modules/@tvvins/rpc/idStore.json");
  constructor() {
    const raw = (0, import_node_fs.existsSync)(this.path) ? JSON.parse((0, import_node_fs.readFileSync)(this.path, { encoding: "utf-8" })) : {
      key: (0, import_nanoid.nanoid)(),
      files: []
    };
    this._key = raw.key;
    for (const file of raw.files) {
      const { filename, apis } = file;
      const map = this.createApiMap();
      for (const { id, name } of apis) {
        map.set(name, { id, name });
      }
      this.data.set(filename, map);
    }
    this.save();
  }
  set(filename, name, id) {
    const file = this.data.get(filename);
    if (!file) {
      const map = this.createApiMap();
      map.set(name, { name, id });
      this.data.set(filename, map);
      this.save();
      return id;
    }
    file.set(name, { id, name });
    this.save();
    return id;
  }
  get(filename, name) {
    const file = this.data.get(filename);
    if (!file) {
      return;
    }
    const api = file.get(name);
    if (!api) {
      return;
    }
    return api.id;
  }
  empty() {
    this.data = /* @__PURE__ */ new Map();
    this._key = (0, import_nanoid.nanoid)();
    const raw = {
      key: (0, import_nanoid.nanoid)(),
      files: []
    };
    this._save(raw);
  }
  _save(raw) {
    (0, import_fs_extra.ensureFileSync)(this.path);
    (0, import_node_fs.writeFileSync)(this.path, JSON.stringify(raw), {
      encoding: "utf-8"
    });
  }
  save() {
    const raw = {
      key: this._key,
      files: []
    };
    for (const [filename, map] of this.data) {
      const file = {
        filename,
        apis: [...map.values()]
      };
      raw.files.push(file);
    }
    this._save(raw);
  }
  createApiMap() {
    return /* @__PURE__ */ new Map();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Store
});
