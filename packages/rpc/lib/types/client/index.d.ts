export type ErrorHookResult = "continue" | "retry" | "break" | boolean;
export type ResponseErrorHook = (resp: any) => Promise<ErrorHookResult> | ErrorHookResult;
export declare const onResponseError: (hook: ResponseErrorHook) => () => void;
export declare const rpc: (payload: any[], id: string, url: string, times?: number) => Promise<any>;
