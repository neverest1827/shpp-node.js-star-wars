import { Injectable } from '@nestjs/common';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planet } from '../planet/entities/planet.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Starship } from './entities/starship.entity';

@Injectable()
export class StarshipService {
  constructor(
    @InjectRepository(Starship)
    private starshipRepository: Repository<Starship>,
    private readonly commonService: CommonService,
  ) {}
  async create(createStarshipDto: CreateStarshipDto) {
    const id: number = (await this.starshipRepository.count()) + 1;
    return await this.starshipRepository.create({
      id: id,
      name: createStarshipDto.name,
      model: createStarshipDto.model,
      manufacturer: createStarshipDto.manufacturer,
      cost_in_credits: createStarshipDto.cost_in_credits,
      length: createStarshipDto.length,
      max_atmosphering_speed: createStarshipDto.max_atmosphering_speed,
      crew: createStarshipDto.crew,
      passengers: createStarshipDto.passengers,
      cargo_capacity: createStarshipDto.cargo_capacity,
      consumables: createStarshipDto.consumables,
      hyperdrive_rating: createStarshipDto.hyperdrive_rating,
      MGLT: createStarshipDto.MGLT,
      starship_class: createStarshipDto.starship_class,
      pilots: [],
      films: [],
      created: createStarshipDto.created,
      edited: createStarshipDto.edited,
      url: this.commonService.createUrl(id, 'starships'),
      images: [],
    });
  }

  async findAll() {
    return await this.starshipRepository.find();
  }

  async findOne(id: number) {
    return await this.starshipRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateStarshipDto: UpdateStarshipDto) {
    const starshipToUpdate: Starship = await this.starshipRepository.findOne({
      where: { id: id },
    });
    if (!starshipToUpdate) {
      return null;
    }

    // Применяем изменения из UpdateFilmDto к сущности
    Object.assign(starshipToUpdate, updateStarshipDto);

    return await this.starshipRepository.update(id, starshipToUpdate);
  }

  async remove(id: number) {
    return await this.starshipRepository.delete(id);
  }
}
