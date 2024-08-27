import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Planet]), CommonModule],
  controllers: [PlanetController],
  providers: [PlanetService],
  exports: [PlanetService],
})
export class PlanetModule {}
