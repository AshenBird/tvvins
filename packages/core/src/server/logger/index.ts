import {Logger} from "./logger"
export {Logger} from "./logger"
export class WithLogger{
  logger:Logger 
  constructor(){
    this.logger = new Logger(this.constructor.name)
  }
}