import {
  Controller,
  UseGuards,
  Get,
  Res,
  Post,
  Request,
  Body,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto } from './auth/dto/login-auth.dto';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { Public } from './common/decorators/public.decorator';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Roles } from './role/role.decorator';
import { UserRole } from './role/role.enum';

@Controller()
@ApiTags('index')
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  @Public()
  async getIndexPage(@Res() res: Response): Promise<void> {
    return res.render('index.hbs');
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Public()
  async login(@Request() req: RequestWithUser): Promise<Token> {
    return this.authService.login(req.user);
  }

  @Get('/profile')
  @Public()
  getProfilePage(@Res() res: Response): void {
    return res.render('profile');
  }

  @Get('/:entity/:id')
  @Public()
  getEntityPage(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): void {
    return res.render('entity');
  }

  @Post('/register')
  @Public()
  async register(@Body() body: CreateUserDto): Promise<Token> {
    const user: User = await this.userService.createUser(body);
    if (user) {
      return this.authService.login(user);
    }
  }

  @Get('/admin')
  @Public()
  getAdminPage(@Res() res: Response): void {
    return res.render('admin');
  }

  @Get('/api/v1/admin')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getAdminInterface(@Res() res: Response): void {
    return res.render('interface');
  }
}
