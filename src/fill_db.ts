import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Person } from './people/entities/person.entity';
import { Planet } from './planet/entities/planet.entity';
import { Film } from './film/entities/film.entity';
import { Specie } from './specie/entities/specie.entity';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { Starship } from './starship/entities/starship.entity';
import { EntityType } from './common/types/types';
import { ConfigService } from '@nestjs/config';
import { Image } from './image/entities/image.entity';
import * as dotenv from 'dotenv';
import {
  ApiEndpoints,
  Repositories,
  SimpleTypeDatabase,
  SwapiData,
  SwapiEntity,
  SwapiFilm,
  SwapiPerson,
  SwapiPlanet,
  SwapiSpecie,
  SwapiStarship,
  SwapiVehicle,
} from './common/types/swapi-types';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';

const entities: EntityType[] = [
  Person,
  Planet,
  Film,
  Specie,
  Starship,
  Vehicle,
  Image,
  User,
  Role,
];

const roleValues: string[] = ['user', 'admin'];

dotenv.config();
const configService: ConfigService = new ConfigService();
const type: string = configService.get<string>('DATABASE_TYPE');

if (!['mysql', 'mariadb', 'postgres', 'sqlite', 'mssql'].includes(type)) {
  throw new Error(`Invalid database type: ${type}`);
}

const host: string = configService.get<string>('DATABASE_HOST');
const username: string = configService.get<string>('DATABASE_USERNAME');
const password: string = configService.get<string>('DATABASE_PASSWORD');
const name: string = configService.get<string>('DATABASE_NAME');
const database_port: number = configService.get<number>('DATABASE_PORT');
const server_port: number = configService.get<number>('SERVER_PORT', 3000);

/**
 * Creates a progress bar as an array of strings representing the current progress.
 *
 * @param {number} loadedCount - The number of items that have been loaded.
 * @param {number} totalCount - The total number of items to load.
 * @param {number} length - The length of the progress bar (number of characters).
 * @returns {string[]} An array representing the progress bar, with filled positions as '|' and empty positions as ' '.
 */
function createProgressBar(
  loadedCount: number,
  totalCount: number,
  length: number,
): string[] {
  const progress: number = Math.floor((loadedCount / totalCount) * length);
  return Array.from({ length }, (_, i) => (i < progress ? '|' : ' '));
}

/**
 * Calculates the progress percentage of loaded items.
 *
 * @param {number} loadedCount - The number of items that have been loaded.
 * @param {number} totalCount - The total number of items to load.
 * @returns {number} The progress percentage, rounded to the nearest whole number.
 */
function calculateProgress(loadedCount: number, totalCount: number): number {
  return Math.round((loadedCount / totalCount) * 100);
}

/**
 * Logs the loading progress to the console with a visual progress bar.
 *
 * @param {string} target - The label or name of the item being loaded.
 * @param {number} [totalCount=100] - The total number of items to load. Defaults to 100.
 * @param {number} [loadedCount=0] - The number of items that have been loaded. Defaults to 0.
 * @returns {void}
 */
function loadingLog(
  target: string,
  totalCount: number = 100,
  loadedCount: number = 0,
): void {
  const progressBarLength: number = 30;
  const progressBar: string[] = createProgressBar(
    loadedCount,
    totalCount,
    progressBarLength,
  );
  const spaces: string = ' '.repeat(Math.max(0, 10 - target.length));
  const progressPercent: number = calculateProgress(loadedCount, totalCount);

  process.stdout.write(
    `\r${target} loading:${spaces}[${progressBar.join(
      '',
    )}] ${progressPercent}%`,
  );
}

/**
 * Fetches the API endpoints from the SWAPI (Star Wars API).
 *
 * @returns {Promise<ApiEndpoints>} A promise that resolves to the API endpoints object.
 * @throws {Error} If there is an issue with the fetch request, the error is logged.
 */
async function getApiEndpoints(): Promise<ApiEndpoints> {
  try {
    const response: Response = await fetch('https://swapi.dev/api/');
    return await response.json();
  } catch (err) {
    console.error('Error fetching api endpoints:', err);
    throw err;
  }
}

