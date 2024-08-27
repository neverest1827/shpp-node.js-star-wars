import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user by checking the provided username and password.
   *
   * @param {string} username - The username of the user to validate.
   * @param {string} pass - The password of the user to validate.
   * @returns {Promise<ValidateUser | null>} A promise that resolves to a `ValidateUser` object (excluding the password) if the username and password are correct, or `null` if validation fails.
   * @throws {Error} If an error occurs while fetching the user from the service.
   */
  async validateUser(username: string, pass: string): Promise<ValidateUser> {
    const user: User = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Authenticates a user and generates a JWT token.
   *
   * @param {User} user - The user object containing the username, id, and roles.
   * @returns {Promise<Token>} A promise that resolves to an object containing the JWT access token.
   * @throws {Error} If an error occurs while generating the token.
   */
  async login(user: User): Promise<Token> {
    const payload: Payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles.map((role: Role) => role.value),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
