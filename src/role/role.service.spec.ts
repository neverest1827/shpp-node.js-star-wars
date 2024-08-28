import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { NotFoundException } from '@nestjs/common';
import { UserRole } from './role.enum';

describe('RoleService', (): void => {
  const mockRole: Role = { id: 1, value: UserRole.User } as Role;

  let roleService: RoleService;
  let roleRepository: Repository<Role>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  describe('createRole', (): void => {
    it('should create a new role and save it to the database', async () => {
      jest.spyOn(roleRepository, 'create').mockReturnValue(mockRole);
      jest.spyOn(roleRepository, 'save').mockResolvedValue(mockRole);

      const result: OperationResult = await roleService.createRole({
        value: UserRole.User,
      });

      expect(result).toEqual({ success: true });
      expect(roleRepository.create).toHaveBeenCalledWith({
        value: UserRole.User,
      });
      expect(roleRepository.save).toHaveBeenCalledWith(mockRole);
    });
  });

  describe('findOne', (): void => {
    it('should find and return a role by its value', async (): Promise<void> => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);

      const result: Role = await roleService.findOne(UserRole.User);

      expect(result).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { value: UserRole.User },
      });
    });

    it('should throw a NotFoundException if the role is not found', async (): Promise<void> => {
      const roleValue: string = 'NON_EXISTENT_ROLE';

      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(roleService.findOne(roleValue)).rejects.toThrowError(
        NotFoundException,
      );
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { value: roleValue },
      });
    });
  });

  describe('remove', (): void => {
    it('should remove a role by its value', async (): Promise<void> => {
      jest.spyOn(roleService, 'findOne').mockResolvedValue(mockRole);
      jest.spyOn(roleRepository, 'remove').mockResolvedValue(mockRole);

      const result: OperationResult = await roleService.remove(UserRole.User);

      expect(result).toEqual({ success: true });
      expect(roleService.findOne).toHaveBeenCalledWith(UserRole.User);
      expect(roleRepository.remove).toHaveBeenCalledWith(mockRole);
    });

    it('should throw a NotFoundException if the role to remove is not found', async (): Promise<void> => {
      const roleValue: string = 'NON_EXISTENT_ROLE';

      jest.spyOn(roleService, 'findOne').mockResolvedValue(null);

      await expect(roleService.remove(roleValue)).rejects.toThrowError(
        NotFoundException,
      );
      expect(roleService.findOne).toHaveBeenCalledWith(roleValue);
    });
  });
});
