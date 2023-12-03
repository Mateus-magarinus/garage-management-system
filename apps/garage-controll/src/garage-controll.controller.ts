import { Controller, Get } from '@nestjs/common';
import { GarageControllService } from './garage-controll.service';

@Controller()
export class GarageControllController {
  constructor(private readonly garageControllService: GarageControllService) {}

  @Get()
  getHello(): string {
    return this.garageControllService.getHello();
  }
}
