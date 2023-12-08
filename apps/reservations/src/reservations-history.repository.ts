import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReservationHistoryDocument } from './models/reservation-history.schema';

@Injectable()
export class ReservationsHistoryRepository extends AbstractRepository<ReservationHistoryDocument> {
  protected readonly logger = new Logger(ReservationsHistoryRepository.name);

  constructor(
    @InjectModel(ReservationHistoryDocument.name)
    reservationHistoryModel: Model<ReservationHistoryDocument>,
  ) {
    super(reservationHistoryModel);
  }
}
