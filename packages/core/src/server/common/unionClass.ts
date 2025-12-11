import { UnionToIntersection } from "../types";


/**
 * 混合多个类并返回一个新类
 * @param base 基础类
 * @param mixins 要混合的类列表
 * @returns 一个包含所有类方法和属性的新类
 */
export function UnionClasses<
  Mixins extends Array<new (...args: any[]) => {}>
>(
  ...mixins: Mixins
): new (...args: any[]) => 
   UnionToIntersection<InstanceType<Mixins[number]>> {
  class Base {
    constructor(){
    }
  }
  // 创建一个继承自基础类的临时类
  class MixedClass extends Base {
    constructor() {
      super();
      // 初始化所有混入类
      mixins.forEach(Mixin => {
        const temp =class extends Mixin {
          constructor(){
            super()
          }
        }
        Reflect.defineProperty(temp.prototype.constructor,"name",{
          value:this.constructor.name,
        })
        // 调用每个混入类的构造函数
        Object.assign(this, new temp());
      });
    }
  }

  
  // 复制每个混入类的原型方法到混合类
  mixins.forEach(mixin => {
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      // 跳过构造函数
      if (name !== 'constructor') {
        const descriptor = Object.getOwnPropertyDescriptor(mixin.prototype, name);
        if (descriptor) {
          Object.defineProperty(MixedClass.prototype, name, descriptor);
        }
      }
    });
    
    // 复制静态方法和属性
    Object.getOwnPropertyNames(mixin).forEach(name => {
      if (name !== 'prototype' && name !== 'name' && name !== 'length') {
        const descriptor = Object.getOwnPropertyDescriptor(mixin, name);
        if (descriptor) {
          Object.defineProperty(MixedClass, name, descriptor);
        }
      }
    });
  });
  
  return MixedClass as any;
}
