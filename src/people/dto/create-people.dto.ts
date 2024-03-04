import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayUnique,
  ArrayMinSize,
  IsDate,
} from 'class-validator';

export class CreatePeopleDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  height: string;
  @IsNotEmpty()
  @IsString()
  mass: string;
  @IsNotEmpty()
  @IsString()
  hair_color: string;
  @IsNotEmpty()
  @IsString()
  skin_color: string;
  @IsNotEmpty()
  @IsString()
  eye_color: string;
  @IsNotEmpty()
  @IsString()
  birth_year: string;
  @IsNotEmpty()
  @IsString()
  gender: string;
  @IsNotEmpty()
  @IsString()
  homeworld: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ArrayUnique()
  films: string[];
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ArrayUnique()
  species: string[];
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ArrayUnique()
  vehicles: string[];
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ArrayUnique()
  starships: string[];
  @IsNotEmpty()
  @IsDate()
  created: Date;
  @IsNotEmpty()
  @IsDate()
  edited: Date;
  @IsNotEmpty()
  @IsString({ each: true })
  url: string;
}
