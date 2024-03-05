import { Injectable } from '@nestjs/common';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CommonService } from '../common/common.service';

@Injectable()
export class PlanetService {
  constructor(
    @InjectRepository(Planet)
    private planetRepository: Repository<Planet>,
    private readonly commonService: CommonService,
  ) {}
  async create(createPlanetDto: CreatePlanetDto): Promise<Planet> {
    const id: number = (await this.planetRepository.count()) + 1;
    const new_planet: Planet = await this.planetRepository.create({
      id: id,
      name: createPlanetDto.name,
      rotation_period: createPlanetDto.rotation_period,
      orbital_period: createPlanetDto.orbital_period,
      diameter: createPlanetDto.diameter,
      climate: createPlanetDto.climate,
      gravity: createPlanetDto.gravity,
      terrain: createPlanetDto.terrain,
      surface_water: createPlanetDto.surface_water,
      population: createPlanetDto.population,
      residents: [],
      films: [],
      created: createPlanetDto.created,
      edited: createPlanetDto.edited,
      url: this.commonService.createUrl(id, 'planets'),
      images: [],
    });
    return this.planetRepository.save(new_planet);
  }

  async findAll(): Promise<Planet[]> {
    return await this.planetRepository.find();
  }

  async findOne(id: number): Promise<Planet> {
    return await this.planetRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updatePlanetDto: UpdatePlanetDto,
  ): Promise<UpdateResult> {
    const planetToUpdate: Planet = await this.findOne(id);

    if (!planetToUpdate) return null;

    Object.assign(planetToUpdate, updatePlanetDto);

    return await this.planetRepository.update(id, planetToUpdate);
  }

  async remove(id: number): Promise<DeleteResult> {
    const planetToUpdate: Planet = await this.findOne(id);

    if (!planetToUpdate) return null;

    return await this.planetRepository.delete(id);
  }
}
