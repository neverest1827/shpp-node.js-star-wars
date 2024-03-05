import { Injectable } from '@nestjs/common';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Specie } from './entities/specie.entity';
import { CommonService } from '../common/common.service';

@Injectable()
export class SpecieService {
  constructor(
    @InjectRepository(Specie)
    private specieRepository: Repository<Specie>,
    private readonly commonService: CommonService,
  ) {}
  async create(createSpecieDto: CreateSpecieDto): Promise<Specie> {
    const id: number = (await this.specieRepository.count()) + 1;
    const new_specie: Specie = await this.specieRepository.create({
      id: id,
      name: createSpecieDto.name,
      classification: createSpecieDto.classification,
      designation: createSpecieDto.designation,
      average_height: createSpecieDto.average_height,
      skin_colors: createSpecieDto.skin_colors,
      hair_colors: createSpecieDto.hair_colors,
      eye_colors: createSpecieDto.eye_colors,
      average_lifespan: createSpecieDto.average_lifespan,
      homeworld: createSpecieDto.homeworld,
      language: createSpecieDto.language,
      people: [],
      films: [],
      created: createSpecieDto.created,
      edited: createSpecieDto.edited,
      url: this.commonService.createUrl(id, 'species'),
      images: [],
    });
    return await this.specieRepository.save(new_specie);
  }

  async findAll(): Promise<Specie[]> {
    return await this.specieRepository.find();
  }

  async findOne(id: number): Promise<Specie> {
    return await this.specieRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateSpecieDto: UpdateSpecieDto,
  ): Promise<UpdateResult> {
    const specieToUpdate: Specie = await this.findOne(id);

    if (!specieToUpdate) return null;

    Object.assign(specieToUpdate, updateSpecieDto);

    return await this.specieRepository.update(id, specieToUpdate);
  }

  async remove(id: number): Promise<DeleteResult> {
    const specieToUpdate: Specie = await this.findOne(id);

    if (!specieToUpdate) return null;

    return await this.specieRepository.delete(id);
  }
}
