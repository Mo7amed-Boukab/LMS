import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  console.log('Lancement du seed...');
  await app.close();
}

void bootstrap();
