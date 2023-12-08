import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  GARAGE_MANAGEMENT_SERVICE,
  NOTIFICATIONS_SERVICE,
  UserDto,
} from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { ReservationsHistoryRepository } from './reservations-history.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly reservationsHistoryRepository: ReservationsHistoryRepository,
    @Inject(GARAGE_MANAGEMENT_SERVICE)
    private readonly garageManagerService: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { _id: userId, email }: UserDto,
  ) {
    const parkingSpace = await this.garageManagerService.send(
      'find_by_parking_space',
      { parkingSpace: createReservationDto.parkingSpace },
    );
    if (!parkingSpace) throw new NotFoundException('Parking space not found');

    const existingReservations = await this.reservationsRepository.find({
      parkingSpace: createReservationDto.parkingSpace,
      startDate: { $lt: new Date(createReservationDto.endDate) },
      endDate: { $gt: new Date(createReservationDto.startDate) },
    });

    if (existingReservations.length > 0) {
      throw new ConflictException(
        'There is already a reservation for this parking space during the desired period.',
      );
    }

    await this.reservationsHistoryRepository.create({
      ...createReservationDto,
      userId,
    });

    const reservation = await this.reservationsRepository.create({
      ...createReservationDto,
      userId,
    });

    this.notificationsService.emit('notify_email', {
      email,
      text: `Dear User,

      This is a notification to inform you that Parking Space ${createReservationDto.parkingSpace} has been successfully reserved.
      
      Reservation Details:
      - Parking Space: ${createReservationDto.parkingSpace}
      - Start Date: ${createReservationDto.startDate}
      - End Date: ${createReservationDto.endDate}
      
      Thank you for using our parking reservation system.
      
      Best regards`,
    });

    return reservation;
  }

  async findAll({ _id: userId }: UserDto) {
    try {
      const userReservations = await this.reservationsRepository.find({
        userId,
      });

      if (!userReservations || userReservations.length === 0) {
        throw new NotFoundException(
          'No reservations found for the specified user',
        );
      }

      return userReservations;
    } catch (error) {
      console.error('Error finding reservations by user:', error);
      throw new InternalServerErrorException(
        'Error finding reservations by user',
      );
    }
  }

  async findOne(_id: string, { _id: userId }: UserDto) {
    try {
      const reservation = await this.reservationsRepository.findOne({
        userId,
        _id,
      });

      if (!reservation) {
        throw new NotFoundException(
          'Reservation not found for the specified user and reservation ID',
        );
      }

      return reservation;
    } catch (error) {
      console.error(
        'Error finding reservation by user and reservation ID:',
        error,
      );
      throw new InternalServerErrorException(
        'Error finding reservation by user and reservation ID',
      );
    }
  }

  async findAllFromHistory({ _id: userId }: UserDto) {
    try {
      console.log('adasdasdasd', userId);
      const userReservations = await this.reservationsHistoryRepository.find({
        userId,
      });

      if (!userReservations || userReservations.length === 0) {
        throw new NotFoundException(
          'No reservations found for the specified user',
        );
      }

      return userReservations;
    } catch (error) {
      console.error('Error finding reservations by user:', error);
      throw new InternalServerErrorException(
        'Error finding reservations by user',
      );
    }
  }

  async findOneFromHistory(_id: string, { _id: userId }: UserDto) {
    try {
      const reservation = await this.reservationsHistoryRepository.findOne({
        userId,
        _id,
      });

      if (!reservation) {
        throw new NotFoundException(
          'Reservation not found for the specified user and reservation ID',
        );
      }

      return reservation;
    } catch (error) {
      console.error(
        'Error finding reservation by user and reservation ID:',
        error,
      );
      throw new InternalServerErrorException(
        'Error finding reservation by user and reservation ID',
      );
    }
  }

  async update(
    _id: string,
    updateReservationDto: UpdateReservationDto,
    { _id: userId, roles, email }: UserDto,
  ) {
    const reservationId = _id;
    console.log(_id);
    if (!roles.includes('admin')) {
      this.validateUserPermission(userId, reservationId);
    }

    await this.reservationsHistoryRepository.create({
      endDate: updateReservationDto.endDate,
      startDate: updateReservationDto.startDate,
      parkingSpace: updateReservationDto.parkingSpace,
      userId,
    });

    const updatedReservation =
      await this.reservationsRepository.findOneAndUpdate(
        { _id: reservationId },
        { $set: updateReservationDto },
      );

    if (!updatedReservation) {
      throw new NotFoundException('Reservation not found');
    }

    this.notificationsService.emit('notify_email', {
      email,
      text: `Dear User,

      This is a notification to inform you that the reservation for Parking Space ${updateReservationDto.parkingSpace} has been successfully updated.
      
      Updated Reservation Details:
      - Parking Space: ${updateReservationDto.parkingSpace}
      - New Start Date: ${updateReservationDto.startDate}
      - New End Date: ${updateReservationDto.endDate}
      
      Thank you for using our parking reservation system.
      
      Best regards`,
    });

    return updatedReservation;
  }

  async remove(_id: string, { _id: userId, roles }: UserDto) {
    const reservationId = _id;
    if (!roles.includes('admin')) {
      this.validateUserPermission(userId, reservationId);
    }
    const deletedReservation =
      await this.reservationsRepository.findOneAndDelete({
        _id: reservationId,
      });

    if (!deletedReservation) {
      throw new NotFoundException('Reservation not found');
    }

    return deletedReservation;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async removeOldReservations() {
    try {
      const currentDateTime = new Date();

      const oldReservations = await this.reservationsRepository.find({
        endDate: { $lt: currentDateTime },
      });

      for (const reservation of oldReservations) {
        await this.reservationsRepository.findOneAndDelete({
          _id: reservation._id,
        });
      }
    } catch (error) {
      console.error('Error removing old reservations:', error);
    }
  }

  private async validateUserPermission(
    userId: string,
    reservationId: string,
  ): Promise<void> {
    const reservation = await this.reservationsRepository.findOne({
      _id: reservationId,
    });

    if (!reservation || reservation.userId !== userId) {
      throw new ForbiddenException(
        'User is not allowed to perform this operation',
      );
    }
  }
}
