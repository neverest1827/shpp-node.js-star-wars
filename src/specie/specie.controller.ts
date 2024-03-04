import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpecieService } from './specie.service';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Specie')
@Controller('api/v1/specie')
export class SpecieController {
  constructor(private readonly specieService: SpecieService) {}

  @Post()
  create(@Body() createSpecieDto: CreateSpecieDto) {
    return this.specieService.create(createSpecieDto);
  }

  @Get()
  findAll() {
    return this.specieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecieDto: UpdateSpecieDto) {
    return this.specieService.update(+id, updateSpecieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specieService.remove(+id);
  }
}
