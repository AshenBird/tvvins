// develop entry
import { httpServer, app } from "./http";
import { viteServerPromise } from "./view";
import { log } from "@tvvins/utils/dev";
import c2k from "koa-connect"
import { router } from "./router";
export const devLauncher = async () => {
  const viteServer = await viteServerPromise;
  log("vite server launched");
  app.use(c2k(viteServer.middlewares));
  app.use(router.routes)
  httpServer.listen(3000);
  // @ts-ignore
  log(`HTTP Server listening: ${httpServer.address().port}`);
};

