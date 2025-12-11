

export class TvvinsSession<T extends Record<string|number|symbol,any> = Record<string|number|symbol,any>> {
  private store = new Map<keyof T,any>()

  constructor(){}
  set<K extends keyof T >(key: K, value:T[K]){
    this.store.set(key,value)
  }
  get<K extends keyof T >(key: K):T[K]|undefined{
    return this.store.get(key)
  }
  toJSON(){
    return Object.fromEntries(this.store.entries());
  }
  toString(){
    return JSON.stringify(this.toJSON())
  }
  // @todo 迭代器协议
}