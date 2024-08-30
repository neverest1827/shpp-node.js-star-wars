import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../role/role.enum';
import { Roles } from '../role/role.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Person } from './entities/person.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('api/v1/people')
@ApiTags('People')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  create(@Body() dto: CreatePersonDto): Promise<OperationResult> {
    return this.personService.create(dto);
  }

  @Get()
  @Public()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Person>> {
    return this.personService.findAll(page, limit);
  }

  @Get('names')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getNames(): Promise<Person[]> {
    return this.personService.getNames();
  }

  @Get('schema')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getFormSchema(): FormSchema {
    return this.personService.getFormSchema();
  }

  @Get('items/:numPage/:limit')
  @Public()
  getCatalogItems(
    @Param('numPage', ParseIntPipe) numPage: number,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<Person[]> {
    return this.personService.getCatalogItems(numPage, limit);
  }

  @Get(':id')
  @Public()
  getEntityInfo(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return this.personService.getEntityInfo(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonDto,
  ): Promise<OperationResult> {
    return this.personService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<OperationResult> {
    return this.personService.remove(id);
  }
}
