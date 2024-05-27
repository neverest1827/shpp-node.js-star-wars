import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService, RoleService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
