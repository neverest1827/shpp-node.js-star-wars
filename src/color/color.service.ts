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
    const new_color: Color = await this.colorRepository.create({
      value: createColorDto.value,
    });
    return await this.colorRepository.save(new_color);
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
    const color: Color = await this.findOne(id);

    if (!color) return null;

    return await this.colorRepository.update(id, {
      value: updateColorDto.value,
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    const color: Color = await this.findOne(id);

    if (!color) return null;

    return await this.colorRepository.delete(id);
  }
}
