import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planet])],
  controllers: [PlanetController],
  providers: [PlanetService],
})
export class PlanetModule {}
