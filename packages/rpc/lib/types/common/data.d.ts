import { Schema } from "./type";
export declare const decode: (val: any, schema: Schema) => any;
export declare const encode: (val: unknown) => {
    val: unknown;
    schema: Schema;
} | null;
