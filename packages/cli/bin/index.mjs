#!/usr/bin/env node

// src/index.ts
import { Logger } from "@mcswift/base-utils";
import { Cli } from "@mcswift/cli";
import { getCommandFile } from "@mcswift/node";
import { resolve } from "path";
import { cwd } from "node:process";
import { spawn } from "child_process";
import dotenv from "dotenv";
dotenv.config();
var tvvins = new Cli("tvvins");
var start = async (isDev, entry) => {
  const command = await getCommandFile("tsx", import.meta.dirname);
  if (!command)
    return;
  const entryPath = resolve(cwd(), entry);
  const args = [];
  if (isDev) {
    args.push("watch", "--no-warnings", "--ignore", "./vite.config.ts.timestamp-*", entryPath);
  } else {
    args.push("--no-warnings", entryPath);
  }
  if (isDev) {
    Logger.info("Begin Run devServer");
  }
  spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: Object.assign({
      TVVINS_STAGE: isDev ? "development" : "production",
      TVVINS_MODE: "server"
    }, process.env)
  });
};
tvvins.use("start", async (options) => {
  start(false, options.entry);
});
tvvins.use("dev", async (options) => {
  start(true, options.entry);
});
tvvins.use("build", async (options) => {
  const command = await getCommandFile("tsx", import.meta.dirname);
  if (!command)
    return;
  const entryPath = resolve(cwd(), options.entry);
  const args = [];
  args.push("--no-warnings", entryPath);
  Logger.debug("building");
  Logger.debug(args);
  spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: Object.assign({
      TVVINS_MODE: "build"
    }, process.env)
  });
});
tvvins.start();
