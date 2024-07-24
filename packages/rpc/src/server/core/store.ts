import { ensureFileSync } from "fs-extra";
import { existsSync, writeFileSync,readFileSync } from "node:fs";
import { IDStore } from "../type";
import { join } from "node:path";
import { cwd } from "node:process";
import { nanoid } from "nanoid";

export class Store {
  private data = new Map<string, Map<string, { id: string; name: string }>>();
  private _key: string;
  get key() {
    return this._key;
  }
  private readonly path = join(cwd(), "node_modules/@tvvins/rpc/idStore.json");
  constructor() {
    const raw: IDStore = existsSync(this.path)
      ? (JSON.parse(readFileSync(this.path,{encoding:"utf-8"})) as IDStore)
      : {
          key: nanoid(),
          files: [],
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
  }
  get(filename: string, name: string) {
    const file = this.data.get(filename);
    if (!file) {
      const map = this.createApiMap();
      const id = nanoid();
      map.set(name, { name, id });
      this.data.set(filename, new Map());
      return id;
    }
    const api = file.get(name);
    if (!api) {
      const id = nanoid();
      file.set(name, { id, name });
      return;
    }
  }
  empty() {
    this.data = new Map();
    this._key = nanoid();
    const raw: IDStore = {
      key: nanoid(),
      files: [],
    };
    this._save(raw);
  }
  private _save(raw: IDStore) {
    ensureFileSync(this.path);
    writeFileSync(this.path, JSON.stringify(raw), {
      encoding: "utf-8",
    });
  }
  save() {
    const raw: IDStore = {
      key: nanoid(),
      files: [],
    };
    for (const [filename, map] of this.data) {
      const file = {
        filename,
        apis: [...map.values()],
      };
      raw.files.push(file)
    }
    this._save(raw)
  }
  private createApiMap() {
    return new Map<string, { id: string; name: string }>();
  }
}
