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

@Controller('garage-manager')
export class GarageManagerController {
  constructor(private readonly garageManagerService: GarageManagerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async create(
    @Body() createGarageDto: CreateGarageDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.garageManagerService.create(createGarageDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async findAll() {
    return this.garageManagerService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async findOne(@Param('id') id: string) {
    return this.garageManagerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async update(
    @Param('id') id: string,
    @Body() updateGarageDto: UpdateGarageDto,
  ) {
    return this.garageManagerService.update(id, updateGarageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string) {
    return this.garageManagerService.remove(id);
  }
}
