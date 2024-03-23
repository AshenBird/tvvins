const createApi = (url:string)=>{
  return (payload:BodyInit | null | undefined,headers:unknown)=>window.fetch(url,{
    method:"POST",
    body:payload
  })
}