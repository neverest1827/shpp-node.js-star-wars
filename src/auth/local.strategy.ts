import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validates the user's credentials (username and password) and returns the user object if valid.
   *
   * @param {string} username - The username of the user to validate.
   * @param {string} password - The password of the user to validate.
   * @returns {Promise<ValidateUser>} A promise that resolves to the user object if the credentials are valid.
   * @throws {UnauthorizedException} If the credentials are invalid or the user cannot be validated.
   */
  async validate(username: string, password: string): Promise<ValidateUser> {
    const user: ValidateUser = await this.authService.validateUser(
      username,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
