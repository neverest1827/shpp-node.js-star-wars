import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../role/role.enum';
import { Role } from '../role/entities/role.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  const createUserDto: CreateUserDto = {
    username: 'test',
    password: 'test',
  };
  const mockRole: Role = { id: 1, value: UserRole.User } as Role;
  const mockUser: User = {
    id: 1,
    username: 'test',
    password: 'test',
    roles: [mockRole],
  };

  let userService: UserService;
  let usersRepository: Repository<User>;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: RoleService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleService = module.get<RoleService>(RoleService);
  });

  describe('findOne', () => {
    it('should find a user by username', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

      const result: User = await userService.findOne(mockUser.username);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: mockUser.username },
        relations: ['roles'],
      });
    });

    it('should return undefined if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined);

      const result: User = await userService.findOne('undefined');
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', (): void => {
    it('should create a new user with a default role', async (): Promise<void> => {
      jest.spyOn(usersRepository, 'create').mockReturnValue({
        ...createUserDto,
        roles: [],
      } as User);
      jest.spyOn(roleService, 'findOne').mockResolvedValue(mockRole);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);

      const result: User = await userService.createUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(roleService.findOne).toHaveBeenCalledWith(UserRole.User);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        roles: [],
      });
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        roles: [mockRole],
      });
    });

    it('should throw an error if the default role does not exist', async () => {
      jest.spyOn(roleService, 'findOne').mockResolvedValue(null);

      await expect(userService.createUser(createUserDto)).rejects.toThrowError(
        'Default role not exist',
      );

      expect(roleService.findOne).toHaveBeenCalledWith(UserRole.User);
    });
  });

  describe('remove', (): void => {
    it('should remove a user by username', async (): Promise<void> => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(usersRepository, 'delete').mockResolvedValue(null);

      const result: OperationResult = await userService.remove(
        mockUser.username,
      );

      expect(result).toEqual({ success: true });
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username: mockUser.username },
      });
      expect(usersRepository.delete).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const username = 'unknownuser';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.remove(username)).rejects.toThrowError(
        NotFoundException,
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });
});
