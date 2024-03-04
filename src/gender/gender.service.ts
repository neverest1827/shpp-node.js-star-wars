import { Injectable } from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Gender } from './entities/gender.entity';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
  ) {}
  async create(createGenderDto: CreateGenderDto): Promise<Gender> {
    return await this.genderRepository.save({ value: createGenderDto.value });
  }

  async findAll(): Promise<Gender[]> {
    return await this.genderRepository.find();
  }

  async findOne(id: number): Promise<Gender> {
    return await this.genderRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateGenderDto: UpdateGenderDto,
  ): Promise<UpdateResult> {
    return await this.genderRepository.update(id, {
      value: updateGenderDto.value,
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.genderRepository.delete(id);
  }
}
