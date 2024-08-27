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

  /**
   * Creates a new role and saves it to the database.
   *
   * @param {CreateRoleDto} data - The data for creating a new role.
   * @returns {Promise<OperationResult>} A promise that resolves to an operation result indicating success.
   */
  async createRole(data: CreateRoleDto): Promise<OperationResult> {
    const new_role: Role = this.roleRepository.create({
      value: data.value,
    });
    await this.roleRepository.save(new_role);
    return { success: true };
  }

  /**
   * Finds a role by its value.
   *
   * @param {string} value - The value of the role to find.
   * @returns {Promise<Role>} A promise that resolves to the role with the specified value.
   * @throws {NotFoundException} If the role with the specified value is not found.
   */
  async findOne(value: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { value } });
  }

  /**
   * Removes a role from the database by its value.
   *
   * @param {string} value - The value of the role to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to an operation result indicating success.
   * @throws {NotFoundException} If the role with the specified value is not found.
   */
  async remove(value: string): Promise<OperationResult> {
    const deleted_role: Role = await this.findOne(value);
    await this.roleRepository.remove(deleted_role);
    return { success: true };
  }
}
