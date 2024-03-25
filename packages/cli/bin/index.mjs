// src/index.ts
import { Logger } from "@mcswift/utils";
import { Cli } from "@mcswift/utils/cli";
import { createApp } from "@tvvins/server";
import { join } from "path";
import { cwd } from "process";
var tvvins = new Cli("tvvins");
var loadConfig = async () => {
  const { default: config } = await import(join(cwd(), "tvvins.config.ts"));
  Logger.info(config);
  return config;
};
var start = async (isDev) => {
  const config = await loadConfig();
  const app = createApp(isDev);
  app.listen(config.port || 8e3);
};
tvvins.use("start", async (options) => {
  start(false);
});
tvvins.use("dev", () => {
  start(true);
});
tvvins.start();
