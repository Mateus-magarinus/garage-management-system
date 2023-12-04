import { Controller, Get } from '@nestjs/common';
import { GarageManagerService } from './garageManager.service';

@Controller()
export class GarageManagerController {
  constructor(private readonly garageControllService: GarageManagerService) {}

  @Get()
  getHello(): string {
    return this.garageControllService.getHello();
  }
}
