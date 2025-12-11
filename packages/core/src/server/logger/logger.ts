import { Chalk, ChalkInstance } from "chalk";
import { deepJSONObject } from "../common";
const { red, white, green, yellow, blue, gray } = new Chalk();
const getTimeText = () => {
  const date = new Date();
  const timeString = date.toLocaleTimeString();
  const time = `${timeString}`;
  return time;
};

export const deepToString = (val: any) => {
  return JSON.stringify(deepJSONObject(val), undefined, 2)
}
const transform = (val: unknown) => {
  if (typeof val === "string") return val;
  const v = deepToString(val);
  if (v) return v;
  return val;
};

const log = (info: unknown) => {
  console.log(green(getTimeText()), white(transform(info)));
};
const info = (info: unknown) => {
  console.log(gray(getTimeText()), white(transform(info)));
};
const error = (info: unknown) => {
  console.log(red(getTimeText()), white(transform(info)));
};
const warn = (info: unknown) => {
  console.log(yellow(getTimeText()), white(transform(info)));
};

const debug = (info: unknown) => {
  console.log(blue(getTimeText()), white(transform(info)));
};
const store = new Map<string, Logger>();

const convertToJsonRecord = (val: unknown): string => {
  if (typeof val === "boolean") return val.toString()
  if (typeof val === "number") return val.toString()
  if (typeof val === "string") return val.toString()
  if (typeof val === "undefined") return "undefined"
  if (typeof val === "symbol") return val.toString()
  if (typeof val === "function") return val.toString()
  if (typeof val === "bigint") return `${val.toString()}n`
  if (val === null) return "null"
  if (Array.isArray(val)) {
    return JSON.stringify(val.map(convertToJsonRecord), undefined, 2);
  }
  if (val instanceof Map) {
    const record = [...val.entries()].reduce((a, c: [unknown, unknown]) => {
      const [key, value] = c;
      a[convertToJsonRecord(key)] = convertToJsonRecord(value);
      return a
    }, {} as Record<string | symbol | number, unknown>)

    return `Map(${JSON.stringify(record, undefined, 2)})`;
  }

  if (val instanceof Set) {
    const arr = [...val.values()].map(convertToJsonRecord) as string[]

    return `Set(${JSON.stringify(arr, undefined, 2)})`;
  }
  const r = Object.entries(val).reduce((a, c: [string | symbol | number, unknown]) => {
    const [key, value] = c;
    a[key] = convertToJsonRecord(value);
    return a
  }, {} as Record<string | symbol | number, unknown>)
  try {
    return JSON.stringify(r, undefined, 2)
  } catch (e) {
    return val.toString()
  }
}
export type LogLevel = "LOG" | "INFO" | "ERROR" | "WARN" | "DEBUG"

export class Logger {
  static log = log;
  static info = info;
  static error = error;
  static warn = warn;
  static debug = debug;
  private channel: string;
  private colorMap = {
    LOG: green,
    INFO: gray,
    ERROR: red,
    WARN: yellow,
    DEBUG: blue,
  } as const
  constructor(channel: string) {
    this.channel = channel;
    store.set(channel, this);
  }
  private levelFac(level: LogLevel, color: ChalkInstance) {
    const method = console[level.toLowerCase() as Lowercase<LogLevel>].bind(console)

    return (...args: unknown[]) =>
      method(
        color(`[ ${getTimeText()} | ${level} | ${this.channel} ]`),
        ...args.map((info) => white(transform(info)))
      );
  }
  private logFac(level: LogLevel) {
    return this.levelFac(level, this.colorMap[level])
  }
  async log(...args: unknown[]) {
    this.logFac("LOG")(...args.map(convertToJsonRecord))
  }
  async info(...args: unknown[]) {
    this.logFac("INFO")(...args.map(convertToJsonRecord))
  }
  async error(...args: unknown[]) {
    this.logFac("ERROR")(...args.map(convertToJsonRecord))
  }
  async warn(...args: unknown[]) {
    this.logFac("WARN")(...args.map(convertToJsonRecord))
  }

  async debug(...args: unknown[]) {
    this.logFac("DEBUG")(...args.map(convertToJsonRecord))
  }
  listFac(level: LogLevel) {
    const method = console[level.toLowerCase() as Lowercase<LogLevel>].bind(console)
    const color = this.colorMap[level];
    return async (msg: { [key: string]: unknown }, title: string = "",) => {
      const args: string[] = []
      args.push(color(`[ ${getTimeText()} | ${level} | ${this.channel} ] ${msg}`), "\n",)
      if (title) {
        args.push(color(title), "\n")
      }
      args.push(
        ...(Object.entries(convertToJsonRecord(msg))).map(([key, value]) => `\t ${key}: ${white(transform(value))}`)
      )
      method(
        ...args
      );
    }
  }
  get list() {
    const entries = Object.entries(this.colorMap)
    const result = Object.fromEntries(entries.map(([key]) => [key.toLocaleLowerCase, this.listFac(key as LogLevel)]))
    return result as Record<Lowercase<LogLevel>, (msg: { [key: string]: unknown }, title?: string) => Promise<void>>
  }
}
