/// <reference types="node" />
import { Server as HttpServer } from "node:http";
import { IncomingMessage, ServerResponse } from "node:http";
import type { App } from "./App";
export declare class Context {
    get $(): {
        req: IncomingMessage;
        res: ServerResponse<IncomingMessage>;
        server: HttpServer<typeof IncomingMessage, typeof ServerResponse>;
    };
    get server(): App;
    get request(): {
        headers: import("http").IncomingHttpHeaders;
        url: string;
        host: string;
        hash: string;
        hostname: string;
        href: string;
    };
    private req;
    private res;
    private _server;
    constructor(req: IncomingMessage, res: ServerResponse, server: App);
    setType(contentType: string): this;
    setHeader(key: keyof IncomingMessage["headers"], value: string): void;
    write(content: unknown): boolean;
}
