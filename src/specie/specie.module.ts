import { Module } from '@nestjs/common';
import { SpecieService } from './specie.service';
import { SpecieController } from './specie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specie } from './entities/specie.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Specie]), CommonModule],
  controllers: [SpecieController],
  providers: [SpecieService],
})
export class SpecieModule {}
