import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayUnique,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateVehicleDto {
  @ApiPropertyOptional({
    description: 'Name of the vehicle',
    example: 'Speeder Bike',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Model of the vehicle',
    example: 'Speeder',
  })
  @IsString()
  model: string;

  @ApiPropertyOptional({
    description: 'Manufacturer of the vehicle',
    example: 'Sienar Fleet Systems',
  })
  @IsString()
  manufacturer: string;

  @ApiPropertyOptional({
    description: 'Cost of the vehicle in credits',
    example: 15000,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Cost in credits must be a number' })
  cost_in_credits: number;

  @ApiPropertyOptional({
    description: 'Length of the vehicle in meters',
    example: 3.4,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Length must be a number' })
  length: number;

  @ApiPropertyOptional({
    description: 'Maximum atmospheric speed of the vehicle in km/h',
    example: 400,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Maximum atmospheric speed must be a number' })
  max_atmosphering_speed: number;

  @ApiPropertyOptional({
    description: 'Crew required to operate the vehicle',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Crew must be a integer' })
  crew: number;

  @ApiPropertyOptional({
    description: 'Number of passengers the vehicle can carry',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Number of passengers must be a integer' })
  passengers: number;

  @ApiPropertyOptional({
    description: 'Cargo capacity of the vehicle in kilograms',
    example: 500,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Cargo capacity must be a number' })
  cargo_capacity: number;

  @ApiPropertyOptional({
    description: 'Consumables the vehicle requires',
    example: 'None',
  })
  @IsString()
  consumables: string;

  @ApiPropertyOptional({
    description: 'Class of the vehicle',
    example: 'Speeder',
  })
  @IsString()
  vehicle_class: string;

  @ApiPropertyOptional({
    description: 'List id of pilots of the vehicle',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  pilots: number[];

  @ApiPropertyOptional({
    description: 'List id films featuring the vehicle',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  films: number[];

  @ApiPropertyOptional({
    description: 'File names images of the vehicle',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
