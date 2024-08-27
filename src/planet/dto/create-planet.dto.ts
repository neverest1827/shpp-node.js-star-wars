import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayUnique,
  IsOptional,
  IsNumber,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePlanetDto {
  @ApiPropertyOptional({
    description: 'Name of the planet',
    example: 'Earth',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Rotation period of the planet',
    example: 24,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Rotation period must be a number' })
  rotation_period: number;

  @ApiPropertyOptional({
    description: 'Orbital period of the planet',
    example: 365,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Orbital period must be a number' })
  orbital_period: number;

  @ApiPropertyOptional({
    description: 'Diameter of the planet in kilometers',
    example: 12742,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Diameter must be a number' })
  diameter: number;

  @ApiPropertyOptional({
    description: 'Climate of the planet',
    example: 'Temperate',
  })
  @IsString()
  climate: string;

  @ApiPropertyOptional({
    description: 'Gravity of the planet',
    example: '1 standard',
  })
  @IsString()
  gravity: string;

  @ApiPropertyOptional({
    description: 'Terrain of the planet',
    example: 'Forests, mountains, oceans',
  })
  @IsString()
  terrain: string;

  @ApiPropertyOptional({
    description: 'Surface water percentage of the planet',
    example: 71,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Surface water must be a number' })
  surface_water: number;

  @ApiPropertyOptional({
    description: 'Population of the planet',
    example: 7000000000,
  })
  @Type(() => Number)
  @IsInt({ message: 'Water for the public should be an integer' })
  population: number;

  @ApiPropertyOptional({
    description: 'List id residents of the planet',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  residents: number[];

  @ApiPropertyOptional({
    description: 'List id films featuring the planet',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  films: number[];

  @ApiPropertyOptional({
    description: 'File names images of the planet',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
