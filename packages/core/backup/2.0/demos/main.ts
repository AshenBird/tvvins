import { createTvvins } from "../App";
import { APP_KEY } from "../const";
import { TvvinsService } from "../Service";



export class DemoService extends TvvinsService {
  constructor(){
    super()
  }
  async demoAPi(){
    return "hello world"
  }
}



const app = createTvvins({
  service: [DemoService],
  port: 9090,
})



