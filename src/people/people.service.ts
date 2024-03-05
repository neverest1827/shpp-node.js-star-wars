import { Injectable } from '@nestjs/common';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CommonService } from '../common/common.service';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
    private readonly commonService: CommonService,
  ) {}
  async create(createPersonDto: CreatePeopleDto): Promise<People> {
    const id: number = (await this.peopleRepository.count()) + 1;
    const new_people: People = this.peopleRepository.create({
      id: id,
      name: createPersonDto.name,
      height: createPersonDto.height,
      mass: createPersonDto.mass,
      hair_color: await this.commonService.getColor(createPersonDto.hair_color),
      skin_color: await this.commonService.getColor(createPersonDto.skin_color),
      eye_color: await this.commonService.getColor(createPersonDto.eye_color),
      birth_year: createPersonDto.birth_year,
      gender: await this.commonService.getGender(createPersonDto.gender),
      homeworld: await this.commonService.getHomeWorld(
        createPersonDto.homeworld,
      ),
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: createPersonDto.created,
      edited: createPersonDto.edited,
      url: this.commonService.createUrl(id, 'peoples'),
      images: [],
    });
    return await this.peopleRepository.save(new_people);
  }

  async findAll(): Promise<People[]> {
    return await this.peopleRepository.find();
  }

  async findOne(id: number): Promise<People> {
    return await this.peopleRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updatePersonDto: UpdatePeopleDto,
  ): Promise<UpdateResult> {
    const personToUpdate: People = await this.findOne(id);

    if (!personToUpdate) return null;

    Object.assign(personToUpdate, updatePersonDto);

    return await this.peopleRepository.update(id, personToUpdate);
  }

  async remove(id: number): Promise<DeleteResult> {
    const personToUpdate: People = await this.findOne(id);

    if (!personToUpdate) return null;

    return this.peopleRepository.delete(id);
  }
}
