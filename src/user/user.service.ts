import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../role/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  /**
   * Finds a user by their username, including their roles.
   *
   * @param {string} username - The username of the user to find.
   * @returns {Promise<User>} A promise that resolves to the user with the specified username, or `undefined` if not found.
   */
  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  /**
   * Creates a new user with the specified data and assigns a default role.
   *
   * @param {CreateUserDto} data - The data for creating a new user.
   * @returns {Promise<User>} A promise that resolves to the newly created user.
   * @throws {Error} If the default role does not exist.
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const new_user: User = this.usersRepository.create({
      username: data.username,
      password: data.password,
      roles: [],
    });
    const defaultRole: Role = await this.roleService.findOne(UserRole.User);

    if (!defaultRole) throw new Error('Default role not exist');

    new_user.roles.push(defaultRole);
    return this.usersRepository.save(new_user);
  }

  /**
   * Removes a user by their username.
   *
   * @param {string} username - The username of the user to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to an operation result indicating success.
   * @throws {NotFoundException} If the user with the specified username is not found.
   */
  async remove(username: string): Promise<OperationResult> {
    const user: User = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    await this.usersRepository.delete(user);
    return { success: true };
  }
}
