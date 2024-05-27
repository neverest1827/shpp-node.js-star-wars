import {
  Controller,
  UseGuards,
  Get,
  Res,
  Post,
  Request,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto } from './auth/dto/login-auth.dto';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';

@ApiTags('index')
@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @Get()
  async getIndexPage(@Res() res: Response) {
    return res.render('index');
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBearerAuth('access-token')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    const user: User = await this.userService.createUser(body);
    if (user) {
      return this.authService.login(user);
    }
  }
}
