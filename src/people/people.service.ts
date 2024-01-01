import { Injectable } from '@nestjs/common';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleEntity } from './entities/people.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(PeopleEntity)
    private peopleRepository: Repository<PeopleEntity>,
  ) {}
  create(createPersonDto: CreatePeopleDto) {
    return 'This action adds a new person' + createPersonDto;
  }

  findAll() {
    return `This action returns all people`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePeopleDto) {
    return `This action updates a #${id} person` + updatePersonDto;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
