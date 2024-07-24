// import { Stream } from "stream"
import { defineAPI } from "../plugins/rpc"
import { prisma } from "../plugins/prisma"
import type {Prisma} from "@prisma/client"
export const gatTasks = defineAPI(async ()=>{
  const list = await prisma.task.findMany()
  return list
})

export const addTask = defineAPI(async (data:Prisma.TaskCreateInput)=>{
  const result =await prisma.task.create({
    data:data
  })
  return result
})

export const editTask=defineAPI(async (payload:Prisma.TaskUpdateInput&{id:number})=>{
  const {id,...data} = payload
  const result = await prisma.task.update({where:{
    id
  },data})
  return result
})
export const delTask =defineAPI(async (id:number)=>{
  const result = await prisma.task.delete({where:{
    id
  }})
  return result
})

export const getTaskById = defineAPI(async (id:number)=>{
  const task = await prisma.task.findUnique({where:{
    id
  }})
  return task
})

// @todo searchTask

