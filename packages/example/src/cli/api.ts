import axios from "axios";
axios.request({
  // url:"http://110.40.190.140:8180/token/login",
  url:"http://192.168.11.52:6080/User/roleSearch",
  method:"post",
  data:{
    // username:"admin@admin.com",
    // password:"12345678"
  }
}).then((r)=>{
  console.debug(r.data)
  // console.debug(r.request._header)
  // console.debug(r.headers)
}).catch((e)=>{
  console.debug(e.response)
})