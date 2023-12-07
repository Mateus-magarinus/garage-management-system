import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard, CurrentUser, UserDto } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DateRangeDto } from './dto/data-range.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    try {
      const result = await this.reservationsService.create(
        createReservationDto,
        user,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('availableCarSpaces')
  @UseGuards(JwtAuthGuard)
  async findAvailableCarSpaces(@Req() req) {
    const dateRangeDto: DateRangeDto = req.headers;
    try {
      const result = await this.reservationsService.findAvailableCarSpaces(
        dateRangeDto.startDate,
        dateRangeDto.endDate,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('userReservations')
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: UserDto) {
    try {
      const result = await this.reservationsService.findAll(user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: UserDto) {
    try {
      const result = await this.reservationsService.findOne(id, user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    try {
      return await this.reservationsService.update(
        id,
        updateReservationDto,
        user,
      );
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    try {
      return await this.reservationsService.remove(id, user);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
