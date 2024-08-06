export type TypeName = "string" | "number" | "boolean" | "bigint" | "symbol" | "NaN" | "Infinity" | "null" | "date" | "array" | "map" | "set" | "record";
export type Schema = {
    type: TypeName;
    children?: Record<string, Schema> | Schema[];
};
export interface HandledResult<T> {
    schema: Schema;
    val: T;
}
