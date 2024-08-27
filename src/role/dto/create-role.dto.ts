import { UserRole } from '../role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'List user roles',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Value must be either "user" or "admin"' })
  value: UserRole;
}
