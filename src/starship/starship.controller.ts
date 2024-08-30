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
import { StarshipService } from './starship.service';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../role/role.decorator';
import { UserRole } from '../role/role.enum';
import { Public } from '../common/decorators/public.decorator';
import { Starship } from './entities/starship.entity';
import { Pagination } from "nestjs-typeorm-paginate";

@Controller('api/v1/starships')
@ApiTags('Starship')
export class StarshipController {
  constructor(private readonly starshipService: StarshipService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  create(@Body() dto: CreateStarshipDto): Promise<OperationResult> {
    return this.starshipService.create(dto);
  }

  @Get()
  @Public()
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Starship>> {
    return this.starshipService.findAll(page, limit);
  }

  @Get('names')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getNames(): Promise<Starship[]> {
    return this.starshipService.getNames();
  }

  @Get('schema')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getFormSchema(): FormSchema {
    return this.starshipService.getFormSchema();
  }

  @Get('items/:numPage/:limit')
  @Public()
  getCatalogItems(
    @Param('numPage', ParseIntPipe) numPage: number,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<Starship[]> {
    return this.starshipService.getCatalogItems(numPage, limit);
  }

  @Get(':id')
  @Public()
  getEntityInfo(@Param('id', ParseIntPipe) id: number): Promise<Starship> {
    return this.starshipService.getEntityInfo(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStarshipDto,
  ): Promise<OperationResult> {
    return this.starshipService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<OperationResult> {
    return this.starshipService.remove(id);
  }
}