/**
 * Fills the database with data from the SWAPI API.
 *
 * @returns {Promise<void>} A promise that resolves when the database has been successfully filled or rejects if
 * an error occurs.
 *
 * @throws {Error} If any error occurs during the process, it is logged to the console.
 */
async function fillDB(): Promise<void> {
  const swapiData: SwapiData = await getSwapiData();

  const AppDataSource: DataSource = getAppdataSource(entities);
  await AppDataSource.initialize();

  const repositories: Repositories = await getRepositories(
    AppDataSource,
    entities,
  );

  await createEntities(swapiData, repositories);
  await createEntitiesLinks(swapiData, repositories);
  await createAdmin(AppDataSource);
}

/**
 * Retrieves data from SWAPI endpoints and returns it as an object.
 *
 * @returns {Promise<SwapiData>} A promise that resolves to an object containing the data from SWAPI endpoints.
 *
 * @throws {Error} If there is an error in fetching the API endpoints or if errors are not handled within individual
 * requests.
 */
async function getSwapiData(): Promise<SwapiData> {
  try {
    const apiEndpoints: ApiEndpoints = await getApiEndpoints();

    const entries: [string, SwapiEntity[]][] = await Promise.all(
      Object.keys(apiEndpoints).map(
        async (key: string): Promise<[string, SwapiEntity[]]> => {
          try {
            const data: SwapiEntity[] = await getDataInfo(
              apiEndpoints[key],
              key,
            );
            return [key, data] as [string, SwapiEntity[]];
          } catch (err) {
            console.error(`Error fetching data for key ${key}:`, err);
            return [key, []];
          }
        },
      ),
    );

    return Object.fromEntries(entries) as SwapiData;
  } catch (err) {
    console.error('Error getting SWAPI data:', err);
    throw err;
  }
}

/**
 * Retrieves data from a paginated API endpoint and returns an array of entities.
 *
 * @template T - The type of the entities being fetched, extending `SwapiEntity`.
 * @param {string} url - The URL of the API endpoint to fetch data from.
 * @param {string} target - The label or name of the data being fetched, used for logging progress.
 * @returns {Promise<T[]>} A promise that resolves to an array of entities of type `T`.
 *
 * @throws {Error} If there is an error during data fetching, the error is logged and thrown.
 */
