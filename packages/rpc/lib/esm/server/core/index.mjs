// src/server/core/index.ts
import { bodyParse } from "./body-parse.mjs";
import { _defineAPI } from "./api.mjs";
import { resHandle } from "./response.mjs";
import { defineMiddleWare } from "@tvvins/core";
import { BodyParserManager } from "./body-parse.mjs";
var useRPC = (options = {}) => {
  const { base = "/rpc" } = options;
  const store = /* @__PURE__ */ new Map();
  const handle = async (ctx, next) => {
    if (!ctx.request.url.startsWith(base)) {
      return next();
    }
    const id = ctx.$.req.headers["x-tvvins-rpc-id"];
    if (!id)
      return next();
    const h = store.get(id);
    if (!h)
      return next();
    const payload = await bodyParse(ctx.$.req);
    const result = await h(payload.data);
    resHandle(ctx.$.res, result);
  };
  const middleware = defineMiddleWare(handle, "tvvins-rpc");
  const defineAPI = (handle2, schema) => {
    return _defineAPI(store, handle2, schema);
  };
  return {
    defineAPI,
    middleware
  };
};
export {
  BodyParserManager,
  useRPC
};
