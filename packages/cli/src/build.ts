import { loadConfig, resolveConfig } from "@tvvins/core";
import { cwd } from "node:process";
import { isAbsolute, join, normalize, relative, resolve, sep } from "node:path";
import { build as esbuild } from "esbuild";
import { emptyDirSync, ensureDirSync } from "fs-extra";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { nanoid } from "nanoid";

const symbolKey = nanoid()
export const build = async () => {
  const config = await resolveConfig(await loadConfig("build"));
  const { source, entry } = config;
  const base = cwd();
  const sourcePath = resolve(base, source);
  const entryPath = resolve(sourcePath, entry + ".ts");
  const outdir = resolve(base, config.build.output);
  ensureDirSync(outdir);
  emptyDirSync(outdir);
  await esbuild({
    entryPoints: [entryPath],
    target: "node20",
    platform: "node",
    outdir,
    format: "cjs",
    packages: "external",
    bundle: true,
    outExtension: {
      ".js": ".cjs",
    },
    plugins: [
      {
        name: "tvvins-rpc-server-prebuild",
        setup(builder) {
          const idStore:Record<string,string> = {};
          // /[.\\n]*/
          builder.onLoad({ filter: /[.\\n]*/ }, async (args) => {
            let contents = readFileSync(args.path, { encoding: "utf-8" });
            const apiDir = resolve(config.source, "./apis");
            let path = args.path;
            const stat = statSync(path);
            if (!stat.isFile()) {
              path = join(path, "index.ts");
            }
            const isInclude = !normalize(relative(apiDir, path)).startsWith(
              `..${sep}`
            );
            if (isInclude) {
              contents = contents + `;const ID = Symbol.for('${symbolKey}');`
              const mod = await import(pathToFileURL(path).toString())
              for(const name of Object.keys(mod)){
                const id = nanoid();
                contents = contents + `Reflect.set(${name},ID,'${id}')`;
                idStore[name] = id
              }
            }
            return {
              contents,
              loader: "ts",
            };
          });
          builder.onEnd(()=>{
            writeFileSync(join(outdir,"idStore.js"),`
              export const isStore = ${JSON.stringify(idStore)};
            `.trim())
          })
        },
      },
    ],
  });
};
