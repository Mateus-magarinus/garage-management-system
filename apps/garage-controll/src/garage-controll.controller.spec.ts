import { Test, TestingModule } from '@nestjs/testing';
import { GarageControllController } from './garage-controll.controller';
import { GarageControllService } from './garage-controll.service';

describe('GarageControllController', () => {
  let garageControllController: GarageControllController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GarageControllController],
      providers: [GarageControllService],
    }).compile();

    garageControllController = app.get<GarageControllController>(GarageControllController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(garageControllController.getHello()).toBe('Hello World!');
    });
  });
});
