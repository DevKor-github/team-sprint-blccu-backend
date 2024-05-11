import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import expressBasicAuth from 'express-basic-auth';
// import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    ['/api-docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD, // 지정된 ID/비밀번호
      },
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000/',
      'https://blccu.com/',
      'https://www.blccu.com/',
    ],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // wooserk.tistory.com/105
  const config = new DocumentBuilder()
    .setTitle('blccu.com')
    .setDescription('blccu.com API spec')
    .setVersion('1.0')
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(`${process.env.SERVER_PORT}`);
}
bootstrap();
