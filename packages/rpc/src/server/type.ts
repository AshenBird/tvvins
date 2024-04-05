import { ID, IDENTITY } from "./core/const";
import { IncomingMessage } from "node:http";

export type RPCOptions = {
  base?: string;
};

export interface ApiHandle<Payload, Result> {
  (payload: Payload): Promise<Result> | Result;
}

export type Christen<Payload, Result> = (name: string) => API<Payload, Result>;

export interface API<Payload = any, Result = any> {
  (payload: Payload): Promise<Result>;
  [ID]: string;
  [IDENTITY]: "api";
  christen: Christen<Payload, Result>;
}

export interface ValidateResult {
  success: boolean;
  info?: {
    expected: string;
    received: string;
    path: string[];
    message: string;
  };
}
export interface Validator {
  (val: unknown): ValidateResult;
}
export type BodyParseResultBase<T = any> = {
  error: boolean;
  data: T;
};
export type BodyParseErrorResult = BodyParseResultBase<ErrorData> & {
  error: true;
};
export type BodyParseResult<T = any> =
  | BodyParseResultBase<T>
  | BodyParseErrorResult;

export type BodyParseErrorData = ErrorData & {
  code: number;
  message: string;
};
export type ErrorData = {
  stack?: string;
  rawMessage?: string;
};

export type Result<T> = {
  message: string;
  status: boolean;
  code: number;
  data: T;
};

export type ErrorResult = Result<ErrorData> & {
  status: false;
};

export type BodyParser =  (req:IncomingMessage)=>Promise<BodyParseResult>
