import { defineConfig } from "@tvvins/server"

export default defineConfig({
  source:"./src",
  entry:"main",
  port:8000,
  development:{
    watch:{

    }
  }
})