import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GarageManagerService } from './garageManager.service';
import { JwtAuthGuard, CurrentUser, UserDto } from '@app/common';
import { Roles } from '@app/common/decorators/roles.decorator';
import { CreateGarageDto } from './dto/create-garage.dto';
import { UpdateGarageDto } from './dto/update-garage.dto';
import { MessagePattern } from '@nestjs/microservices';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('GarageManager')
@Controller('garage-manager')
export class GarageManagerController {
  constructor(private readonly garageManagerService: GarageManagerService) {}

  @ApiCookieAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async create(
    @Body() createGarageDto: CreateGarageDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.garageManagerService.create(createGarageDto, user);
  }

  @ApiCookieAuth()
  @MessagePattern('find_all')
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.garageManagerService.findAll();
  }

  @MessagePattern('find_one')
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.garageManagerService.findOne(id);
  }

  @ApiCookieAuth()
  @MessagePattern('find_by_parking_space')
  @Get('findByParkingSpace/:parkingSpace')
  @UseGuards(JwtAuthGuard)
  async findByParkingSpace(@Param('parkingSpace') parkingSpace: number) {
    return this.garageManagerService.findByParkingSpace(parkingSpace);
  }

  @ApiCookieAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateGarageDto: UpdateGarageDto,
  ) {
    return this.garageManagerService.update(id, updateGarageDto);
  }

  @ApiCookieAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.garageManagerService.remove(id);
  }
}
