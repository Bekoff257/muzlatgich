import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.close();
}

run();
