import { Tvvins } from "./type";
import type { UserConfigExport } from "vite";
export declare const mergeOptions: <T extends Tvvins.InitOptions, S extends Tvvins.InitOptions>(a: T, b: S) => T & S;
export declare const resolveOptions: <T extends Tvvins.Mode>(raw: Tvvins.InitOptions, mode: T) => T extends "runtime" ? Tvvins.ResolvedRunTimeInitOptions : Tvvins.ResolvedInitOptions;
export declare const unwrapViteConfig: (userConfig: UserConfigExport) => Promise<import("vite").UserConfig>;
