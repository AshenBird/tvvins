import { App } from "./Server";
import { createStaticMiddleware } from "./static";
import { ServerInitOptions } from "./type";
export * from "./type";
export type { Context } from "./Context";
export { defineConfig } from "./utils"
export const useTvvins = (options: ServerInitOptions) => {
  const {
    plugins = [],
    middlewares = [],
    useOfficialView = true,
    autoBoot = false,
  } = options;
  const app = new App();
  // 注册中间件
  for (const middleware of middlewares) {
    app.use(middleware);
  }
  // 注册视图中间件
  if (useOfficialView) {
    app.use(createStaticMiddleware());
  }
  if (autoBoot) {
    app.listen();
  }
  return app;
};
