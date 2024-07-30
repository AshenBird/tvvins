
      import { ensureFileSync } from "fs-extra";
      import { copyFileSync, existsSync } from "node:fs";
      if(existsSync(idStorePathSource)){
        ensureFileSync(`C:\\Users\\marti\\projects\\tvviins\\packages\\example\\dist\\node_modules\\@tvvins\\rpc\\idStore.json`);
        copyFileSync(`C:\\Users\\marti\\projects\\tvviins\\packages\\example\\node_modules\\@tvvins\\rpc\\idStore.json`,`C:\\Users\\marti\\projects\\tvviins\\packages\\example\\dist\\node_modules\\@tvvins\\rpc\\idStore.json`);
      }
    