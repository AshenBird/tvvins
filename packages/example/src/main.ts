import { useTvvins } from "@tvvins/core"
import { useRPC } from "@tvvins/rpc"

export const {defineAPI, middleware:rpc} = useRPC()

const tvvins = useTvvins({
  middlewares:[
    rpc
  ]
})

tvvins.listen();

