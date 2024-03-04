type Requests = {
  people: string;
  planets: string;
  films: string;
  species: string;
  vehicles: string;
  starships: string;
};

type TPeople = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
};

type TPlanet = {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

type TFilm = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
};

type TSpecie = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string | null;
  language: string;
  people: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

type TVehicle = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

type TStarship = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

type ResponseData =
  | TPeople[]
  | TPlanet[]
  | TFilm[]
  | TSpecie[]
  | TVehicle[]
  | TStarship[];

type Data = {
  people: TPeople[];
  planets: TPlanet[];
  films: TFilm[];
  species: TSpecie[];
  vehicles: TVehicle[];
  starships: TStarship[];
};

type Repositories = {
  people: Repository<People>;
  planet: Repository<Planet>;
  film: Repository<Film>;
  specie: Repository<Specie>;
  vehicle: Repository<Vehicle>;
  starship: Repository<Starship>;
  image: Repository<Image>;
  color: Repository<Color>;
  gender: Repository<Gender>;
};

type Rep =
  | Repository<People>
  | Repository<Planet>
  | Repository<Film>
  | Repository<Specie>
  | Repository<Vehicle>
  | Repository<Starship>
  | Repository<Image>
  | Repository<Color>
  | Repository<Gender>;

type Entities =
  | People
  | Planet
  | Film
  | Specie
  | Vehicle
  | Starship
  | Image
  | Color
  | Gender;
