type RequestWithUser = Request & {
  user: User;
};

type Token = {
  access_token: string;
};

type EntityType =
  | Person
  | Planet
  | Film
  | Specie
  | Vehicle
  | Starship
  | Image
  | User
  | Role;

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
