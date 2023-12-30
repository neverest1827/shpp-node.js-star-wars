import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsArray,
  ArrayUnique,
  ArrayMinSize,
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
  @IsIn(['male', 'female', 'n/a'])
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
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ArrayUnique()
  created: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ArrayUnique()
  edited: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ArrayUnique()
  url: string;
}
