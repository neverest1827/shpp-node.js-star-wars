import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '' })
  username: string;

  @ApiProperty({ example: '' })
  password: string;
}
