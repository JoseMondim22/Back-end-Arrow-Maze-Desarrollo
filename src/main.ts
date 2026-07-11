import 'reflect-metadata';
import { config } from 'dotenv';

config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
