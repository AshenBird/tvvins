/// <reference types="node" />
import { IncomingMessage } from "http";
import { BodyParseResult, type BodyParser } from "../type";
/**
 * body 中接受的数据类型
 * 1. application/json 进行解析，并返回解析后的数据
 * 2. formdata
 * 3.
 * 4. text/plain 解析为
 */
export declare const bodyParse: (req: IncomingMessage) => Promise<BodyParseResult>;
export declare const BodyParserManager: Readonly<{
    registry: (mime: string, parser: BodyParser) => boolean;
    has: (mime: string) => boolean;
    get: (mime: string) => (req: IncomingMessage) => Promise<BodyParseResult>;
}>;
