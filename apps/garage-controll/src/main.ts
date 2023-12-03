import { NestFactory } from '@nestjs/core';
import { GarageControllModule } from './garage-controll.module';

async function bootstrap() {
  const app = await NestFactory.create(GarageControllModule);
  await app.listen(3000);
}
bootstrap();
