import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe, Query
} from "@nestjs/common";
import { SpecieService } from './specie.service';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../role/role.decorator';
import { UserRole } from '../role/role.enum';
import { Public } from '../common/decorators/public.decorator';
import { Specie } from './entities/specie.entity';
import { Pagination } from "nestjs-typeorm-paginate";
import { Person } from "../person/entities/person.entity";

@Controller('api/v1/species')
@ApiTags('Specie')
export class SpecieController {
  constructor(private readonly specieService: SpecieService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  create(@Body() dto: CreateSpecieDto): Promise<OperationResult> {
    return this.specieService.create(dto);
  }

  @Get()
  @Public()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Specie>> {
    return this.specieService.findAll(page, limit);
  }

  @Get('names')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getNames(): Promise<Specie[]> {
    return this.specieService.getNames();
  }

  @Get('schema')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getFormSchema(): FormSchema {
    return this.specieService.getFormSchema();
  }

  @Get('items/:numPage/:limit')
  @Public()
  getCatalogItems(
    @Param('numPage', ParseIntPipe) numPage: number,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<Specie[]> {
    return this.specieService.getCatalogItems(numPage, limit);
  }

  @Get(':id')
  @Public()
  getEntityInfo(@Param('id', ParseIntPipe) id: number): Promise<Specie> {
    return this.specieService.getEntityInfo(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpecieDto,
  ): Promise<OperationResult> {
    return this.specieService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<OperationResult> {
    return this.specieService.remove(id);
  }
}
