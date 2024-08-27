import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from './role.decorator';
import { UserRole } from './role.enum';

@Controller('api/roles')
@ApiBearerAuth('access-token')
@ApiTags('Role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Post()
  @Roles(UserRole.Admin)
  async create(@Body() body: CreateRoleDto): Promise<OperationResult> {
    return this.roleService.createRole(body);
  }

  @Delete(':value')
  @Roles(UserRole.Admin)
  async remove(@Param('value') value: string): Promise<OperationResult> {
    return this.roleService.remove(value);
  }
}
