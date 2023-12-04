import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';

class SizeDto {
  @IsNumber()
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  length: number;
}

export class CreateGarageDto {
  @IsNumber()
  parkingSpace: number;

  @IsNumber()
  priceHour: number;

  @ValidateNested()
  @Type(() => SizeDto)
  size: SizeDto;

  @IsBoolean()
  isCovered: boolean;
}
