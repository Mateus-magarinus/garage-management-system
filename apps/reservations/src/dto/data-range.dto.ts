import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class DateRangeDto {
  @IsNotEmpty()
  @IsString()
  @IsDate()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  @IsDate()
  endDate: string;
}
