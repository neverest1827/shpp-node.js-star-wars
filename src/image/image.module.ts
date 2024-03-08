import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { People } from '../people/entities/people.entity';
import { Film } from '../film/entities/film.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Specie } from '../specie/entities/specie.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Image,
      People,
      Film,
      Planet,
      Specie,
      Starship,
      Vehicle,
    ]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
