import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks(); // 종료 신호를 수신하고 종료 후크가 실행되기 전에 신호에 다른 리스너가 있는 경우 현재 프로세스를 죽이지 않는 설정
  await app.listen(3000);
}
bootstrap();
