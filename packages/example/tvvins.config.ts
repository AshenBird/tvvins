import { defineConfig } from "@tvvins/core"
import { fileURLToPath, URL } from 'node:url'
import {resolve} from "node:path"
import {cwd} from "node:process"
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { vitePlugin,RPC } from "@tvvins/rpc/plugin"
export default defineConfig({
  // 绝对路径模式，相对路径模式：基于cwd
  source:"./src",
  entry:"main",
  port:8000,
  host:"localhost",
  plugins:[
    RPC("apis")
  ],
  vite:{
    plugins: [
      // vitePlugin(["apis"]),
      vue(),
      vueJsx(),
      // vitePlugin(["apis"])
    ],
    publicDir:resolve(cwd(), "./public"),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  },
  development:{},
  build:{
    output:"./dist"
  }
})