import { Module } from '@nestjs/common';
import { StarshipService } from './starship.service';
import { StarshipController } from './starship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Starship]), CommonModule],
  controllers: [StarshipController],
  providers: [StarshipService],
})
export class StarshipModule {}
