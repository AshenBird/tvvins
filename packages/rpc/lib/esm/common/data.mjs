// src/common/data.ts
var directTypes = [
  "string",
  "number",
  "boolean"
];
var decode = (val, schema) => {
  if (directTypes.includes(schema.type))
    return val;
  if (schema.type === "bigint")
    return BigInt(val);
  if (schema.type === "symbol")
    return val ? Symbol.for(val) : Symbol();
  if (schema.type === "NaN")
    return NaN;
  if (schema.type === "Infinity")
    return Infinity;
  if (schema.type === "null")
    return null;
  if (schema.type === "date")
    return new Date(val);
  if (schema.type === "array") {
    const result = [];
    for (const [i, v] of val.entries()) {
      const r = decode(v, schema.children[i]);
      result.push(r);
    }
    return result;
  }
  if (schema.type === "set") {
    const result = /* @__PURE__ */ new Set();
    for (const [i, v] of val.entries()) {
      const r = decode(v, schema.children[i]);
      result.add(r);
    }
    return result;
  }
  if (schema.type === "record") {
    const result = {};
    for (const [k, v] of Object.entries(val)) {
      const r = decode(v, schema.children[k]);
      result[k] = r;
    }
    return result;
  }
  if (schema.type === "map") {
    const result = /* @__PURE__ */ new Map();
    for (const [k, v] of Object.entries(val)) {
      const r = decode(v, schema.children[k]);
      result.set(k, v);
    }
    return result;
  }
  return val;
};
var encode = (val) => {
  if (typeof val === "bigint")
    return bigIntEncode(val);
  if (typeof val === "function")
    return null;
  if (typeof val === "undefined")
    return null;
  if (typeof val === "symbol")
    return { val: val.description || "[symbol]", schema: { type: "symbol" } };
  if (typeof val === "boolean")
    return { val, schema: { type: "boolean" } };
  if (typeof val === "string")
    return { val, schema: { type: "string" } };
  if (typeof val === "number" && isNaN(val))
    return { val: "NaN", schema: { type: "NaN" } };
  if (typeof val === "number" && !isFinite(val))
    return { val: "Infinity", schema: { type: "Infinity" } };
  if (typeof val === "number")
    return { val, schema: { type: "number" } };
  if (val === null)
    return { val, schema: { type: "null" } };
  if (Array.isArray(val))
    return arrayEncode(val);
  if (val instanceof Map)
    return mapEncode(val);
  if (val instanceof Set)
    return setEncode(val);
  if (val instanceof Date)
    return dateEncode(val);
  return encodeRecord(val);
};
var bigIntEncode = (val) => {
  const r = {
    schema: {
      type: "bigint"
    },
    val: val.toString()
  };
  return r;
};
var arrayEncode = (val) => {
  const result = [];
  const schemas = [];
  for (const v of val) {
    const vr = encode(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    result.push(_v);
    schemas.push(schema);
  }
  return {
    val: result,
    schema: {
      type: "array",
      children: schemas
    }
  };
};
var mapEncode = (val) => {
  const result = {};
  const schemas = {};
  for (const [k, v] of val) {
    const vr = encode(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    Reflect.set(result, Object.prototype.toString.bind(k)(), _v);
    Reflect.set(schemas, Object.prototype.toString.bind(k)(), schema);
  }
  return {
    val: result,
    schema: {
      type: "map",
      children: schemas
    }
  };
};
var setEncode = (val) => {
  const result = [];
  const schemas = [];
  for (const v of val) {
    const vr = encode(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    result.push(_v);
    schemas.push(schema);
  }
  return {
    val: result,
    schema: {
      type: "set",
      children: schemas
    }
  };
};
var dateEncode = (val) => {
  return {
    val: val.getTime(),
    schema: {
      type: "date"
    }
  };
};
var encodeRecord = (val) => {
  const result = {};
  const schemas = {};
  for (const [k, v] of Object.entries(val)) {
    const vr = encode(v);
    if (!vr)
      continue;
    const { val: _v, schema } = vr;
    Reflect.set(result, k, _v);
    Reflect.set(schemas, k, schema);
  }
  return {
    val: result,
    schema: {
      type: "record",
      children: schemas
    }
  };
};
export {
  decode,
  encode
};
