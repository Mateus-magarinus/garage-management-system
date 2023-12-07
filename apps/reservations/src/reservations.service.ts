import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { GARAGE_MANAGEMENT_SERVICE, UserDto } from '@app/common';
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
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { _id: userId }: UserDto,
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

    this.reservationsHistoryRepository.create({
      ...createReservationDto,
      userId,
    });

    return this.reservationsRepository.create({
      ...createReservationDto,
      userId,
    });
  }

  async findAvailableCarSpaces(startDate: string, endDate: string) {
    try {
      const overlappingReservations = await this.reservationsRepository.find({
        startDate: { $lt: new Date(endDate) },
        endDate: { $gt: new Date(startDate) },
      });

      const allCarSpaces: any = await this.garageManagerService.send(
        'find_all',
        {},
      );

      const reservedParkingSpaces = overlappingReservations.map(
        (reservation) => reservation.parkingSpace,
      );

      const availableCarSpaces = allCarSpaces.filter(
        (carSpace) => !reservedParkingSpaces.includes(carSpace),
      );

      return availableCarSpaces;
    } catch (error) {
      console.error('Error finding available car spaces:', error);
      throw new InternalServerErrorException(
        'Error finding available car spaces',
      );
    }
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
    { _id: userId, roles }: UserDto,
  ) {
    const reservationId = _id;

    if (!roles.includes('admin')) {
      this.validateUserPermission(userId, reservationId);
    }

    const updatedHistoryReservation =
      await this.reservationsHistoryRepository.findOneAndUpdate(
        { _id: reservationId },
        { $set: updateReservationDto },
      );

    if (!updatedHistoryReservation) {
      throw new NotFoundException('Reservation not found in history');
    }

    const updatedReservation =
      await this.reservationsRepository.findOneAndUpdate(
        { _id: reservationId },
        { $set: updateReservationDto },
      );

    if (!updatedReservation) {
      throw new NotFoundException('Reservation not found');
    }

    return updatedReservation;
  }

  async remove(_id: string, { _id: userId, roles }: UserDto) {
    const reservationId = _id;
    if (!roles.includes('admin')) {
      this.validateUserPermission(userId, reservationId);
    }
    const deletedHistoryReservation =
      await this.reservationsHistoryRepository.findOneAndDelete({
        _id: reservationId,
      });

    if (!deletedHistoryReservation) {
      throw new NotFoundException('Reservation not found in history');
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

  @Cron(CronExpression.EVERY_HOUR)
  private async removeOldReservations() {
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
