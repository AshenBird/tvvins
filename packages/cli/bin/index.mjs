#!/usr/bin/env node
import { exec, execSync, spawn } from "node:child_process"
import { resolve } from "node:path"
import { argv } from "node:process"
import { fileURLToPath } from "node:url"
import { getCommandFile } from "@mcswift/node"
import { stderr,stdout } from "node:process"
const dirname = resolve(fileURLToPath(import.meta.url),"../")
const cliPath = resolve(dirname,"../src")
const [ _0,_1,...o ] = argv
const tsxPath = getCommandFile("tsx",dirname)
const command = tsxPath
const args = ['--no-warnings',cliPath,...o]
spawn(command,args,{
  stdio:"inherit",
  shell:true
})
