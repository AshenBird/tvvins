import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Tvvins",
  description: "cross-end web application framework",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/handbook/quick-start' },
      { text: 'API', link: '/api/plugin' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/handbook/quick-start' },
          { text: '概念', link: '/handbook/concept' },
          // { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'API',
        items: [
          { text: '模块', link: '/api/module' },
          { text: '服务', link: '/api/service' },
          { text: '插件', link: '/api/plugin' },
          { text: '命令行', link: '/api/cli' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
