const valueType = ["string", "number", "boolean", "symbol"];

// 暂时没支持 map 和 set
export const mergeRecord = <
  T extends Record<string, unknown>,
  S extends Record<string, unknown>
>(
  a: T,
  b: S
) => {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(a)) {
    r[k] = v;
  }
  for (const [k, v] of Object.entries(b)) {
    // 后序非值直接跳过
    if (!v) continue;
    // 前序非值直接覆盖
    if (!r[k]) {
      r[k] = v;
      continue;
    }
    const typeA = typeof r[k];
    const typeB = typeof v;
    // 类型不一致直接覆盖
    if (typeA !== typeB) {
      r[k] = v;
      continue;
    }
    // 基础类型的直接覆盖
    if (valueType.includes(typeA)) {
      r[k] = v;
      continue;
    }
    // 函数
    if (typeof r[k] === "function") {
      r[k] = v;
      continue;
    }
    if (typeof r[k] === "object") {
      // 都是数组
      if (Array.isArray(r[k]) && Array.isArray(v)) {
        r[k] = mergeArray(r[k] as unknown[], v);
        continue;
      }
      // 只有一个是数组
      if (Array.isArray(r[k]) || Array.isArray(v)) {
        r[k] = v;
        continue;
      }
      try {
        r[k] = mergeRecord(
          r[k] as Record<string, unknown>,
          v as Record<string, unknown>
        );
      } catch {
        r[k] = v;
      }
    }
  }
  return r as T & S;
};
export const mergeArray = <T>(a: T[], b: T[]) => {
  return [...a, ...b] as T[];
};
