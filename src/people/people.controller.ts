import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, UseGuards
} from "@nestjs/common";
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from "../role/role.enum";
import { Roles } from "../role/role.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../role/role.guard";

@Controller('api/v1/people')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('People')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createPersonDto: CreatePeopleDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get()
  @Roles(Role.User)
  findAll() {
    return this.peopleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePeopleDto,
  ) {
    return this.peopleService.update(id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.remove(id);
  }
}
