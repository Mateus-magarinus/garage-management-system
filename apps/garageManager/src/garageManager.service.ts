import { Injectable } from '@nestjs/common';
import { UserDto } from '@app/common';
import { CreateGarageDto } from './dto/create-garage.dto';
import { UpdateGarageDto } from './dto/update-garage.dto';
import { GarageManagerRepository } from './garageManager.repository';

@Injectable()
export class GarageManagerService {
  constructor(
    private readonly garageManagerRepository: GarageManagerRepository,
  ) {}

  async create(createGarageDto: CreateGarageDto, { _id: userId }: UserDto) {
    return this.garageManagerRepository.create({
      ...createGarageDto,
      userId,
    });
  }

  async findAll() {
    return this.garageManagerRepository.find({});
  }

  async findOne(_id: string) {
    return this.garageManagerRepository.findOne({ _id });
  }

  async findByParkingSpace(parkingSpace: number) {
    return this.garageManagerRepository.findOne({ parkingSpace });
  }

  async update(_id: string, updateGarageDto: UpdateGarageDto) {
    return this.garageManagerRepository.findOneAndUpdate(
      { _id },
      { $set: updateGarageDto },
    );
  }

  async remove(_id: string) {
    return this.garageManagerRepository.findOneAndDelete({ _id });
  }
}
