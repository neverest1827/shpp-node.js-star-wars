import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  IsUrl,
} from 'class-validator';
export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  manufacturer: string;

  @IsNotEmpty()
  @IsNumber()
  cost_in_credits: string;

  @IsNotEmpty()
  @IsNumber()
  length: string;

  @IsNotEmpty()
  @IsNumber()
  max_atmosphering_speed: string;

  @IsNotEmpty()
  @IsString()
  crew: string;

  @IsNotEmpty()
  @IsNumber()
  passengers: string;

  @IsNotEmpty()
  @IsNumber()
  cargo_capacity: string;

  @IsNotEmpty()
  @IsString()
  consumables: string;

  @IsNotEmpty()
  @IsString()
  vehicle_class: string;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayUnique()
  pilots: string[];

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
