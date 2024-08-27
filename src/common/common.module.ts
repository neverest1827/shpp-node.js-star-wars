import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../person/entities/person.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Film } from '../film/entities/film.entity';
import { Specie } from '../specie/entities/specie.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Image } from '../image/entities/image.entity';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Person,
      Planet,
      Film,
      Specie,
      Vehicle,
      Starship,
      Image,
    ]),
    ImageModule,
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
