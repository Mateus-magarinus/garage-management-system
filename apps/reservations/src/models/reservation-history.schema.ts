import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class ReservationHistoryDocument extends AbstractDocument {
  @Prop()
  parkingSpace: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  userId: string;
}

export const ReservationHistorySchema = SchemaFactory.createForClass(
  ReservationHistoryDocument,
);
