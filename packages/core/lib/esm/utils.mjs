// src/utils.ts
var valueType = ["string", "number", "boolean", "symbol"];
var mergeRecord = (a, b) => {
  const r = {};
  for (const [k, v] of Object.entries(a)) {
    r[k] = v;
  }
  for (const [k, v] of Object.entries(b)) {
    if (!v)
      continue;
    if (!r[k]) {
      r[k] = v;
      continue;
    }
    const typeA = typeof r[k];
    const typeB = typeof v;
    if (typeA !== typeB) {
      r[k] = v;
      continue;
    }
    if (valueType.includes(typeA)) {
      r[k] = v;
      continue;
    }
    if (typeof r[k] === "function") {
      r[k] = v;
      continue;
    }
    if (typeof r[k] === "object") {
      if (Array.isArray(r[k]) && Array.isArray(v)) {
        r[k] = mergeArray(r[k], v);
        continue;
      }
      if (Array.isArray(r[k]) || Array.isArray(v)) {
        r[k] = v;
        continue;
      }
      try {
        r[k] = mergeRecord(
          r[k],
          v
        );
      } catch {
        r[k] = v;
      }
    }
  }
  return r;
};
var mergeArray = (a, b) => {
  return [...a, ...b];
};
export {
  mergeArray,
  mergeRecord
};
