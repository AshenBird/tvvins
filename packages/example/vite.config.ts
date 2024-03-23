import { fileURLToPath, URL } from 'node:url'
import {resolve} from "node:path"
import {cwd} from "node:process"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {  } from "@tvvins/rpc";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  publicDir:resolve(cwd(), "./public"),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
