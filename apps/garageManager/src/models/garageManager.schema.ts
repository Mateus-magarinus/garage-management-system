import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class GarageManagerDocument extends AbstractDocument {
  @Prop()
  parkingSpace: number;

  @Prop()
  priceHour: number;

  @Prop({
    type: {
      height: { type: Number },
      width: { type: Number },
      length: { type: Number },
    },
  })
  size: {
    height: number;
    width: number;
    length: number;
  };

  @Prop()
  isCovered: boolean;
}

export const ReservationSchema = SchemaFactory.createForClass(
  GarageManagerDocument,
);
