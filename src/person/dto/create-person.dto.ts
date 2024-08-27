import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayUnique,
  IsOptional,
  IsNumber,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePersonDto {
  @ApiProperty({
    description: 'Name of the person',
    example: 'Test',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Height of the person',
    example: 175,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Height must be a number' })
  height: number;

  @ApiProperty({
    description: 'Mass of the person',
    example: 65,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Mass must be a number' })
  mass: number;

  @ApiProperty({
    description: 'Hair color of the person',
    example: 'blond',
  })
  @IsString()
  hair_color: string;

  @ApiProperty({
    description: 'Skin color of the person',
    example: 'white',
  })
  @IsString()
  skin_color: string;

  @ApiProperty({
    description: 'Eye color of the person',
    example: 'blue',
  })
  @IsString()
  eye_color: string;

  @ApiProperty({
    description: 'Birth year of the person',
    example: '19BBY',
  })
  @IsString()
  birth_year: string;

  @ApiProperty({
    description: 'Gender of the person',
    example: 'male',
  })
  @IsString()
  gender: string;

  @ApiPropertyOptional({
    description: 'Planet id of the person',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  homeworld: number[];

  @ApiPropertyOptional({
    description: 'Films id in which the person appeared',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  films: number[];

  @ApiPropertyOptional({
    description: 'Species id of the person',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  species: number[];

  @ApiPropertyOptional({
    description: 'Vehicles id used by the person',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  vehicles: number[];

  @ApiPropertyOptional({
    description: 'Starships id owned by the person',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  starships: number[];

  @ApiPropertyOptional({
    description: 'File names images of the person',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  images: string[];
}
