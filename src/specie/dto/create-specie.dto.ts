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

export class CreateSpecieDto {
  @ApiPropertyOptional({
    description: 'Name of the species',
    example: 'Human',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Classification of the species',
    example: 'Mammal',
  })
  @IsString()
  classification: string;

  @ApiPropertyOptional({
    description: 'Designation of the species',
    example: 'Sentient',
  })
  @IsString()
  designation: string;

  @ApiPropertyOptional({
    description: 'Average height of the species in centimeters',
    example: 170,
  })
  @Type(() => Number)
  @IsNumber()
  average_height: number;

  @ApiPropertyOptional({
    description: 'Skin colors of the species',
    example: 'Fair, Brown, Black',
  })
  @IsString()
  skin_colors: string;

  @ApiPropertyOptional({
    description: 'Hair colors of the species',
    example: 'Black, Brown, Blond',
  })
  @IsString()
  hair_colors: string;

  @ApiPropertyOptional({
    description: 'Eye colors of the species',
    example: 'Brown, Blue, Green',
  })
  @IsString()
  eye_colors: string;

  @ApiPropertyOptional({
    description: 'Average lifespan of the species in years',
    example: 80,
  })
  @Type(() => Number)
  @IsNumber()
  average_lifespan: number;

  @ApiPropertyOptional({
    description: 'Planet id of the species',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  homeworld: number[];

  @ApiPropertyOptional({
    description: 'Language spoken by the species',
    example: 'Common',
  })
  @IsString()
  language: string;

  @ApiPropertyOptional({
    description: 'List id people belonging to the species',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  people: number[];

  @ApiPropertyOptional({
    description: 'List id films featuring the species',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  films: number[];

  @ApiPropertyOptional({
    description: 'File names images of the specie',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
