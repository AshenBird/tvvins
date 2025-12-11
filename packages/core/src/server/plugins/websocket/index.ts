import { WebSocketDecoratorFac } from "../../types"
const WebSocket = (() => {
  const dec = (Class: any, context: DecoratorContext)=>{
    if (context.kind !== "class") {
      throw new Error("只能用于类")
    }
    return Class as  InstanceType<typeof Class>
  }
  return dec
}) as WebSocketDecoratorFac
const Channel = (channelName: string) => {
  const dec = (method: any, context: DecoratorContext)=>{
    if (context.kind !== 'method') {
      throw new Error('只能用于属性')
    }
    return method as  typeof method
  }
  return dec
} 
Reflect.set(WebSocket,"Channel", Channel)
export {WebSocket}
export default WebSocket