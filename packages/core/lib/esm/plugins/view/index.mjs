// src/plugins/view/index.ts
import { createStaticMiddleware } from "./static.mjs";
var viewPlugin = (options) => {
  const result = {
    name: "@tvvins/view",
    middlewares: [
      createStaticMiddleware(options.vite)
    ]
  };
  return result;
};
export {
  viewPlugin
};
