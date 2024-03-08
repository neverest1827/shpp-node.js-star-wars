import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from '../people/entities/people.entity';
import { Color } from '../color/entities/color.entity';
import { Gender } from '../gender/entities/gender.entity';
import { Planet } from '../planet/entities/planet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([People, Color, Gender, Planet])],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
