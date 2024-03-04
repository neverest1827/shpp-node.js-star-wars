import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  IsUrl,
} from 'class-validator';

export class CreateSpecieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  classification: string;

  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsNotEmpty()
  @IsNumber()
  average_height: string;

  @IsNotEmpty()
  @IsString()
  skin_colors: string;

  @IsNotEmpty()
  @IsString()
  hair_colors: string;

  @IsNotEmpty()
  @IsString()
  eye_colors: string;

  @IsNotEmpty()
  @IsNumber()
  average_lifespan: string;

  @IsNotEmpty()
  @IsUrl()
  homeworld: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  people: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  films: string[];

  @IsNotEmpty()
  @IsUrl()
  created: Date;

  @IsNotEmpty()
  @IsUrl()
  edited: Date;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
