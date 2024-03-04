import { Injectable } from '@nestjs/common';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { Repository } from 'typeorm';
import { Color } from '../color/entities/color.entity';
import { Gender } from '../gender/entities/gender.entity';
import { Planet } from '../planet/entities/planet.entity';
import { CommonService } from '../common/common.service';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
    private readonly commonService: CommonService,
  ) {}
  async create(createPersonDto: CreatePeopleDto) {
    const id: number = (await this.peopleRepository.count()) + 1;
    return this.peopleRepository.create({
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
  }

  async findAll() {
    return await this.peopleRepository.find();
  }

  async findOne(id: number) {
    return await this.peopleRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updatePersonDto: UpdatePeopleDto) {
    const personToUpdate: People = await this.peopleRepository.findOne({
      where: { id: id },
    });
    if (!personToUpdate) {
      return null;
    }

    // Применяем изменения из UpdateFilmDto к сущности
    Object.assign(personToUpdate, updatePersonDto);

    return await this.peopleRepository.update(id, personToUpdate);
  }

  async remove(id: number) {
    return this.peopleRepository.delete(id);
  }
}
