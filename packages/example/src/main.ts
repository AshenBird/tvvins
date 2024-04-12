import { useTvvins } from "@tvvins/core"
import { middleware as rpc } from "./plugins/rpc"
import "./apis"
const tvvins = useTvvins({
  middlewares:[rpc]
})

export default tvvins
