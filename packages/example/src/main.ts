import { createApp } from "@tvvins/server"

const app =await createApp()
app.use((ctx,next)=>{
  next()
  return
})
app.listen()
