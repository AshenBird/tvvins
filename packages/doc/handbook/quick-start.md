<script setup lang="ts" >
  import {  NTabs, NTabPane, NConfigProvider,darkTheme } from "naive-ui"
</script>

# 快速开始

## 安装

```shell
npm install @tvvins/core @tvvins/cli
```

## 初始化项目

<NConfigProvider :theme="darkTheme">
  <NTabs>
  <NTabPane name="npm" >

```shell
npx tvvins init
```

  </NTabPane>

  <NTabPane name="pnpm"  >

```shell
pnpm dlx tvvins init
```

  </NTabPane>

  </NTabs>
</NConfigProvider>
