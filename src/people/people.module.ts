import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleEntity } from './entities/people.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PeopleEntity])],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
