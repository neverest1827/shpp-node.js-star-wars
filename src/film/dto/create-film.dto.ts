import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  episode_id: number;

  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @IsNotEmpty()
  @IsString()
  director: string;

  @IsNotEmpty()
  @IsString()
  producer: string;

  @IsNotEmpty()
  @IsDate()
  release_date: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  characters: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  planets: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  starships: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  vehicles: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  species: string[];

  @IsNotEmpty()
  @IsDate()
  created: Date;

  @IsNotEmpty()
  @IsDate()
  edited: Date;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
