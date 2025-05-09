import { CONTEXT_KEY } from "./const";
import { type Tvvins } from "./types";

export const useContext = ()=>{
  return (this as unknown as {[CONTEXT_KEY]:Tvvins.Context})[CONTEXT_KEY]
}