import { Injectable } from '@nestjs/common';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Image } from '../image/entities/image.entity';
import { Person } from '../person/entities/person.entity';
import { Film } from '../film/entities/film.entity';
import {
  IPaginationLinks,
  IPaginationMeta,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Specie } from '../specie/entities/specie.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Starship } from '../starship/entities/starship.entity';

@Injectable()
export class PlanetService {
  constructor(
    @InjectRepository(Planet)
    private planetRepository: Repository<Planet>,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Creates a new planet entity based on the provided DTO.
   *
   * @param {CreatePlanetDto} dto - Data transfer object containing information about the planet to create.
   * @returns {Promise<OperationResult>} - Result of the operation, indicating success or failure.
   * @throws {Error} Throws an error if there is an issue with creating or saving the planet.
   */
  async create(dto: CreatePlanetDto): Promise<OperationResult> {
    const id: number = await this.commonService.getId(this.planetRepository);
    const date: Date = new Date();

    const [residents, films, images] = await this.getAllLinks(dto);

    const new_planet: Planet = this.planetRepository.create({
      id,
      name: dto.name,
      rotation_period: dto.rotation_period || null,
      orbital_period: dto.orbital_period || null,
      diameter: dto.diameter || null,
      climate: dto.climate,
      gravity: dto.gravity,
      terrain: dto.terrain,
      surface_water: dto.surface_water || null,
      population: dto.population || null,
      residents,
      films,
      images,
      created: date,
      edited: date,
      url: this.commonService.createUrl(id, 'planets'),
    });

    await this.planetRepository.save(new_planet);
    return { success: true };
  }

  /**
   * Retrieves a paginated list of catalog items (planets) with related images.
   *
   * @param {number} numPage - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Person[]>} - A promise that resolves to an array of planets with their related images.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getCatalogItems(numPage: number, limit: number): Promise<Planet[]> {
    const offset: number = (numPage - 1) * limit;

    return await this.planetRepository.find({
      relations: ['images'],
      skip: offset,
      take: limit,
    });
  }

  /**
   * Retrieves a list of planets with only their IDs and names. Necessary to create selections on the client side
   *
   * @returns {Promise<Planet[]>} A promise that resolves to an array of `Planet` objects, each containing the ID and name of a planet.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  getNames(): Promise<Planet[]> {
    return this.planetRepository
      .createQueryBuilder('planet')
      .select(['planet.id', 'planet.name'])
      .getMany();
  }

  /**
   * Returns the schema for a form used to create or update a planet.
   *
   * @returns {FormSchema} - The schema object with default values for a person form.
   */
  getFormSchema(): FormSchema {
    return {
      name: '',
      rotation_period: '',
      orbital_period: '',
      diameter: '',
      climate: '',
      gravity: '',
      terrain: '',
      surface_water: '',
      population: '',
      residents: 'people',
      films: 'films',
    };
  }

  /**
   * Retrieves a paginated list of planets from the database.
   *
   * @param {number} page - The current page number for pagination.
   * @param {number} limit - The maximum number of planets to return per page.
   * @returns {Promise<Pagination<Vehicle>>} A promise that resolves to a `Pagination` object containing the planets,
   * pagination metadata, and links.
   */
  async findAll(page: number, limit: number): Promise<Pagination<Planet>> {
    const [planets, total] = await this.planetRepository
      .createQueryBuilder('planet')
      .orderBy('planet.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    for (const planet of planets) {
      const [residents, films] = await Promise.all([
        this.commonService.getRelationIds<Person>(
          'person',
          'homeworld',
          planet.id,
        ),
        this.commonService.getRelationIds<Film>('film', 'planets', planet.id),
      ]);

      planet.residents = residents;
      planet.films = films;
    }

    const meta: IPaginationMeta = this.commonService.getPaginationMeta(
      total,
      planets.length,
      limit,
      page,
    );

    const links: IPaginationLinks = this.commonService.getPaginationLinks(
      'planets',
      page,
      limit,
      total,
    );

    return new Pagination<Planet>(planets, meta, links);
  }

  /**
   * Finds a planet by their ID, including related entities.
   *
   * @param {number} id - The ID of the planet to find.
   * @param {string[]} relations - Array of related entity names to include in the query.
   * @returns {Promise<Planet>} A promise that resolves to the found planet, including related entities.
   * @throws {Error} If the planet could not be found.
   */
  async findOne(id: number, relations: string[]): Promise<Planet> {
    return await this.planetRepository.findOne({
      relations: relations,
      where: { id },
    });
  }

  /**
   * Retrieves detailed information about a planet entity by their ID, including related entities such as people, films and images.
   *
   * @param {number} id - The ID of the planet to retrieve.
   * @returns {Promise<Person>} A promise that resolves to a `Planet` object containing detailed information, including related entities.
   * @throws {Error} Throws an error if the planet with the given ID does not exist or if there is an issue with the query.
   */
  async getEntityInfo(id: number): Promise<Planet> {
    return await this.planetRepository
      .createQueryBuilder('planet')
      .leftJoin('planet.residents', 'person')
      .leftJoin('planet.films', 'film')
      .leftJoin('planet.images', 'image')
      .select([
        'planet.name',
        'planet.rotation_period',
        'planet.orbital_period',
        'planet.diameter',
        'planet.climate',
        'planet.gravity',
        'planet.terrain',
        'planet.surface_water',
        'planet.surface_water',
        'planet.population',
        'person.id',
        'person.name',
        'person.url',
        'film.id',
        'film.title',
        'film.url',
        'image.id',
        'image.filename',
        'image.url',
      ])
      .where('planet.id = :id', { id })
      .getOne();
  }

  /**
   * Updates a person's information by their ID, including related entities and handling image cleanup.
   *
   * @param {number} id - The ID of the person to update.
   * @param {UpdatePersonDto} dto - The data transfer object containing the updated person information.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the person could not be found or updated.
   */
  async update(id: number, dto: UpdatePlanetDto): Promise<OperationResult> {
    const planet: Planet = await this.findOne(id, ['images']);
    const oldImages: Image[] = planet.images;

    const [residents, films, images] = await this.getAllLinks(dto);

    Object.assign(planet, {
      name: dto.name ?? planet.name,
      rotation_period: dto.rotation_period || planet.rotation_period,
      orbital_period: dto.orbital_period || planet.orbital_period,
      diameter: dto.diameter || planet.diameter,
      climate: dto.climate ?? planet.climate,
      gravity: dto.gravity ?? planet.gravity,
      terrain: dto.terrain ?? planet.terrain,
      surface_water: dto.surface_water || planet.surface_water,
      population: dto.population || planet.population,
      edited: new Date(),
      residents,
      films,
      images,
    });

    await this.planetRepository.save(planet);

    if (oldImages.length) {
      await this.commonService.cleanUpUnusedImages(oldImages, planet.images);
    }

    return { success: true };
  }

  /**
   * Removes a planet by their ID, including cleanup of related entities and images.
   *
   * @param {number} id - The ID of the planet to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the planet does not exist.
   */
  async remove(id: number): Promise<OperationResult> {
    const planet: Planet = await this.findOne(id, ['images']);

    if (planet.images.length) {
      await this.commonService.cleanUpUnusedImages(planet.images, []);
    }
    planet.images = [];

    await this.planetRepository.save(planet);
    await this.planetRepository.remove(planet);

    return { success: true };
  }

  /**
   * Retrieves all related entities for a planet.
   *
   * @param { CreatePlanetDto | UpdatePlanetDto } dto - The data transfer object containing the identifiers for
   * entities to retrieve.
   * @returns { Promise<[Person[], Film[], Image[]]> } A promise that resolves to a tuple containing arrays of entities:
   */
  async getAllLinks(
    dto: CreatePlanetDto | UpdatePlanetDto,
  ): Promise<[Person[], Film[], Image[]]> {
    return await Promise.all([
      this.commonService.getEntitiesByIds<Person>(dto.residents, 'person'),
      this.commonService.getEntitiesByIds<Film>(dto.films, 'film'),
      this.commonService.getImages(dto.images),
    ]);
  }
}
