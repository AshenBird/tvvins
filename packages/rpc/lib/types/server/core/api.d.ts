import { API, APIFac } from "../type";
import { Store } from "./store";
export declare const isAPI: <T extends any[] = any[], Q = unknown>(val: unknown) => val is API<T, Q>;
export declare const _defineAPI: <Result, Handle extends (...args: any[]) => Result>(store: Map<string, API>, handle: Handle, idStore: Store, name?: string) => APIFac<Handle>;
