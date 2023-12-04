import { NestFactory } from '@nestjs/core';
import { GarageManagerModule } from './garageManager.module';

async function bootstrap() {
  const app = await NestFactory.create(GarageManagerModule);
  await app.listen(3000);
}
bootstrap();
