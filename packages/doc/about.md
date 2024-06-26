# 关于 Tvvins

Tvvins 是一个以一体化结构为特色的 Web 框架。

## 目标

Tvvins 致力打造的是一个低成本、快速、敏捷、安全的现代 Web 开发生态。

## 特色

- 一体化：前端后端一体化开发、构建、运行。
- 接口类型安全：通过 @tvvins/rpc 插件实现开发阶段的函数式调用，强化接口类型安全与参数校验能力，减少前端管理接口的心智负担。
- 插件系统：插件系统可以快速为项目增加能力，主要是提供更为复杂的构建能力与兼容性
- 兼容 Connect 生态：为利用 node 丰富的生态，我们提供了内置 Connect 中间件转接方法。事实上，tvvins 的中间件调用能力，是直接复用的 Connect。

## 未来生态建设

### 一体化开发

- SSR 支持
- uniapp 一体化开发接入
- flutter 一体化开发接入
- electron 一体化开发接入

## 运行原理

Tvvins 的基本指导思想在于减少开发者的心智负担，在各类调用关系上减少精力开销。所以在设计中，开发阶段，同编译阶段、运行阶段具有同等重要的地位。得益于语言服务器（Language Server）的发展，开发时的体验得到了极大提升，我们可以利用语言服务器的能力，将开发阶段的设计提升到一个足够丰富的水平。

Tvvins 的核心服务存在两个基本的运行方式，即编译服务及运行服务。

实际上编译服务与运行服务是同一个服务的两个分支。

| 运行模式  | 开发阶段  | 编译服务 | 运行阶段 |
| -------- | -------- | -------- | -------- |
| develop  |          |          |          |
| test     |          |          |          |
| prod     |          |          |          |

## 灵感

tvvins 最早的灵感来自于 Midway。Midway 的一体化模式令人印象深刻，在这样的工作流下，可以帮助开发者快速搭建最小原型，并能保持良好的类型安全。但 midway 的使用依然存在着许多基于约定和配置的问题。着并不利于开箱即用的实现，于是我开始了探索一条更加便捷的路径。时至今日 tvvins 依然不能称作是一体化开发更好的实现。固然这其中有开发者自身能力的不足，也在于 javascript 本身的诸多限制。

当 midway 不再维护一体化模式之后，我也感到十分的惋惜。但并不妨碍继续在这条路上的探索。

事实上，在实现接口一体化调用的探索中，不可避免的会注意到 tRPC 项目。利用 typescript 类型系统只在编译期生效的特性，实现了跨端类型定义与安全，这也给我了极大的启发，一度考虑 tRPC 实现这部分功能。但考虑到 tRPC 接口开发的繁琐，我依然不觉得这是一个足够好的设计来实现开箱即用的一体化路径。不过，我现在依然推荐，在不想引入 @tvvins/rpc 插件的时候通过 tRPC 来实现接口，事实上由于目前的跨端调用模式，在构建速度上，tRPC 更有优势。不过好消息在于，tvvins 得益于 vite 与 esbuild 的组合，在不使用 @tvvins/rpc 时拥有无与伦比的构建速度。
