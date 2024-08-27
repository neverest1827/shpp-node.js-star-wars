import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../role/role.decorator';
import { UserRole } from '../role/role.enum';
import { Public } from '../common/decorators/public.decorator';
import { FormSchema, OperationResult } from '../common/types/types';
import { Vehicle } from './entities/vehicle.entity';

@Controller('api/v1/vehicles')
@ApiTags('Vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  create(@Body() dto: CreateVehicleDto): Promise<OperationResult> {
    return this.vehicleService.create(dto);
  }

  @Get('names')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getNames(): Promise<Vehicle[]> {
    return this.vehicleService.getNames();
  }

  @Get('schema')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  getFormSchema(): FormSchema {
    return this.vehicleService.getFormSchema();
  }

  @Get('items/:numPage/:limit')
  @Public()
  getCatalogItems(
    @Param('numPage', ParseIntPipe) numPage: number,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<Vehicle[]> {
    return this.vehicleService.getCatalogItems(numPage, limit);
  }

  @Get(':id')
  @Public()
  getEntityInfo(@Param('id', ParseIntPipe) id: number): Promise<Vehicle> {
    return this.vehicleService.getEntityInfo(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
  ): Promise<OperationResult> {
    return this.vehicleService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseIntPipe) id: number): Promise<OperationResult> {
    return this.vehicleService.remove(id);
  }
}
