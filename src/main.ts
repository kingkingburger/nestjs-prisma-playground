import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import process from 'process';
import { CustomExceptionFilter } from './config/filter/custom.exception.filter';
import { ResponseInterceptor } from './config/filter/reponse.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  // 기본 CORS 활성화
  app.enableCors();

  // 전역 필터 등록
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor()); // 반환값 객체화 처리
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // DTO에 정의되지 않은 속성 제거
      // forbidNonWhitelisted: true, // 정의되지 않은 속성 포함 시 에러 발생
      transform: true, // 요청 객체를 자동으로 DTO 클래스 인스턴스로 변환
    }),
  );

  // swagger 적용
  const config = new DocumentBuilder()
    .setTitle('playground')
    .setDescription('just fun, check deploy10/24')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'header',
        name: 'authorization',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks(); // 종료 신호를 수신하고 종료 후크가 실행되기 전에 신호에 다른 리스너가 있는 경우 현재 프로세스를 죽이지 않는 설정
  await app.listen(port);
}
bootstrap();
