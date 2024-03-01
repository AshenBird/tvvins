
export const defineConfig = (userConfig:Partial<TvvinsConfig>)=>{
  return Object.assign({},defaultConfig,userConfig);
}

const defaultConfig:TvvinsConfig = {
  base:"/",
  apiDir:"src/apis"
}

type TvvinsConfig = {
  base:string,
  apiDir:string
}

export type Server = any

export const createServer = ()=>{}

