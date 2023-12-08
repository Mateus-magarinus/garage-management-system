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
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard, CurrentUser, UserDto } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiCookieAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.reservationsService.create(createReservationDto, user);
  }

  @ApiCookieAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: UserDto) {
    return await this.reservationsService.findAll(user);
  }

  @Get('userReservationsHistory')
  @UseGuards(JwtAuthGuard)
  async findAllHistory(@CurrentUser() user: UserDto) {
    return await this.reservationsService.findAllFromHistory(user);
  }

  @ApiCookieAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return await this.reservationsService.findOne(id, user);
  }

  @ApiCookieAuth()
  @Get('userHistoryReservations/:id')
  @UseGuards(JwtAuthGuard)
  async findOneFromHistory(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
  ) {
    return await this.reservationsService.findOneFromHistory(id, user);
  }

  @ApiCookieAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.reservationsService.update(
      id,
      updateReservationDto,
      user,
    );
  }

  @ApiCookieAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return await this.reservationsService.remove(id, user);
  }
}
