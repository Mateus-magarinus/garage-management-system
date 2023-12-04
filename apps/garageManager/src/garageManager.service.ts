import { Injectable } from '@nestjs/common';

@Injectable()
export class GarageManagerService {
  getHello(): string {
    return 'Hello World!';
  }
}
