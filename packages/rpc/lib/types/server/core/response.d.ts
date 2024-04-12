/// <reference types="node" />
/// <reference types="node" />
import { Readable, Duplex, Transform } from "node:stream";
import { ServerResponse } from "http";
export declare const isReadableStream: (val: unknown) => val is Readable | Duplex | Transform;
export declare const resHandle: (res: ServerResponse, result: unknown) => void;
/**
 *
 * @param val
 * @param fileName
 * @param type mime type
 */
export declare const fileRef: (val: Readable, fileName: string, type: string) => any;
