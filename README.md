# tvvins

> 一个现代化的 Web 应用开发框架，专注于提供无缝的 RPC 体验和模块化的插件架构。

**注意：本项目目前处于 WIP (Work In Progress) 状态，API 可能会发生变动。**

## 项目介绍 | Introduction

`tvvins` 是一个基于 TypeScript 构建的现代化全栈开发框架。它打破了前后端的界限，通过内置的 RPC 机制，让开发者能够像调用本地函数一样调用后端服务，同时保持完整的类型安全。

### 核心特性

- **TypeScript First**: 全面采用 TypeScript 编写，提供极致的类型推断和开发体验。
- **无缝 RPC**: 开箱即用的 RPC 支持，无需手动定义 API 路由和类型，前后端共享类型定义。
- **模块化插件系统**: 基于 `App` 和 `Plugin` 的设计，轻松扩展框架能力。
- **现代化构建**: 基于 Vite 和 esbuild，提供极速的开发服务器和高效的生产构建。

## 使用文档 | Usage

### 环境要求 | Prerequisites

- **Node.js**: `^18.0.0` || `<20.14.0`
  - 推荐使用 Node.js 20.10
  - *注意：在 Node.js 20.14+ 版本中存在已知的构建问题，请暂时避免使用。*

### 1. 安装 | Installation

```bash
pnpm add tvvins @tvvins/core @tvvins/rpc @tvvins/cli -D
```

### 2. 快速上手 | Quick Start

#### 初始化应用 (Server Entry)

创建一个入口文件（例如 `src/main.ts`），初始化应用并加载 RPC 插件：

```typescript
// src/main.ts
import { useTvvins } from "@tvvins/core"
import { plugin as rpc } from "./plugins/rpc"
import "./api" // 确保导入了 API 定义文件，以便生产环境注册 API

const app = useTvvins({
  plugins: [rpc]
})
```

#### 配置 RPC 插件

为了更好地管理 RPC 配置，建议在一个单独的文件中实例化 RPC 插件：

```typescript
// src/plugins/rpc.ts
import { useRPC } from "@tvvins/rpc"

// useRPC 接受配置对象：
// - base: RPC 请求的基础路径，默认为 "/rpc"
// - dirs: API 文件所在的目录，默认为 "./api"，用于在编译时过滤非api文件，提高编译效率
// - middlewares: RPC 专用的中间件
export const { defineAPI, plugin } = useRPC({
  base: "/rpc",
  dirs: "./api"
})
```

#### 定义服务端 API

在指定的 API 目录（如 `src/api`）下定义你的业务逻辑：

```typescript
// src/api/user.ts
import { defineAPI } from "../plugins/rpc"

interface User {
  id: string;
  name: string;
}

// defineAPI 接受一个函数，该函数将在服务端执行
export const getUser = defineAPI(function(id: string) {
  // 在这里可以编写服务端逻辑，如查询数据库,这里虚构了一个orm调用
  const user = orm.users.find(id)
  this.session.set("user", user)

  // 返回的值接受所有合法的JavaScript类型，会在客户端进行自动还原，为了保证安全，原型链及函数会被舍弃
  return user
})
```

#### 前端调用

在你的前端代码中（如 Vue/React 组件中），直接导入并调用定义的 API：

```typescript
// src/views/Home.vue
import { getUser } from "../api/user"

// 像调用普通异步函数一样调用远程 API
// 类型定义会自动推导，无需手动编写
const user = await getUser("123")
console.log(user.name) // "Tvvins User"
```

### 3. CLI 命令 | CLI Commands

`tvvins` 提供了命令行工具来管理项目的生命周期。

- **开发模式**: 启动开发服务器，支持热更新。
  ```bash
  tvvins dev --entry src/main.ts
  ```

- **构建项目**: 构建生产环境代码。
  ```bash
  tvvins build --entry src/main.ts
  ```

- **启动服务**: 运行构建后的生产环境代码。
  ```bash
  tvvins start --entry src/main.ts
  ```

### 4. 核心概念详解

#### Session 管理

在 `defineAPI` 定义的处理函数中，可以通过 `this.session` 访问当前请求的会话对象。

```typescript
export const login = defineAPI(function(username: string) {
  // 设置 Session 数据
  this.session.set("user", { username })
  return true
})

export const getProfile = defineAPI(function() {
  // 获取 Session 数据
  const user = this.session.get("user")
  return user
})
```

#### RPC 中间件

可以在 `useRPC` 中配置中间件来拦截和处理 RPC 请求，例如进行权限验证或日志记录。

```typescript
import { useRPC } from "@tvvins/rpc"

const authMiddleware = async (payload, session, name) => {
  const user = session.get("user")
  if (!user && name !== "login") {
    // 抛出错误或返回特定的错误对象
    throw new Error("Unauthorized")
  }
  // 返回 true 继续执行下一个中间件或 API Handler
  return true
}

export const { defineAPI, plugin } = useRPC({
  middlewares: [authMiddleware]
})
```

## 项目结构与参与开发 | Development

本项目采用 Monorepo 结构管理，使用 `pnpm workspace`。

### 目录结构

```text
packages/
  ├── core/      # @tvvins/core: 框架核心，包含 App、Plugin、Middleware 定义
  ├── rpc/       # @tvvins/rpc: RPC 实现，包含 Server 端处理和 Client 端调用逻辑
  ├── cli/       # @tvvins/cli: 命令行工具实现
  ├── example/   # 示例应用: 用于开发测试和演示功能的完整项目
  └── doc/       # 项目文档
```

### 参与贡献

欢迎提交 Pull Request 或 Issue 来改进 `tvvins`。

1.  **环境准备**: 确保本地安装了符合要求的 Node.js (推荐 v20, <20.14) 和 pnpm。
2.  **克隆仓库**:
    ```bash
    git clone https://github.com/your-repo/tvvins.git
    cd tvvins
    ```
3.  **安装依赖**:
    ```bash
    pnpm install
    ```
4.  **运行示例**:
    进入 `packages/example` 目录，启动开发服务器进行调试：
    ```bash
    cd packages/example
    pnpm dev
    ```

## License

MIT
