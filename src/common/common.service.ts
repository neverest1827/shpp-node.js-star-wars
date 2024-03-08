import { Injectable } from '@nestjs/common';
import { Color } from '../color/entities/color.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from '../people/entities/people.entity';
import { Repository } from 'typeorm';
import { Gender } from '../gender/entities/gender.entity';
import { Planet } from '../planet/entities/planet.entity';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
    @InjectRepository(Planet)
    private planetRepository: Repository<Planet>,
  ) {}
  createUrl(id: number, entity: string): string {
    return `http://localhost:3000/api/${entity}/${id}`;
  }

  async getColor(colorValue: string): Promise<Color> {
    const color: Color = await this.colorRepository.findOne({
      where: { value: colorValue },
    });

    if (!color) {
      return await this.colorRepository.create({ value: colorValue });
    }

    return color;
  }

  async getGender(genderValue: string): Promise<Gender> {
    const gender: Gender = await this.genderRepository.findOne({
      where: { value: genderValue },
    });

    if (!gender) {
      return await this.genderRepository.create({ value: genderValue });
    }

    return gender;
  }

  async getHomeWorld(homeWorldName: string): Promise<Planet> {
    return await this.planetRepository.findOne({
      where: { name: homeWorldName },
    });
  }
}
