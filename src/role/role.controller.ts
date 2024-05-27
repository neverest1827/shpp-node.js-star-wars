import { Body, Controller, Delete, Post } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('api/role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Post()
  async createRole(@Body() body: CreateRoleDto){
    return this.roleService.create(body);
  }
}
