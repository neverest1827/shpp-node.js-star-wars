import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Planet } from '../planet/entities/planet.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private readonly commonService: CommonService,
  ) {}
  async create(createVehicleDto: CreateVehicleDto) {
    const id: number = (await this.vehicleRepository.count()) + 1;
    return await this.vehicleRepository.create({
      id: id,
      name: createVehicleDto.name,
      model: createVehicleDto.model,
      manufacturer: createVehicleDto.manufacturer,
      cost_in_credits: createVehicleDto.cost_in_credits,
      length: createVehicleDto.length,
      max_atmosphering_speed: createVehicleDto.max_atmosphering_speed,
      crew: createVehicleDto.crew,
      passengers: createVehicleDto.passengers,
      cargo_capacity: createVehicleDto.cargo_capacity,
      consumables: createVehicleDto.consumables,
      vehicle_class: createVehicleDto.vehicle_class,
      pilots: [],
      films: [],
      created: createVehicleDto.created,
      edited: createVehicleDto.edited,
      url: this.commonService.createUrl(id, 'vecicles'),
      images: [],
    });
  }

  async findAll() {
    return await this.vehicleRepository.find();
  }

  async findOne(id: number) {
    return await this.vehicleRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const vehicleToUpdate: Vehicle = await this.vehicleRepository.findOne({
      where: { id: id },
    });
    if (!vehicleToUpdate) {
      return null;
    }

    // Применяем изменения из UpdateFilmDto к сущности
    Object.assign(vehicleToUpdate, updateVehicleDto);

    return await this.vehicleRepository.update(id, vehicleToUpdate);
  }

  async remove(id: number) {
    return await this.vehicleRepository.delete(id);
  }
}
