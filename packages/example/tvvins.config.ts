import { defineConfig } from "@tvvins/core"

export default defineConfig({
  source:"./src",
  entry:"main",
  port:8000,
  host:"localhost",
  development:{
    watch:{

    }
  }
})