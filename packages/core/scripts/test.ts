import axios  from "axios";

axios.get("http://localhost:3000/example/oneCommonAPIFunc").then(res=>{
  console.log("default",res.data)
})
axios.get("http://localhost:3000/another/example/oneCommonAPIFunc").then(res=>{
  console.log("another",res.data)
}).catch(()=>{
  console.error("失败")
})
