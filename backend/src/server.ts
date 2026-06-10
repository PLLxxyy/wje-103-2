import { app } from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`甜品团购社区 API 已启动：http://localhost:${config.port}`);
});
