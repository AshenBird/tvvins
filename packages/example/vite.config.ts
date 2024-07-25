import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { join } from 'node:path'
// DataTable.vue?vue&type=readme&index=0&lang.md
const vueMarkdown = (blockName:string):Plugin=>{
  const result:Plugin = {
    name: 'vue-markdown',
    transform:(code,id)=>{
      const reg = new RegExp('vue&type=' + (blockName))
      if (!reg.test(id)) return
      // if (/\.md$/.test(id)) {
      //   code = ""
      // }
      return `export default Comp => {
        Comp.${blockName} = \`${encodeURIComponent(code)}\`
      }`
    }
  }
  return result
}
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, join(process.cwd(), 'env'))
  return {
    plugins: [
      vue(), vueJsx()],//,vueMarkdown("readme")
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      hmr: true,
      host: '0.0.0.0',
      port: 7070,
      proxy: {
        // ex: /rest => http://192.168.52/rest
        '/rest': `http://${env.VITE_PROXY_BASE}`,

        // ex: /gw => http://192.168.52/rest
        '/gw': {
          target: `http://${env.VITE_PROXY_BASE}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gw/, '/rest')
        },

        // ex: /socket.io => ws://192.168.52/socket.io
        '/socket.io': {
          target: `ws://${env.VITE_PROXY_BASE}`,
          changeOrigin: true,
          ws: true
        },
        '/bzBack': `http://${env.VITE_PROXY_BASE1}`,
      }
    }
  }
})
