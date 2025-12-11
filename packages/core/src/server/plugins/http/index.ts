import { Router } from "express"
import Methods from "./methods"
import { HttpDecoratorFac, TvvinsHttpServer } from "./type"
import { BASE_URL_KEY, ROUTER_KEY } from "./const"
import { httpPlugin } from "./plugins"
export * from "./methods"
const Http = ((baseUrl: string) => {
  const dec = (Class: any, context: DecoratorContext) => {
    if (context.kind !== "class") {
      throw new Error("只能用于类")
    }
    Class.prototype[BASE_URL_KEY] = baseUrl
    Class.prototype[ROUTER_KEY] = Router()
    return Class as TvvinsHttpServer & InstanceType<typeof Class>
  }
  return dec
}) as HttpDecoratorFac
for (const [k, v] of Object.entries(Methods)) {
  Reflect.set(Http, k, v);
}
export { Http, httpPlugin }
export default Http