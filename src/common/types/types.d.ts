import { Planet } from '../../planet/entities/planet.entity';
import { Film } from '../../film/entities/film.entity';
import { Specie } from '../../specie/entities/specie.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Starship } from '../../starship/entities/starship.entity';
import { Role } from '../../role/entities/role.entity';

type RequestWithUser = Request & {
  user: User;
};

type Token = {
  access_token: string;
};

type EntityType = Person | Planet | Film | Specie | Vehicle | Starship;

type OperationResult = {
  success: boolean;
  name?: string;
};

type FormSchema = {
  [key: string]: string;
};

type UploadParams = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
};

type Credentials = { accessKeyId: string; secretAccessKey: string };
type Payload = { username: string; sub: number; roles: string[] };
type ValidateUser = { id: number; username: string; roles: Role[] };
