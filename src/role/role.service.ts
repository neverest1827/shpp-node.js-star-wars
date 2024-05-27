import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(data: CreateRoleDto): Promise<Role> {
    const new_role: Role = this.roleRepository.create({
      value: data.value,
    });
    return this.roleRepository.save(new_role);
  }

  async findOne(value): Promise<Role> {
    return this.roleRepository.findOne({ where: { value } });
  }

  async delete(value) {
    const deleted_role: Role = await this.findOne(value);
    return this.roleRepository.delete(deleted_role);
  }
}
