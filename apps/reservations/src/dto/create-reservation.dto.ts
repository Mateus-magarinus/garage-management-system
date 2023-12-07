import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  parkingSpace: number;
}
