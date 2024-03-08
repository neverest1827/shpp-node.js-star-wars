import { Injectable } from '@nestjs/common';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Starship } from './entities/starship.entity';

@Injectable()
export class StarshipService {
  constructor(
    @InjectRepository(Starship)
    private starshipRepository: Repository<Starship>,
    private readonly commonService: CommonService,
  ) {}
  async create(createStarshipDto: CreateStarshipDto): Promise<Starship> {
    const id: number = (await this.starshipRepository.count()) + 1;
    const new_starship: Starship = await this.starshipRepository.create({
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
    return this.starshipRepository.save(new_starship);
  }

  async findAll(): Promise<Starship[]> {
    return await this.starshipRepository.find();
  }

  async findOne(id: number): Promise<Starship> {
    return await this.starshipRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateStarshipDto: UpdateStarshipDto,
  ): Promise<UpdateResult> {
    const starshipToUpdate: Starship = await this.findOne(id);

    if (!starshipToUpdate) return null;

    Object.assign(starshipToUpdate, updateStarshipDto);

    return await this.starshipRepository.update(id, starshipToUpdate);
  }

  async remove(id: number): Promise<DeleteResult> {
    const starshipToUpdate: Starship = await this.findOne(id);

    if (!starshipToUpdate) return null;

    return await this.starshipRepository.delete(id);
  }
}
