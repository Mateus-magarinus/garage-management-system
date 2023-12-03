import { Injectable } from '@nestjs/common';

@Injectable()
export class GarageControllService {
  getHello(): string {
    return 'Hello World!';
  }
}
