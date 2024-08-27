import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and returns the user details.
   *
   * @param {any} payload - The payload extracted from the JWT.
   * @returns {Promise<{ userId: number, username: string, roles: string[] }>} The user details extracted from the payload.
   * @throws {Error} If validation fails or the payload does not contain the required fields.
   */
  async validate(
    payload: any,
  ): Promise<{ userId: number; username: string; roles: string[] }> {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles || [],
    };
  }
}
