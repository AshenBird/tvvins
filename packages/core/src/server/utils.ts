import { CommonClassType } from "./types";

export function isClass(value:any): value is CommonClassType {
  return typeof value === 'function' && 
         /^\s*class\s+/.test(Function.prototype.toString.call(value));
}