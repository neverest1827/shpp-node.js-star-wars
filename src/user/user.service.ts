import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  async createUser(data): Promise<User> {
    const new_user: User = this.usersRepository.create({
      username: data.username,
      password: data.password,
      role: [],
    });
    const defaultRole: Role = await this.roleService.findOne('user');
    new_user.role.push(defaultRole);
    return this.usersRepository.save(new_user);
  }

  async updateUser(data) {
    return '';
  }

  async deleteUser(userName) {
    return '';
  }
}
