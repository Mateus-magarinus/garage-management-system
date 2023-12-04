import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GarageManagerDocument } from './models/garageManager.schema';

@Injectable()
export class GarageManagerRepository extends AbstractRepository<GarageManagerDocument> {
  protected readonly logger = new Logger(GarageManagerRepository.name);

  constructor(
    @InjectModel(GarageManagerDocument.name)
    reservationModel: Model<GarageManagerDocument>,
  ) {
    super(reservationModel);
  }
}
