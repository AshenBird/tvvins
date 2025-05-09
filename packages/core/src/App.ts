import { CONTEXT_KEY, SESSION_SETTER } from "./const";
import { isBuild, isDevelopment } from "./env";
import { regularOptions } from "./options";
import { TvvinsSession } from "./Session";
import type { ConnectMiddleware, ServiceClass, Tvvins } from "./types";
import {
  createServer as createHttpServer,
  IncomingMessage,
  ServerResponse,
  type Server as HttpServer,
} from "node:http";
import type { Server as ConnectServer, NextFunction } from "connect";
import connect from "connect";
/**
 * 通用的应用类，主要起到服务调度的作用
 */
export class TvvinsApp<
  S extends Record<string | symbol | number, any> = Record<
    string | symbol,
    any
  >,
> {
  private middlewares: ConnectMiddleware[] = [];
  private servicePool = new Set<ServiceClass>();
  private sessions = new Map<string, TvvinsSession<S>>();
  private serviceIdMap = new Map<string, ServiceClass>();
  private userServiceInstanceMaps = new Map<
    string,
    Map<ServiceClass, InstanceType<ServiceClass>>
  >();
  private _httpServer: HttpServer | undefined;
  private _connect: ConnectServer;
  private _options: Tvvins.Options;
  private get port() {
    // 这里其实没必要这样，在配置里处理过了，但是为了保持语义还是这样写
    if (!isDevelopment()) return this.options.port;
    return this.options.develop?.port || this.options.port;
  }
  get httpServer() {
    return this._httpServer;
  }
  get options() {
    return this._options;
  }
  constructor(options: Tvvins.UserOptions) {
    this._options = regularOptions(options);
    this.launch();
    this._connect = connect();
  }
  private launch() {
    for (const service of this.options.service) {
      this.register(service);
    }
    if (isBuild()) return;
    for(const middleware of this._options.middlewares){
      this.middlewares.push(...this._options.middlewares);
      this._connect.use(middleware)
    }
    this._connect.use(this.options.rpc.uri,this.rpcHandle.bind(this))
    this._httpServer = createHttpServer(this._connect);
  }
  listen(){
    this._connect.listen(this.port);
    return this;
  }
  register(Service: ServiceClass) {
    this.servicePool.add(Service);
    return this;
  }
  async rpcHandle(req: IncomingMessage, res: ServerResponse,next: NextFunction) {
    const { headers } = req;
    const clientId = headers["TVVINS_CLIENT_ID"] as string | undefined;
    let serviceKey = headers["TVVINS_SERVICE_KEY"] as string | undefined;
    let methodKey = headers["TVVINS_METHOD_KEY"] as string | undefined;
    if (!serviceKey || !methodKey) {
      // @todo 要抛出一个特殊的异常
      return;
    }
    if (!clientId) {
      return;
    }
    let userServiceMap = this.userServiceInstanceMaps.get(clientId);
    if (!userServiceMap) {
      userServiceMap = new Map();
      this.userServiceInstanceMaps.set(clientId, userServiceMap);
    }
    const Service = this.serviceIdMap.get(serviceKey)!;
    let instance = userServiceMap.get(Service);
    let session = this.sessions.get(clientId);
    if (!instance) {
      // 初始化 service
      instance = new Service();
      instance[SESSION_SETTER](
        (session as TvvinsSession<S>) || new TvvinsSession<S>()
      );
      userServiceMap.set(Service, instance);
    }
    // const extendInstance = Object.create(instance);
    const instanceService = new Proxy(instance,{
      get:(target, p: string | symbol, receiver )=>{
        if(p !== CONTEXT_KEY) return Reflect.get(target,p);
        return {
          req,
          res,

        }
      }
    })
    const handle = instanceService[methodKey];
    // @todo 解析出来payload 交给handle处理
    await next()
    // @todo 在这里要把数据放到res上
  }
}

/**
 *
 * @param options
 * @returns
 */
export const createTvvins = (options: Tvvins.UserOptions) => {
  const app = new TvvinsApp(options);
  return app;
};
