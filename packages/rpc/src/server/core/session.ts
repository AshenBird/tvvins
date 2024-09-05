export class Session{
  private map = new Map<string,any>()
  constructor(public id:string){}
  get(key:string){
    return this.map.get(key)
  }
  set<T>(key:string,value:T){
    this.map.set(key,value)
    return value
  }
  clear(){
    return this.map.clear()
  }
  delete(key:string){
    return this.map.delete(key)
  }
}