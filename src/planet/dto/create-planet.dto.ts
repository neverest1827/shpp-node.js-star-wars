import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  IsDate,
  IsUrl,
} from 'class-validator';

export class CreatePlanetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  rotation_period: string;

  @IsNotEmpty()
  @IsString()
  orbital_period: string;

  @IsNotEmpty()
  @IsString()
  diameter: string;

  @IsNotEmpty()
  @IsString()
  climate: string;

  @IsNotEmpty()
  @IsString()
  gravity: string;

  @IsNotEmpty()
  @IsString()
  terrain: string;

  @IsNotEmpty()
  @IsString()
  surface_water: string;

  @IsNotEmpty()
  @IsString()
  population: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  residents: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  films: string[];

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
