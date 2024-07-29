import { useTvvins } from "@tvvins/core"
import { plugin as rpc } from "./plugins/rpc"
import "./api"
const tvvins = useTvvins({
  plugins:[rpc]
})

// export default tvvins
