// src/server/core/store.ts
import { ensureFileSync } from "fs-extra";
import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { nanoid } from "nanoid";
var Store = class {
  data = /* @__PURE__ */ new Map();
  _key;
  get key() {
    return this._key;
  }
  path = join(cwd(), "node_modules/@tvvins/rpc/idStore.json");
  constructor() {
    const raw = existsSync(this.path) ? JSON.parse(readFileSync(this.path, { encoding: "utf-8" })) : {
      key: nanoid(),
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
    this._key = nanoid();
    const raw = {
      key: nanoid(),
      files: []
    };
    this._save(raw);
  }
  _save(raw) {
    ensureFileSync(this.path);
    writeFileSync(this.path, JSON.stringify(raw), {
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
export {
  Store
};
