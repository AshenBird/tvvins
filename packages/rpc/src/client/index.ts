const createApi = (url:string)=>{
  return (payload,headers)=>window.fetch(url,{
    method:"POST",
    body:payload
  })
}