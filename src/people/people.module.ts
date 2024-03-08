import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { Color } from '../color/entities/color.entity';
import { Gender } from '../gender/entities/gender.entity';
import { Planet } from '../planet/entities/planet.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([People, Color, Gender, Planet]),
    CommonModule,
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
