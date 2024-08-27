import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'Username',
    example: 'test',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'test',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
