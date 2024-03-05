import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CommonService } from '../common/common.service';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private readonly commonService: CommonService,
  ) {}
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const id: number = (await this.vehicleRepository.count()) + 1;
    const new_vehicle: Vehicle = await this.vehicleRepository.create({
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
    return await this.vehicleRepository.save(new_vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    return await this.vehicleRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<UpdateResult> {
    const vehicleToUpdate: Vehicle = await this.findOne(id);

    if (!vehicleToUpdate) return null;

    Object.assign(vehicleToUpdate, updateVehicleDto);

    return await this.vehicleRepository.update(id, vehicleToUpdate);
  }

  async remove(id: number): Promise<DeleteResult> {
    const vehicleToUpdate: Vehicle = await this.findOne(id);

    if (!vehicleToUpdate) return null;

    return await this.vehicleRepository.delete(id);
  }
}
