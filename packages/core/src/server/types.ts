import { SemVer,Range as SemVerRange } from "semver";
import { TvvinsModule } from "./app";
import { UserConfig as ViteUserConfig,ResolvedConfig as ViteResolvedConfig } from "vite";
export type { TvvinsModule } from "./app";

export type APIFunc = <Args extends any[] = unknown[]>(...args: Args) => any;
export type CommonClassType = new (...args: any) => any;

export type TvvinsWebSocketServer = {};
export interface WebSocketDecoratorFac {
  (): (
    Class: any,
    context: DecoratorContext
  ) => TvvinsWebSocketServer & InstanceType<typeof Class>;
  Channel: (
    channelName: string
  ) => (value: APIFunc, context: DecoratorContext) => APIFunc;
}

export type TransServers<T extends UserServerOptions> = {
  [K in keyof T]: ResolveServerOption<T[K]>;
};
/*|--------------------------------------------------------*/
/*| 配置选项 */
export type TvvinsPubInfo = {
  name?: string;
  version?: SemVer;
};

export type TvvinsUserPubInfo = {
  name?: string;
  version?: SemVer;
};
export type TvvinsDepInfo = {
  name?: string;
  version?: SemVer|string|SemVerRange;
};
/*|--------------------------------------------------------*/
/*|-服务选项 */
export type UserServerOption = CommonClassType | (() => object) | object;
export type UserServerOptions = Record<string, UserServerOption>;

export type ResolveServerOption<T> = T extends CommonClassType
  ? InstanceType<T>
  : T extends () => object
  ? ReturnType<T>
  : T;
export type ResolveServerOptions = Record<string, Required<UserServerOption>>;
export type TvvinsFunctionPlugin = (
  app: TvvinsModule
) => TvvinsOptionalPlugin;
/*|--------------------------------------------------------*/
/*|-插件选项 */
export type TvvinsPlugin = TvvinsOptionalPlugin | TvvinsFunctionPlugin;
// export type TvvinsPluginOptions = TvvinsPlugin[]//Record<string, TvvinsPlugin>;
export type TvvinsOptionalPlugin = TvvinsUserPubInfo & {
  server?: {
    // 服务注册钩子
    onServer?: (app: TvvinsModule, server: any) => any;
    // 框架连接时钩子
    onLaunch?: (app: TvvinsModule) => any;
    proxy?: (app: TvvinsModule, servers: any) => any;
    excludes?: string[];
  };
  client?: {};
  dependencies?: (TvvinsDepInfo|any)[];
};

/*-----------------------------------------------------------------------*/
/* RPC 选项 ( 作为一个二阶插件 ) */
export type RpcOption =
  | SimpleHttpRpcOption
  | SseRpcOption
  | WsRpcOption
  | ElectronRpcOption
  | false;

export type RpcBaseOption = {
  port?: number;
  baseURL?: string;
};

export type ElectronRpcOption = {};
export type SimpleHttpRpcOption = {
  accessMethod: "simple-http" | "http";
} & RpcBaseOption;
export type SseRpcOption = {
  accessMethod: "sse-http" | "sse";
} & RpcBaseOption;
export type WsRpcOption = {
  accessMethod: "ws" | "websocket";
} & RpcBaseOption;
/*-----------------------------------------------------------------------*/
/* Client 选项*/

/*-----------------------------------------------------------------------*/
/* Client 选项*/
export type ClientOption = BrowserClientOption | ElectronClientOption | boolean;
export type BrowserClientOption = {
  type?: "browser";
  baseURL?: string;
  port?: number;
  proxyByTvvins?: boolean;
  // rpc?:Exclude<RpcOption,ElectronRpcOption>
  vite?: ViteUserConfig;
};
export type ElectronClientOption = {
  type: "electron";
  vite?: ViteUserConfig;
  // rpc?:ElectronRpcOption
};
export type ClientType = "electron" | "browser";
export type ResolvedBrowserClientOption = Required<Omit<BrowserClientOption,"vite">>&{
  vite: ViteResolvedConfig;
};
export type ResolvedElectronClientOption = Required<Omit<ElectronClientOption,"vite">>&{
  vite: ViteResolvedConfig;
};
export type ResolvedClientOption = ResolvedBrowserClientOption|ResolvedElectronClientOption|false;
/*|--------------------------------------------------------*/
/*|-模块选项 */
export type DefaultTvvinsModule = TvvinsModule;
export interface UserModuleOptions<
  P extends TvvinsPlugin[] = TvvinsPlugin[],
  S extends UserServerOptions = UserServerOptions,
  M extends TvvinsModule[] = TvvinsModule[]
> extends TvvinsUserPubInfo {
  plugins?: P;
  servers?: S;
  modules?: M;
  useGlobalExceptionCatch?: boolean;
  entryPath?: string;
  client?: ClientOption;
}
export type ResolvedModuleOptions<
  P extends TvvinsPlugin[],
  S extends UserServerOptions,
  M extends TvvinsModule[]
> = Omit<Required<UserModuleOptions<P, S, M>>, "client"|"version"> & {
  version: SemVer;
  client: ResolvedClientOption;
};

/*-----------------------------------------------------------------------*/
export interface WithSession {
  session: {};
}
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// type GetProxyFunctions<P extends undefined|((app: TvvinsModule,servers: any)=>any)> =
//   P extends (...args: any) => any ?  ReturnType<P>:undefined
export type Plugins2Proxy1<
  P extends TvvinsPlugin[],
  S extends UserServerOptions
> = {
  [K in keyof P]: TransServers<S>;
};

export type TvvinsMode = "BUILDER" | "SERVER" | "DEV_SERVER";
