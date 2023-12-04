import { Module } from '@nestjs/common';
import { GarageManagerController } from './garageManager.controller';
import { GarageManagerService } from './garageManager.service';

@Module({
  imports: [],
  controllers: [GarageManagerController],
  providers: [GarageManagerService],
})
export class GarageManagerModule {}
