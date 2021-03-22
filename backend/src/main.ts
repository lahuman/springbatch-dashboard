import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api'); // prefix 설정
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // validate 사용 설정
  app.use(helmet({
    contentSecurityPolicy: false,
  })); // helmet 설정과 CSP 제외 (google analytics 사용시 제외 해야함)
  app.enableCors({
    origin: [
      /^(.*)/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
  }); // cors 설정 credentials 설정을 해야 credentials 정보도 함께 전달함

  const options = new DocumentBuilder()
    .setTitle('프로젝트 명')
    .setDescription('프로젝트 설명')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();