async function getDataInfo<T extends SwapiEntity>(
  url: string,
  target: string,
): Promise<T[]> {
  try {
    let jsonData;
    loadingLog(target);
    const data: T[] = [];

    do {
      jsonData = await fetchJsonData(url);
      data.push(...jsonData.results);
      url = jsonData.next;
      loadingLog(target, jsonData.count, data.length);
    } while (jsonData.next !== null);
    process.stdout.write('\n');

    return data;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

/**
 * Fetches JSON data from a given URL and returns it as a `SwapiEntity` object.
 *
 * @param {string} url - The URL to fetch the JSON data from.
 * @returns {Promise<SwapiEntity>} A promise that resolves to the parsed JSON data as a `SwapiEntity`.
 *
 * @throws {Error} If the fetch operation fails or if the response cannot be parsed as JSON.
 */
async function fetchJsonData(url: string): Promise<SwapiEntity> {
  const response: Response = await fetch(url);
  return await response.json();
}

/**
 * Creates and returns a new `DataSource` instance configured with the provided entities.
 *
 * @param {EntityType[]} entities - An array of entity classes to be included in the `DataSource`.
 * @returns {DataSource} A configured `DataSource` instance.
 */
function getAppdataSource(entities: EntityType[]): DataSource {
  return new DataSource({
    type: type as SimpleTypeDatabase,
    host: host,
    port: database_port,
    username: username,
    password: password,
    database: name,
    synchronize: false,
    logging: false,
    entities: entities,
    migrations: ['./migrations/**/*.js'],
    subscribers: [],
  });
}

/**
 * Retrieves repositories for the provided entities from the given `DataSource`.
 *
 * @param {DataSource} appDataSource - The initialized `DataSource` from which to retrieve the repositories.
 * @param {EntityType[]} entities - An array of entity classes for which to retrieve repositories.
 * @returns {Promise<Repositories>} A promise that resolves to an object containing the repositories, keyed by the
 * lowercase entity names.
 */
async function getRepositories(
  appDataSource: DataSource,
  entities: EntityType[],
): Promise<Repositories> {
  const repositories: object = {};
  for (const entity of entities) {
    repositories[entity.name.toLowerCase()] =
      appDataSource.getRepository(entity);
  }
  return repositories as Repositories;
}

/**
 * Extracts and returns the numeric ID from a given URL.
 *
 * @param {string} url - The URL string from which to extract the ID.
 * @returns {number} The extracted numeric ID.
 *
 * @throws {Error} If the URL does not contain a valid ID or the ID is not a number.
 */
function getId(url: string): number {
  const match = url.match(/\/(\d+)\/$/);
  if (!match) {
    throw new Error(`Invalid URL: ${url}. Cannot extract ID.`);
  }
  return parseInt(match[1], 10);
}

/**
 * Creates and saves entities from the provided `SwapiData` into the database using the given repositories.
 *
 * @param {SwapiData} data - The data object containing arrays of entities to be created, keyed by entity type.
 * @param {Repositories} repositories - An object containing the repositories where the entities will be saved.
 * @returns {Promise<void>} A promise that resolves when all entities have been created and saved in the database.
 */
async function createEntities(
  data: SwapiData,
  repositories: Repositories,
): Promise<void> {
  for (const key of Object.keys(data)) {
    for (const entity of data[key]) {
      try {
        await createEntity(key, entity, repositories);
      } catch (err) {
        console.error(`Error creating entity for key ${key}:`, err);
        throw err;
      }
    }
  }
  console.log('Entities were loaded to the database');
}

/**
 * Creates and saves a specific type of entity based on the provided entity type and data.
 *
 * @param {string} targetEntity - The type of entity to create (e.g., 'people', 'planets', 'films').
 * @param {SwapiEntity} entityData - The data for the entity to be created.
 * @param {Repositories} repositories - An object containing the repositories where the entity will be saved.
 * @returns {Promise<EntityType>} A promise that resolves to the created entity.
 *
 * @throws {Error} If the entity type is unknown or if there is an error during entity creation.
 */
async function createEntity(
  targetEntity: string,
  entityData: SwapiEntity,
  repositories: Repositories,
): Promise<EntityType> {
  switch (targetEntity) {
    case 'people':
      return await createPerson(
        targetEntity,
        entityData as SwapiPerson,
        repositories,
      );
    case 'planets':
      return await createPlanet(
        targetEntity,
        entityData as SwapiPlanet,
        repositories,
      );
    case 'films':
      return await createFilm(
        targetEntity,
        entityData as SwapiFilm,
        repositories,
      );
    case 'species':
      return await createSpecie(
        targetEntity,
        entityData as SwapiSpecie,
        repositories,
      );
    case 'vehicles':
      return await createVehicle(
        targetEntity,
        entityData as SwapiVehicle,
        repositories,
      );
    case 'starships':
      return await createStarship(
        targetEntity,
        entityData as SwapiStarship,
        repositories,
      );
    default:
      throw new Error(`Unknown entity type: ${targetEntity}`);
  }
}

/**
 * Creates and saves a new `Person` entity based on the provided `SwapiPerson` data.
 *
 * @param targetEntity - The entity name (people) used to generate the URL for the new person.
 * @param {SwapiPerson} personData - The data for the person to be created, as provided by the SWAPI.
 * @param {Repositories} repositories - An object containing the repositories where the person will be saved.
 * @returns {Promise<Person>} A promise that resolves to the created `Person` entity.
 *
 * @throws {Error} If there is an error during the save operation.
 */
async function createPerson(
  targetEntity: string,
  personData: SwapiPerson,
  repositories: Repositories,
): Promise<Person> {
  try {
    const id: number = getId(personData.url);

    const newPeople: Person = repositories.person.create({
      id,
      name: personData.name,
      height: parseNumber(personData.height),
      mass: parseNumber(personData.mass),
      hair_color: personData.hair_color,
      skin_color: personData.skin_color,
      eye_color: personData.eye_color,
      birth_year: personData.birth_year,
      gender: personData.gender,
      created: personData.created,
      edited: personData.edited,
      images: [],
      url: createUrl(id, targetEntity),
    });

    return await repositories.person.save(newPeople);
  } catch (err) {
    console.error('Error saving person entity:', err);
    throw err;
  }
}

/**
 * Creates and saves a new `Planet` entity based on the provided `SwapiPlanet` data.
 *
 * @param targetEntity - The entity name (planets) used to generate the URL for the new planet.
 * @param {SwapiPlanet} planetData - The data for the planet to be created, as provided by the SWAPI.
 * @param {Repositories} repositories - An object containing the repositories where the planet will be saved.
 * @returns {Promise<Planet>} A promise that resolves to the created `Planet` entity.
 *
 * @throws {Error} If there is an error during the save operation.
 */
async function createPlanet(
  targetEntity: string,
  planetData: SwapiPlanet,
  repositories: Repositories,
): Promise<Planet> {
  try {
    const id: number = getId(planetData.url);

    const newPlanet: Planet = repositories.planet.create({
      id,
      name: planetData.name,
      rotation_period: parseNumber(planetData.rotation_period),
      orbital_period: parseNumber(planetData.orbital_period),
      diameter: parseNumber(planetData.diameter),
      climate: planetData.climate,
      gravity: planetData.gravity,
      terrain: planetData.terrain,
      surface_water: parseNumber(planetData.surface_water),
      population: parseNumber(planetData.population),
      created: planetData.created,
      edited: planetData.edited,
      images: [],
      url: createUrl(id, targetEntity),
    });

    return await repositories.planet.save(newPlanet);
  } catch (err) {
    console.error('Error saving planet entity:', err);
    throw err;
  }
}

/**
 * Creates and saves a new `Film` entity based on the provided `SwapiFilm` data.
 *
 * @param targetEntity - The entity name (films) used to generate the URL for the new film.
 * @param {SwapiFilm} filmData - The data for the film to be created, as provided by the SWAPI.
 * @param {Repositories} repositories - An object containing the repositories where the film will be saved.
 * @returns {Promise<Film>} A promise that resolves to the created `Film` entity.
 *
 * @throws {Error} If there is an error during the save operation.
 */
async function createFilm(
  targetEntity: string,
  filmData: SwapiFilm,
  repositories: Repositories,
): Promise<Film> {
  try {
    const id: number = getId(filmData.url);

    const newFilm: Film = repositories.film.create({
      id,
      title: filmData.title,
      episode_id: Number(filmData.episode_id),
      opening_crawl: filmData.opening_crawl,
      director: filmData.director,
      producer: filmData.producer,
      release_date: filmData.release_date,
      created: filmData.created,
      edited: filmData.edited,
      images: [],
      url: createUrl(id, targetEntity),
    });

    return await repositories.film.save(newFilm);
  } catch (err) {
    console.error('Error saving film entity:', err);
    throw err;
  }
}

/**
 * Creates and saves a new `Specie` entity based on the provided `SwapiSpecie` data.
 *
 * @param targetEntity - The entity name (species) used to generate the URL for the new specie.
 * @param {SwapiSpecie} specieData - The data for the specie to be created, as provided by the SWAPI.
 * @param {Repositories} repositories - An object containing the repositories where the specie will be saved.
 * @returns {Promise<Specie>} A promise that resolves to the created `Specie` entity.
 *
 * @throws {Error} If there is an error during the save operation.
 */
async function createSpecie(
  targetEntity: string,
  specieData: SwapiSpecie,
  repositories: Repositories,
): Promise<Specie> {
  try {
    const id: number = getId(specieData.url);

    const createdSpecie: Specie = repositories.specie.create({
      id,
      name: specieData.name,
      classification: specieData.classification,
      designation: specieData.designation,
      average_height: parseNumber(specieData.average_height),
      skin_colors: specieData.skin_colors,
      hair_colors: specieData.hair_colors,
      eye_colors: specieData.eye_colors,
      average_lifespan: parseNumber(specieData.average_lifespan),
      language: specieData.language,
      created: specieData.created,
      edited: specieData.edited,
      images: [],
      url: createUrl(id, targetEntity),
    });

    return await repositories.specie.save(createdSpecie);
  } catch (err) {
    console.error('Error saving specie entity:', err);
    throw err;
  }
}

/**
 * Creates and saves a new `Starship` entity based on the provided `SwapiStarship` data.
 *
 * @param targetEntity - The entity name (starships) used to generate the URL for the new starship.
 * @param {SwapiStarship} starshipData - The data for the starship to be created, as provided by the SWAPI.
 * @param {Repositories} repositories - An object containing the repositories where the starship will be saved.
 * @returns {Promise<Starship>} A promise that resolves to the created `Starship` entity.
 *
 * @throws {Error} If there is an error during the save operation.
 */
async function createStarship(
  targetEntity: string,
  starshipData: SwapiStarship,
  repositories: Repositories,
): Promise<Starship> {
  try {
    const id: number = getId(starshipData.url);

    const createdStarship: Starship = repositories.starship.create({
      id: id,
      name: starshipData.name,
      model: starshipData.model,
      manufacturer: starshipData.manufacturer,
      cost_in_credits: parseNumber(starshipData.cost_in_credits),
      length: parseNumber(starshipData.length),
      max_atmosphering_speed: parseNumber(starshipData.max_atmosphering_speed),
      crew: parseNumber(starshipData.crew),
      passengers: parseNumber(starshipData.passengers),
      cargo_capacity: parseNumber(starshipData.cargo_capacity),
      consumables: starshipData.consumables,
      hyperdrive_rating: parseNumber(starshipData.hyperdrive_rating),
      MGLT: parseNumber(starshipData.MGLT),
      starship_class: starshipData.starship_class,
      created: starshipData.created,
      edited: starshipData.edited,
      images: [],
      url: createUrl(id, targetEntity),
    });

    return await repositories.starship.save(createdStarship);
  } catch (err) {
    console.error('Error saving starship entity:', err);
    throw err;
  }
}

/**
 * Creates and saves a new `Vehicle` entity based on the provided `SwapiVehicle` data.
 *
 * @param targetEntity - - The entity name (vehicles) used to generate the URL for the new vehicle.
 * @param {SwapiVehicle} vehicleData - The data for the vehicle to be created, as provided by the SWAPI.
 * @param {Repositories} repositories - An object containing the repositories where the vehicle will be saved.
 * @returns {Promise<Vehicle>} A promise that resolves to the created `Vehicle` entity.
 *
 * @throws {Error} If there is an error during the save operation.
 */
async function createVehicle(
  targetEntity: string,
  vehicleData: SwapiVehicle,
  repositories: Repositories,
): Promise<Vehicle> {
  try {
    const id: number = getId(vehicleData.url);

    const createdVehicle: Vehicle = repositories.vehicle.create({
      id: id,
      name: vehicleData.name,
      model: vehicleData.model,
      manufacturer: vehicleData.manufacturer,
      cost_in_credits: parseNumber(vehicleData.cost_in_credits),
      length: parseNumber(vehicleData.length),
      max_atmosphering_speed: parseNumber(vehicleData.max_atmosphering_speed),
      crew: parseNumber(vehicleData.crew),
      passengers: parseNumber(vehicleData.passengers),
      cargo_capacity: parseNumber(vehicleData.cargo_capacity),
      consumables: vehicleData.consumables,
      vehicle_class: vehicleData.vehicle_class,
      created: vehicleData.created,
      edited: vehicleData.edited,
      images: [],
      url: createUrl(id, targetEntity),
    });

    return await repositories.vehicle.save(createdVehicle);
  } catch (err) {
    console.error('Error saving vehicle entity:', err);
    throw err;
  }
}

/**
 * Creates links between entities in the database using the provided SWAPI data.
 *
 * @param {SwapiData} data - The SWAPI data containing the entities to link together.
 * @param {Repositories} repositories - An object containing the repositories for each entity type.
 * @returns {Promise<void>} A promise that resolves when all entity links have been created.
 */
async function createEntitiesLinks(
  data: SwapiData,
  repositories: Repositories,
): Promise<void> {
  for (const key of Object.keys(data)) {
    for (const entity of data[key]) {
      await createEntityLinks(key, entity, repositories);
    }
  }
  console.log('Entities links was created');
}

/**
 * Creates links between a specific entity and related entities in the database.
 *
 * @param {string} targetEntity - The type of the entity (e.g., `people`, `films`, `species`).
 * @param {SwapiEntity} entityData - The data for the entity from the SWAPI API.
 * @param {Repositories} repositories - An object containing the repositories for each entity type.
 * @returns {Promise<EntityType>} A promise that resolves with the linked entity.
 *
 * @throws {Error} Throws an error if the entity type is unknown.
 */
async function createEntityLinks(
  targetEntity: string,
  entityData: SwapiEntity,
  repositories: Repositories,
): Promise<EntityType> {
  switch (targetEntity) {
    case 'planets':
    case 'vehicles':
    case 'starships':
      break;
    case 'people':
      return addPersonLinks(entityData as SwapiPerson, repositories);
    case 'films':
      return addFilmLinks(entityData as SwapiFilm, repositories);
    case 'species':
      return addSpecieLinks(entityData as SwapiSpecie, repositories);
    default:
      throw new Error(`Unknown entity type: ${targetEntity}`);
  }
}

/**
 * Adds links between a person and related entities (homeworld, species, vehicles, starships).
 *
 * @param {SwapiPerson} personData - The data for the person from the SWAPI API.
 * @param {Repositories} repositories - An object containing the repositories for each entity type.
 * @returns {Promise<void>} A promise that resolves when the person's links are added and saved.
 *
 * @throws {Error} Throws an error if there is an issue finding or saving the related entities.
 */
async function addPersonLinks(
  personData: SwapiPerson,
  repositories: Repositories,
): Promise<void> {
  const person: Person = await findEntity(repositories.person, personData.url);

  const [homeworld, species, vehicles, starships] = await Promise.all([
    personData.homeworld
      ? findEntity(repositories.planet, personData.homeworld)
      : undefined,
    Promise.all(
      personData.species.map((specieUrl: string) =>
        findEntity(repositories.specie, specieUrl),
      ),
    ),
    Promise.all(
      personData.vehicles.map((vehicleUrl) =>
        findEntity(repositories.vehicle, vehicleUrl),
      ),
    ),
    Promise.all(
      personData.starships.map((starshipUrl) =>
        findEntity(repositories.starship, starshipUrl),
      ),
    ),
  ]);

  person.homeworld = homeworld ? [homeworld] : [];
  person.species = species;
  person.starships = starships;
  person.vehicles = vehicles;

  await repositories.person.save(person);
}

/**
 * Adds links between a film and related entities (characters, planets, starships, vehicles, species).
 *
 * @param {SwapiFilm} filmData - The data for the film from the SWAPI API.
 * @param {Repositories} repositories - An object containing the repositories for each entity type.
 * @returns {Promise<void>} A promise that resolves when the film's links are added and saved.
 *
 * @throws {Error} Throws an error if there is an issue finding or saving the related entities.
 */
async function addFilmLinks(
  filmData: SwapiFilm,
  repositories: Repositories,
): Promise<void> {
  const film: Film = await findEntity(repositories.film, filmData.url);

  const [characters, planets, starships, vehicles, species] = await Promise.all(
    [
      Promise.all(
        filmData.characters.map((filmUrl) =>
          findEntity(repositories.person, filmUrl),
        ),
      ),
      Promise.all(
        filmData.planets.map((planetUrl: string) =>
          findEntity(repositories.planet, planetUrl),
        ),
      ),
      Promise.all(
        filmData.starships.map((starshipUrl: string) =>
          findEntity(repositories.starship, starshipUrl),
        ),
      ),
      Promise.all(
        filmData.vehicles.map((vehicleUrl: string) =>
          findEntity(repositories.vehicle, vehicleUrl),
        ),
      ),
      Promise.all(
        filmData.species.map((specieUrl: string) =>
          findEntity(repositories.specie, specieUrl),
        ),
      ),
    ],
  );

  film.characters = characters;
  film.planets = planets;
  film.starships = starships;
  film.vehicles = vehicles;
  film.species = species;

  await repositories.film.save(film);
}

/**
 * Adds links between a species and its related entities (homeworld).
 *
 * @param {SwapiSpecie} specieData - The data for the species from the SWAPI API.
 * @param {Repositories} repositories - An object containing the repositories for each entity type.
 * @returns {Promise<void>} A promise that resolves when the species' links are added and saved.
 *
 * @throws {Error} Throws an error if there is an issue finding or saving the related entities.
 */
async function addSpecieLinks(
  specieData: SwapiSpecie,
  repositories: Repositories,
): Promise<void> {
  const specie: Specie = await findEntity(repositories.specie, specieData.url);

  const [homeworld] = await Promise.all([
    specieData.homeworld
      ? findEntity(repositories.planet, specieData.homeworld)
      : undefined,
  ]);

  specie.homeworld = homeworld ? [homeworld] : [];

  await repositories.specie.save(specie);
}

/**
 * Generates a URL for a given entity type and ID.
 *
 * @param {number} id - The ID of the entity.
 * @param {string} entity - The type of entity (e.g., 'people', 'planets').
 * @returns {string} The generated URL for the entity.
 */
function createUrl(id: number, entity: string): string {
  return `http://localhost:${server_port}/${entity}/${id}`;
}

/**
 * Finds an entity in the given repository by its URL.
 *
 * @template T - The type of the entity being searched for.
 * @param {Repository<T>} repository - The repository where the entity is stored.
 * @param {string} url - The URL containing the ID of the entity.
 * @returns {Promise<T>} A promise that resolves to the found entity.
 * @throws {Error} Throws an error if the entity is not found.
 */
async function findEntity<T extends { id: number }>(
  repository: Repository<T>,
  url: string,
): Promise<T> {
  const id: number = getId(url);
  return await repository.findOne({
    where: { id } as FindOptionsWhere<T>,
  });
}

/**
 * Parses a string value into a number.
 *
 * @param {string} value - The string value to be parsed into a number.
 * @returns {number | null} The parsed number or `null` if the value is not a valid number.
 */
function parseNumber(value: string): number | null {
  const numberValue: number = Number(value);
  return isNaN(numberValue) ? null : numberValue;
}

/**
 * Creates an administrator user with default credentials.
 *
 * @param {DataSource} appDataSource - The data source from which repositories are retrieved.
 * @returns {Promise<void>} A promise that resolves when the administrator has been created.
 */
async function createAdmin(appDataSource: DataSource): Promise<void> {
  const userRepository: Repository<User> = appDataSource.getRepository(User);
  const roleRepository: Repository<Role> = appDataSource.getRepository(Role);

  const roles: Role[] = await createRoles(roleRepository);

  const admin: User = userRepository.create({
    username: 'admin',
    password: 'admin',
    roles,
  });

  await userRepository.save(admin);
  console.log('Administrator created: username - admin, pass - admin');
}

/**
 * Creates and saves roles in the database using the provided repository.
 *
 * @param {Repository<Role>} repository - The repository used to save the roles.
 * @returns {Promise<Role[]>} A promise that resolves to an array of created `Role` entities.
 */
async function createRoles(repository: Repository<Role>): Promise<Role[]> {
  const roles: any[] = [];

  for (const value of roleValues) {
    const role: Role = repository.create({ value });
    roles.push(await repository.save(role));
  }

  return roles as Role[];
}

fillDB()
  .then(() => console.log('Success! You can stop the script from running'))
  .catch((err) => console.error(err));
