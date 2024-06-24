import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger 적용
  const config = new DocumentBuilder()
    .setTitle('playground')
    .setDescription('just fun')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks(); // 종료 신호를 수신하고 종료 후크가 실행되기 전에 신호에 다른 리스너가 있는 경우 현재 프로세스를 죽이지 않는 설정
  await app.listen(3000);
}
bootstrap();
