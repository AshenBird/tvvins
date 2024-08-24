import { IDENTITY, SESSION_GETTER } from "./core/const";
import { IncomingMessage } from "node:http";
import { Session } from "./core/session";

export type IDStore = {
  key: string,
  files: {
    filename: string
    apis: {
      id: string
      name: string
    }[]
  }[]
}

export type RPCOptions = {
  base?: string;
  dirs?: string | string[]
  middlewares?: RPCMiddleware[]
};

export type RPCMiddleware = <Payload = any>(payload: Payload, session: Session, name: string) => MiddlewareResult | Promise<MiddlewareResult>

export type MiddlewareResult = {
  code:number,
  message:string,
  data?:string
}|boolean

export interface ApiWithPayloadHandle<Payload, Result> {
  (this:RPCContext,payload: Payload): Promise<Result> | Result;
}
export interface ApiWithoutHandle<Result> {
  (this:RPCContext): Promise<Result> | Result;
}
export type ApiHandle<Payload, Result> = ApiWithPayloadHandle<Payload, Result>|ApiWithoutHandle<Result>

export type Christen<Payload, Result> = (name: string) => API<Payload, Result>;

export type RPCContext = {
  session:Session
}

export interface APIBase {
  [IDENTITY]: "api";
  [SESSION_GETTER]:()=>Session
  // christen: Christen<Payload, Result>;
}

export interface APIWithPayload<Payload = any, Result = any> extends APIBase  {
  (this:RPCContext,payload: Payload): Promise<Result>;
}

export interface APIWithoutPayload< Result = any> extends APIBase  {
  (): Promise<Result>;
}
export type API<Payload = any, Result = any> = APIWithPayload<Payload,Result>|APIWithoutPayload<Result>

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

export type BodyParser = (req: IncomingMessage) => Promise<BodyParseResult>
