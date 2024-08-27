import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../role/role.decorator';
import { UserRole } from '../role/role.enum';
import { OperationResult } from '../common/types/types';

@Controller('api/v1/user')
@ApiBearerAuth('access-token')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  @Roles(UserRole.Admin)
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Get(':username')
  @Roles(UserRole.User, UserRole.Admin)
  async findOne(@Param('username') username: string): Promise<User> {
    return await this.userService.findOne(username);
  }

  @Delete(':username')
  @Roles(UserRole.Admin)
  async remove(@Param('username') username: string): Promise<OperationResult> {
    return this.userService.remove(username);
  }
}
