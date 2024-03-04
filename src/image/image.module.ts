import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { People } from '../people/entities/people.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, People])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
