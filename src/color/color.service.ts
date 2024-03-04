import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Color } from './entities/color.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}
  async create(createColorDto: CreateColorDto): Promise<Color> {
    return await this.colorRepository.create({ value: createColorDto.value });
  }

  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }

  async findOne(id: number): Promise<Color> {
    return await this.colorRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateColorDto: UpdateColorDto,
  ): Promise<UpdateResult> {
    return await this.colorRepository.update(id, {
      value: updateColorDto.value,
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.colorRepository.delete(id);
  }
}
