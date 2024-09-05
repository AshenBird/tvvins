// src/server/core/session.ts
var Session = class {
  constructor(id) {
    this.id = id;
  }
  map = /* @__PURE__ */ new Map();
  get(key) {
    return this.map.get(key);
  }
  set(key, value) {
    this.map.set(key, value);
    return value;
  }
  clear() {
    return this.map.clear();
  }
  delete(key) {
    return this.map.delete(key);
  }
};
export {
  Session
};
