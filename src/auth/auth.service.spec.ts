import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn(), // Mock for findOne method in UserService
    };

    const mockJwtService = {
      sign: jest.fn(), // Mock for sign method in JwtService
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if validation is successful', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        roles: [],
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toEqual({ id: 1, username: 'testuser', roles: [] });
    });

    it('should return null if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'testpass',
        roles: [],
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'wrongpass');
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate and return a JWT token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        roles: [{ id: 1, value: 'admin' }] as Role[],
      };

      const mockToken = 'test-jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.login(mockUser as User);
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});
