import { createTvvins } from "./App";
import { APP_KEY } from "./const";
import { TvvinsService } from "./Service";

class DemoService extends TvvinsService {
  constructor(){
    super()
  }
}

const app = createTvvins({
  service: [DemoService],
  port: 9090,
  
})