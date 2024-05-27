import { Role } from '../role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  value: Role;
}