import { Module } from '@nestjs/common';
import { GarageControllController } from './garage-controll.controller';
import { GarageControllService } from './garage-controll.service';

@Module({
  imports: [],
  controllers: [GarageControllController],
  providers: [GarageControllService],
})
export class GarageControllModule {}
