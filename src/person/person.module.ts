import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), CommonModule],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService], // TODO проверить где я его использую и если нигде то удалить
})
export class PersonModule {}
