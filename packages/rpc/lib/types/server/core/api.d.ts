import { API, ApiHandle } from "../type";
import { Store } from "./store";
export declare const isAPI: <T = unknown, Q = unknown>(val: unknown) => val is API<T, Q>;
export declare const _defineAPI: <Payload, Result>(store: Map<string, API>, handle: ApiHandle<Payload, Result>, idStore: Store) => API<Payload, Result>;
