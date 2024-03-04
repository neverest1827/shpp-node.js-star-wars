import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanetService } from './planet.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Planet')
@Controller('api/v1/planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Post()
  create(@Body() createPlanetDto: CreatePlanetDto) {
    return this.planetService.create(createPlanetDto);
  }

  @Get()
  findAll() {
    return this.planetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanetDto: UpdatePlanetDto) {
    return this.planetService.update(+id, updatePlanetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planetService.remove(+id);
  }
}
