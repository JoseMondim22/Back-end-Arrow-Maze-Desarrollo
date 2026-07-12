import 'reflect-metadata';
import { config } from 'dotenv';

config();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './infrastructure/modules/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Arrow Maze API')
    .setDescription('REST API for the Arrow Maze puzzle game')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
