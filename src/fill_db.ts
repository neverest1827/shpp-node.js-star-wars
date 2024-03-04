import { DataSource, Repository } from 'typeorm';
import { People } from './people/entities/people.entity';
import { Planet } from './planet/entities/planet.entity';
import { Film } from './film/entities/film.entity';
import { Specie } from './specie/entities/specie.entity';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { Starship } from './starship/entities/starship.entity';
import { Image } from './image/entities/image.entity';
import { Color } from './color/entities/color.entity';
import { Gender } from './gender/entities/gender.entity';

function loadingLog(
  target: string,
  totalCount: number = 100,
  loadedCount: number = 0,
) {
  const progressBarLength: number = 30;
  const progressBar = Array(progressBarLength).fill(' ');
  const spaces = Array(10 - target.length).fill(' ');

  const progress: number = Math.floor(
    (loadedCount / totalCount) * progressBarLength,
  );

  for (let i = 0; i < progress; i++) {
    progressBar[i] = '|';
  }

  process.stdout.write(
    `\r${target} loading:${spaces.join('')}[${progressBar.join(
      '',
    )}] ${Math.round((loadedCount / totalCount) * 100)}%`,
  );

  for (let i = 0; i < progress; i++) {
    progressBar[i] = ' ';
  }
}

async function getRequests(): Promise<Requests> {
  try {
    const response: Response = await fetch('https://swapi.dev/api/');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function fillDB() {
  const data: Data = await getData();
  const entities: Entities = [
    People,
    Planet,
    Film,
    Specie,
    Vehicle,
    Starship,
    Image,
    Color,
    Gender,
  ];
  const AppDataSource: DataSource = getAppdataSource(entities);
  await AppDataSource.initialize();

  const repositories: Repositories = await getRepositories(
    AppDataSource,
    entities,
  );

  try {
    for (const film of data.films) {
      if (repositories.film.hasId(getId(film.url))) continue;
      const createdFilm: Film = await createFilm(film, repositories.film);
      await repositories.film.save(createdFilm);
    }
    for (const specie of data.species) {
      if (repositories.specie.hasId(getId(specie.url))) continue;
      const createdSpecie: Specie = await createSpecie(
        specie,
        repositories.specie,
      );
      createdSpecie.films = await createRelations(
        specie.films,
        repositories.film,
      );
      await repositories.specie.save(createdSpecie);
    }
    for (const starship of data.starships) {
      if (repositories.starship.hasId(getId(starship.url))) continue;
      const createdStarship: Starship = await createStarship(
        starship,
        repositories.starship,
      );
      createdStarship.films = await createRelations(
        starship.films,
        repositories.film,
      );
      await repositories.starship.save(createdStarship);
    }
    for (const vehicle of data.vehicles) {
      if (repositories.vehicle.hasId(getId(vehicle.url))) continue;
      const createdVehicle: Vehicle = await createVehicle(
        vehicle,
        repositories.vehicle,
      );
      createdVehicle.films = await createRelations(
        vehicle.films,
        repositories.film,
      );
      await repositories.vehicle.save(createdVehicle);
    }
    for (const planet of data.planets) {
      if (repositories.planet.hasId(getId(planet.url))) continue;
      const createdPlanet: Planet = await createPlanet(
        planet,
        repositories.planet,
      );
      createdPlanet.films = await createRelations(
        planet.films,
        repositories.film,
      );
      await repositories.planet.save(createdPlanet);
    }

    const personRelations = {
      films: 'film',
      species: 'specie',
      starships: 'starship',
      vehicles: 'vehicle',
    };
    for (const person of data.people) {
      if (repositories.people.hasId(getId(person.url))) continue;
      const createdPeople: People = await getPeople(person, repositories);
      createdPeople.eye_color = await getValue(
        person.eye_color,
        repositories.color,
        'value',
      );
      createdPeople.hair_color = await getValue(
        person.hair_color,
        repositories.color,
        'value',
      );
      createdPeople.skin_color = await getValue(
        person.skin_color,
        repositories.color,
        'value',
      );
      createdPeople.gender = await getValue(
        person.gender,
        repositories.gender,
        'value',
      );
      createdPeople.homeworld = await getPlanet(
        person.homeworld,
        repositories.planet,
      );
      for (const relation of Object.keys(personRelations)) {
        createdPeople[relation] = await createRelations(
          person[relation],
          repositories[personRelations[relation]],
        );
      }
      await repositories.people.save(createdPeople);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await AppDataSource.destroy();
  }
}

async function getData(): Promise<Data> {
  const requests = await getRequests();
  const data = {
    people: [],
    planets: [],
    films: [],
    species: [],
    vehicles: [],
    starships: [],
  };

  const responseData: ResponseData[] = [];

  for (const request in requests) {
    responseData.push(await getDataInfo(requests[request], request));
  }

  Object.keys(requests).forEach((request, index) => {
    data[request] = responseData[index];
  });
  return data;
}

async function getDataInfo(url: string, target: string): Promise<ResponseData> {
  try {
    let jsonData;
    loadingLog(target);
    const data: ResponseData = [];

    do {
      jsonData = await getJsonData(url);
      data.push(...jsonData.results);
      url = jsonData.next;
      loadingLog(target, jsonData.count, data.length);
    } while (jsonData.next !== null);
    process.stdout.write('\n');

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

async function getJsonData(url: string) {
  const response: Response = await fetch(url);
  return await response.json();
}

function getAppdataSource(entities: Entities): DataSource {
  return new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'admin',
    password: 'Zaq1W2e34',
    database: 'star_wars',
    synchronize: false,
    logging: false,
    entities: entities,
    migrations: ['./migrations/**/*.js'],
    subscribers: [],
  });
}

async function getRepositories(
  appDataSource: DataSource,
  entities: Entities,
): Promise<Repositories> {
  const repositories = {};
  for (const entity of entities) {
    repositories[entity.name.toLowerCase()] =
      appDataSource.getRepository(entity);
  }
  return repositories as Repositories;
}

function getId(url: string): number {
  return parseInt(url.match(/\/(\d+)\/$/)[1]);
}

async function getPeople(
  person: TPeople,
  repositories: Repositories,
): Promise<People> {
  const id: number = getId(person.url);
  const existingPeople: People | null = await repositories.people.findOne({
    where: { id: id },
  });
  if (existingPeople) return existingPeople;
  return await createPeople(person, repositories, id);
}

async function createPeople(
  person: TPeople,
  repositories: Repositories,
  id: number,
): Promise<People> {
  const newPeople = await repositories.people.create({
    id: id,
    name: person.name,
    height: person.height,
    mass: person.mass,
    birth_year: person.birth_year,
    created: person.created,
    edited: person.edited,
    url: createUrl(id, 'people'),
  });
  return await repositories.people.save(newPeople);
}

function createUrl(id: number, entity: string): string {
  return `http://localhost:3000/api/${entity}/${id}`;
}

async function getValue(
  propertyValue: string,
  repository: Rep,
  propertyName: string,
): Promise<Entities> {
  const existingValue: Gender | null = await repository.findOne({
    where: { [propertyName]: propertyValue },
  });
  if (existingValue) return existingValue;
  return await createValue(propertyValue, repository, propertyName);
}

async function createValue(
  value: string,
  repository: Rep,
  propertyName: string,
): Promise<Entities> {
  const newGender: Entities = repository.create({
    [propertyName]: value,
  });
  return await repository.save(newGender);
}

async function getPlanet(
  planetUrl: string,
  repository: Repository<Planet>,
): Promise<Planet> {
  const id: number = getId(planetUrl);
  return await repository.findOne({
    where: { id: id },
  });
}

async function createPlanet(
  planet: TPlanet,
  repository: Repository<Planet>,
): Promise<Planet> {
  const id: number = getId(planet.url);
  const newPlanet: Planet = repository.create({
    id: id,
    name: planet.name,
    rotation_period: planet.rotation_period,
    orbital_period: planet.orbital_period,
    diameter: planet.diameter,
    climate: planet.climate,
    gravity: planet.gravity,
    terrain: planet.terrain,
    surface_water: planet.surface_water,
    population: planet.population,
    created: planet.created,
    edited: planet.edited,
    url: createUrl(id, 'planet'),
  });
  return await repository.save(newPlanet);
}

async function createFilm(
  film: TFilm,
  repository: Repository<Film>,
): Promise<Film> {
  const id: number = getId(film.url);
  const newFilm: Film = repository.create({
    id: id,
    title: film.title,
    episode_id: film.episode_id,
    opening_crawl: film.opening_crawl,
    director: film.director,
    producer: film.producer,
    release_date: film.release_date,
    created: film.created,
    edited: film.edited,
    url: createUrl(id, 'films'),
  });
  return await repository.save(newFilm);
}

async function createSpecie(
  specie: TSpecie,
  repository: Repository<Specie>,
): Promise<Specie> {
  const id: number = getId(specie.url);
  const createdSpecie: Specie = repository.create({
    id: id,
    name: specie.name,
    classification: specie.classification,
    designation: specie.designation,
    average_height: specie.average_height,
    skin_colors: specie.skin_colors,
    hair_colors: specie.hair_colors,
    eye_colors: specie.eye_colors,
    average_lifespan: specie.average_lifespan,
    homeworld: specie.homeworld, // TODO мб надо сделать связь нормальную
    language: specie.language,
    // @JoinTable({ name: 'specie_film' }) TODO чекнуть
    // films: Film[]; //?
    created: specie.created,
    edited: specie.edited,
    url: createUrl(id, 'specie'),
  });
  return await repository.save(createdSpecie);
}

async function createStarship(
  starship: TStarship,
  repository: Repository<Starship>,
): Promise<Starship> {
  const id: number = getId(starship.url);
  const createdStarship: Starship = repository.create({
    id: id,
    name: starship.name,
    model: starship.model,
    manufacturer: starship.manufacturer,
    cost_in_credits: starship.cost_in_credits,
    length: starship.length,
    max_atmosphering_speed: starship.max_atmosphering_speed,
    crew: starship.crew,
    passengers: starship.passengers,
    cargo_capacity: starship.cargo_capacity,
    consumables: starship.consumables,
    hyperdrive_rating: starship.hyperdrive_rating,
    MGLT: starship.MGLT,
    starship_class: starship.starship_class,
    created: starship.created,
    edited: starship.edited,
    url: createUrl(id, 'starships'),
  });
  return await repository.save(createdStarship);
}

async function createVehicle(
  vehicle: TVehicle,
  repository: Repository<Vehicle>,
): Promise<Vehicle> {
  const id: number = getId(vehicle.url);
  const createdVehicle: Vehicle = repository.create({
    id: id,
    name: vehicle.name,
    model: vehicle.model,
    manufacturer: vehicle.manufacturer,
    cost_in_credits: vehicle.cost_in_credits,
    length: vehicle.length,
    max_atmosphering_speed: vehicle.max_atmosphering_speed,
    crew: vehicle.crew,
    passengers: vehicle.passengers,
    cargo_capacity: vehicle.cargo_capacity,
    consumables: vehicle.consumables,
    vehicle_class: vehicle.vehicle_class,
    // @JoinTable({ name: 'vehicle_film' }) TODO
    // films: Film[];
    created: vehicle.created,
    edited: vehicle.edited,
    url: createUrl(id, 'vehicles'),
  });
  return await repository.save(createdVehicle);
}

function getFilmId(links: string[]): number[] {
  const film_id: number[] = [];
  links.map((link: string) => film_id.push(getId(link)));
  return film_id;
}

async function createRelations(
  filmLink: string[],
  repository: Rep,
): Promise<Film[]> {
  const films: Film[] = [];
  const films_id: number[] = getFilmId(filmLink);
  for (const filmId of films_id) {
    const film = await repository.findOne({ where: { id: filmId } });
    if (film) {
      films.push(film);
    }
  }
  return films;
}

fillDB()
  .then(() => console.log('success'))
  .catch(() => console.log('failed'));
