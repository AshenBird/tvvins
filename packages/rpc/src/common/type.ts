export type TypeName =
  // 直出 
  | "string"
  | "number"
  | "boolean"
  // 简单转义
  | "bigint"
  | "symbol"
  | "NaN"
  | "Infinity"
  | "null"
  | "date"
  // 递归转义
  | "array"
  | "map"
  | "set"
  | "record";
export type Schema = {
  type: TypeName;
  children?: Record<string, Schema> | Schema[];
};
export interface HandledResult<T> {
  schema: Schema;
  val: T;
  isError?:boolean
}