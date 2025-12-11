import { ClintInstance } from "../client-instance"
import { PROVIDER_STORE_KEY } from "../Context";

export const provide = function<T extends any>(this:ClintInstance,key: string|symbol,provider:T) {
  this[PROVIDER_STORE_KEY].set(key,provider)
};
export const inject = function<T extends any>(this:ClintInstance,key: string|symbol) {
  return this[PROVIDER_STORE_KEY].get(key) as T|undefined
};