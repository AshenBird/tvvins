import { UnionClasses } from "./common/unionClass";
import { env } from "node:process";
import { APP_KEY } from "./const";
import { WithLogger } from "./logger";
import {
  UserModuleOptions,
  TvvinsPlugin,
  TvvinsOptionalPlugin,
  ResolvedModuleOptions,
  DefaultTvvinsModule,
  Plugins2Proxy1,
  UserServerOptions,
  TransServers,
  UserServerOption,
  TvvinsMode,
  TvvinsPubInfo,
  TvvinsDepInfo,
} from "./types";
import { isClass } from "./utils";
import { resolveOptions } from "./_options";
import semvar,{ SemVer, Range as SemVerRange } from "semver";
export async function createApp<
  P extends TvvinsPlugin[],
  S extends UserServerOptions,
  M extends TvvinsModule[]
>(options: UserModuleOptions<P, S, M>) {
  const _options = await resolveOptions(options);
  const app = new TvvinsModule(_options);
  app.launch();
  return app.proxy;
}
export function getApp(server: any) {
  return Reflect.get(server, APP_KEY);
}

const isRange = (val: SemVerRange|SemVer|string): val is SemVerRange => {
  if(typeof val === "string"){
    return false
  }
  if((val as SemVerRange).range){
    return true
  }
  return false
};

export class TvvinsInstanceManager<T extends TvvinsPubInfo> {
  private map = new Map<string | T, Map<string, T>>()
  get(info: TvvinsPubInfo|TvvinsDepInfo|T) {
    const {name,version} = info
    const key =name||info;
    const versionMap = this.map.get(key as string);
    if (!versionMap) {
      return null;
    }
    const instances = [...versionMap.entries()].sort((a,b)=>{
      return semvar.lt(a[0],b[0])?1:-1
    })
    if(instances.length===0){
      return null
    }
    // 如果没有指定版本，返回最新的
    if (!version) {
      return instances[0][1]
    }
    const versionKey = typeof version==="string"?version:isRange(version)?version.range:version.toString()
    for (const item of instances) {
      // 返回匹配的最高版本
      if (semvar.satisfies(item[0],versionKey)) {
        return item[1]
      }
    }
    // 没有匹配的版本
    return null;
  }
  set(instance: T) {
    const { name, version } = instance;
    const key = name || instance;
    const innerVersion = version?.toString() || "0.0.0";
    let versionMap = this.map.get(key)
    if (!versionMap) {
      versionMap = new Map()
      this.map.set(key, versionMap)
    }
    versionMap.set(innerVersion, instance);
  }
  *values() {
    for (const innerMap of this.map.values()) {
      for (const item of innerMap.values()) {
        yield item
      }
    }
  }
  *[Symbol.iterator]() {
    for (const innerMap of this.map.values()) {
      for (const item of innerMap) {
        yield item
      }
    }
  }
}


export class TvvinsModule<
  P extends TvvinsPlugin[] = TvvinsPlugin[],
  S extends UserServerOptions = UserServerOptions,
  M extends TvvinsModule[] = DefaultTvvinsModule[]
> extends UnionClasses(WithLogger) {
  private readonly SERVER_NAME_KEY = Symbol();
  private servers: Map<string, any> = new Map();
  private plugins = new TvvinsInstanceManager<TvvinsOptionalPlugin>();
  private _options: ResolvedModuleOptions<P, S, M>;
  private MODE: TvvinsMode = env["TVVINS_MODE"] as TvvinsMode;
  get options() {
    return this._options;
  }
  constructor(options: ResolvedModuleOptions<P, S, M>) {
    super();
    this._options = options;
    this.setup();
  }
  private setup() {
    if (this.MODE === "SERVER") {
      this.build();
      return;
    }
    // 全局错误捕捉，避免进程退出
    if (this.options.useGlobalExceptionCatch) {
      process.on("uncaughtException", (err, origin) => {
        this.logger.list.error(
          {
            err,
            origin,
          },
          "uncaughtException"
        );
      });
      process.on("unhandledRejection", (err, promise) => {
        this.logger.list.error(
          {
            err,
            promise,
          },
          "unhandledRejection"
        );
      });
    }
    for (const plugin of this.options.plugins) {
      this.usePlugin(plugin);
    }
    this.validatePluginDep();
    for (const [name, server] of Object.entries(this.options.servers)) {
      this.useServer(name, server);
    }
    for (const mod of this.options.modules) {
      this.useModule(mod);
    }
    for (const plugin of this.plugins.values()) {
      if (!plugin?.server?.proxy) continue;
      plugin.server.proxy(
        this,
        Object.fromEntries(this.servers.entries()) as TransServers<S>
      );
    }
  }
  private build() {
    // 只构建前端，后端目前直接用tsx运行
  }
  launch() {
    for (const plugin of this.plugins.values()) {
      if (!plugin?.server?.onLaunch) continue;
      plugin.server.onLaunch(this);
    }
    this.logger.info("app launch");
  }
  resolveServerOption(option: UserServerOption) {
    if (typeof option !== "function") return option;
    if (isClass(option)) {
      return new option();
    }
    return option();
  }
  getServerName(server: object) {
    return Reflect.get(server, this.SERVER_NAME_KEY);
  }
  useServer(name: string, Server: UserServerOption) {
    const server = this.resolveServerOption(Server);
    Reflect.set(server, this.SERVER_NAME_KEY, name);
    for (const plugin of this.plugins.values()) {
      if (plugin?.server?.excludes?.includes(name)) continue;
      if (plugin?.server?.onServer) {
        plugin.server.onServer(this, server);
      }
    }

    Reflect.set(server, APP_KEY, this);
    this.servers.set(name, server);
  }
  usePlugin(plugin: TvvinsPlugin) {
    if (typeof plugin === "function") {
      plugin = plugin(this);
    }
    this.plugins.set(plugin);
  }
  useModule(mod: DefaultTvvinsModule) { }
  private validatePluginDep() {
    for (const plugin of this.plugins.values()) {
      if (!plugin.dependencies) continue;
        for (const dep of plugin.dependencies) {
          const r = this.plugins.get(dep)
          if(!r){
            throw new Error(`plugin ${plugin.name} depends on ${dep}, but it is not loaded`);
          }
        }
    }
  }
  /*--------------------------*/
  /* store */
  private stores = new Map<string | symbol, any>();
  getStore(key: string | symbol) {
    return this.stores.get(key);
  }
  setStore(key: string | symbol, store: any) {
    this.stores.set(key, store);
  }
  /*--------------------------*/
  getPlugin(name: string) {
    
  }
  /*--------------------------*/
  get proxy() {
    const _ = {}; //Object.fromEntries(this.plugins.map(plugin => [plugin.name, {}] as const))
    return _ as Plugins2Proxy1<P, S>;
  }
}
