
import chalk from "chalk";
import readline from 'node:readline'
/**
 * from vite
 */
function clearScreen() {
  const repeatCount = process.stdout.rows - 2
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}
export const log = (v:string, w?:string)=>{
  const time = chalk.gray(new Date().toLocaleTimeString());
  const content = chalk.green(v);
  const flag = chalk.yellow("[main]");
  const info = w?chalk.gray(w):""
  console.log(`${time} ${flag} ${content} ${info}`);
}