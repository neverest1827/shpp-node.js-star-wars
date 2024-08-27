import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFilmDto {
  @ApiPropertyOptional({
    description: 'Title of the film',
    example: 'A New Hope',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Episode ID of the film',
    example: 3,
  })
  @Type(() => Number)
  @IsInt({ message: 'Episode should be an integer' })
  episode_id: number;

  @ApiPropertyOptional({
    description: 'Opening crawl text of the film',
    example: 'It is a period of civil war...',
  })
  @IsString()
  opening_crawl: string;

  @ApiPropertyOptional({
    description: 'Director of the film',
    example: 'George Lucas',
  })
  @IsString()
  director: string;

  @ApiPropertyOptional({
    description: 'Producer of the film',
    example: 'Gary Kurtz',
  })
  @IsString()
  producer: string;

  @ApiPropertyOptional({
    description: 'Release date of the film',
    example: '1977-05-25',
  })
  @IsString()
  release_date: string;

  @ApiPropertyOptional({
    description: 'List id characters featured in the film',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  characters: number[];

  @ApiPropertyOptional({
    description: 'List id planets featured in the film',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  planets: number[];

  @ApiPropertyOptional({
    description: 'List id of starships featured in the film',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  starships: number[];

  @ApiPropertyOptional({
    description: 'List id vehicles featured in the film',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  vehicles: number[];

  @ApiPropertyOptional({
    description: 'List id species featured in the film',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ArrayUnique()
  species: number[];

  @ApiPropertyOptional({
    description: 'File names images of the film',
    example: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
