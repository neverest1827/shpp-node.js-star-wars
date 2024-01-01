import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { PeopleEntity } from '../people/entities/people.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity, PeopleEntity])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
