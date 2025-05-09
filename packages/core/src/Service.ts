
import { nanoid } from "nanoid"
import { CALL_KEY, IDENTIFY_KEY, SERVICE_IDENTIFY, SESSION_SETTER } from "./const"
import { TvvinsSession } from "./Session"
/**
 * 定义一个抽象类，用来支撑RPC服务
 */
export abstract class TvvinsService {
  static [IDENTIFY_KEY] = SERVICE_IDENTIFY
  static [CALL_KEY] = nanoid()
  protected session:TvvinsSession = null as unknown as TvvinsSession
  // protected abstract name:string
  /**
   * 定义一个静态方法，用来获取实例,就是实际上用来代理前端rpc访问的类,这个访问器暂时是个闭环的访问器，没有啥意义
   * @returns
   */
  public static get proxy() {
    return null as unknown as InstanceType<typeof this>
  }
  constructor() {}
  [SESSION_SETTER](session:TvvinsSession){
    this.session = session
  }
}