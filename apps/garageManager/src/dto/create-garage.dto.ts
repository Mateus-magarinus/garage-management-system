import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';

class SizeDto {
  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  length: number;
}

export class CreateGarageDto {
  @ApiProperty()
  @IsNumber()
  parkingSpace: number;

  @ApiProperty()
  @IsNumber()
  priceHour: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SizeDto)
  size: SizeDto;

  @ApiProperty()
  @IsBoolean()
  isCovered: boolean;
}
