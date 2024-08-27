import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayUnique,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class CreateStarshipDto {
  @ApiPropertyOptional({
    description: 'Name of the starship',
    example: 'Millennium Falcon',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Model of the starship',
    example: 'YT-1300 light freighter',
  })
  @IsString()
  model: string;

  @ApiPropertyOptional({
    description: 'Manufacturer of the starship',
    example: 'Corellian Engineering Corporation',
  })
  @IsString()
  manufacturer: string;

  @ApiPropertyOptional({
    description: 'Cost of the starship in credits',
    example: 100000,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Cost in credits must be a number' })
  cost_in_credits: number;

  @ApiPropertyOptional({
    description: 'Length of the starship in meters',
    example: 34.75,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Length must be a number' })
  length: number;

  @ApiPropertyOptional({
    description: 'Maximum atmospheric speed of the starship in km/h',
    example: 1050,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Maximum atmospheric speed must be a number' })
  max_atmosphering_speed: number;

  @ApiPropertyOptional({
    description: 'Crew required to operate the starship',
    example: 4,
  })
  @Type(() => Number)
  @IsInt({ message: 'Crew must be an integer' })
  crew: number;

  @ApiPropertyOptional({
    description: 'Number of passengers the starship can carry',
    example: 6,
  })
  @Type(() => Number)
  @IsInt({ message: 'Number of passengers must be an integer' })
  passengers: number;

  @ApiPropertyOptional({
    description: 'Cargo capacity of the starship in kilograms',
    example: 100000,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Cargo capacity must be a number' })
  cargo_capacity: number;

  @ApiPropertyOptional({
    description: 'Consumables the starship requires',
    example: '2 months',
  })
  @IsString()
  consumables: string;

  @ApiPropertyOptional({
    description: 'Hyperdrive rating of the starship',
    example: 0.5,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Hyperdrive rating must be a number' })
  hyperdrive_rating: number;

  @ApiPropertyOptional({
    description:
      'Maximum number of megalights the starship can travel in a standard hour',
    example: 75,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'MGLT must be a number' })
  MGLT: number;

  @ApiPropertyOptional({
    description: 'Class of the starship',
    example: 'Light freighter',
  })
  @IsString()
  starship_class: string;

  @ApiPropertyOptional({
    description: 'List of pilots of the starship',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  pilots: number[];

  @ApiPropertyOptional({
    description: 'List of films featuring the starship',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  films: number[];

  @ApiPropertyOptional({
    description: 'File names images of the starship',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
