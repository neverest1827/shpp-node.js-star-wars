import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PlanetService } from './planet.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../role/role.decorator';
import { UserRole } from '../role/role.enum';
import { Public } from '../common/decorators/public.decorator';
import { Planet } from './entities/planet.entity';

@Controller('api/v1/planets')
@ApiTags('Planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  create(@Body() dto: CreatePlanetDto): Promise<OperationResult> {
    return this.planetService.create(dto);
  }

  @Get('names')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getNames(): Promise<Planet[]> {
    return this.planetService.getNames();
  }

  @Get('schema')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getFormSchema(): FormSchema {
    return this.planetService.getFormSchema();
  }

  @Get('items/:numPage/:limit')
  @Public()
  getCatalogItems(
    @Param('numPage', ParseIntPipe) numPage: number,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<Planet[]> {
    return this.planetService.getCatalogItems(numPage, limit);
  }

  @Get(':id')
  @Public()
  getEntityInfo(@Param('id', ParseIntPipe) id: number): Promise<Planet> {
    return this.planetService.getEntityInfo(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlanetDto,
  ): Promise<OperationResult> {
    return this.planetService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<OperationResult> {
    return this.planetService.remove(id);
  }
}
