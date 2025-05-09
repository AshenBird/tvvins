import { isDevelopment } from "./env";
import type { Tvvins } from "./types";

export const regularOptions = (
  userOptions: Tvvins.UserOptions
): Tvvins.Options => {
  const { port = 9000, service = [], middlewares = [], develop, rpc } = userOptions;
  
  return {
    port,
    service,
    middlewares,
    develop: regularDevelopOptions(develop),
    rpc:regularRpcOptions(rpc),
  };
};
const regularDevelopOptions = (options: Partial<Tvvins.DevelopOptions>) => {
  // 非开发模式下完全没必要输出这部分数据
  if (!isDevelopment()) return {} as Tvvins.DevelopOptions;
  return options;
};

const regularRpcOptions = (options: Tvvins.UserRpcOptions = "/rpc"):Tvvins.RpcOptions => {
  let uri:`/${string}` = "/rpc"
  if(typeof options === "string"){
    uri = options
  }else if(options.uri){
    uri = options.uri
  }
  return {
    uri
  }
};
