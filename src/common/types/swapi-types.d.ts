import { Person } from '../../people/entities/person.entity';
import { Repository } from 'typeorm';
import { Planet } from '../../planet/entities/planet.entity';
import { Specie } from '../../specie/entities/specie.entity';
import { Film } from '../../film/entities/film.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Starship } from '../../starship/entities/starship.entity';

type SwapiPerson = {
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

type SwapiPlanet = {
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

type SwapiFilm = {
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

type SwapiSpecie = {
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

type SwapiVehicle = {
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

type SwapiStarship = {
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

type SwapiEntity =
  | SwapiPerson
  | SwapiPlanet
  | SwapiFilm
  | SwapiSpecie
  | SwapiVehicle
  | SwapiStarship;

type SwapiData = {
  people: SwapiPerson[];
  planets: SwapiPlanet[];
  films: SwapiFilm[];
  species: SwapiSpecie[];
  vehicles: SwapiVehicle[];
  starships: SwapiStarship[];
};

type ApiEndpoints = {
  people: string;
  planets: string;
  films: string;
  species: string;
  vehicles: string;
  starships: string;
};

type Repositories = {
  person: Repository<Person>;
  planet: Repository<Planet>;
  film: Repository<Film>;
  specie: Repository<Specie>;
  vehicle: Repository<Vehicle>;
  starship: Repository<Starship>;
};

type SimpleTypeDatabase = 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'mssql';
