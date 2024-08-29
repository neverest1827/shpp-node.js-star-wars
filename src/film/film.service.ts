import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Image } from '../image/entities/image.entity';
import { Person } from '../person/entities/person.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Specie } from '../specie/entities/specie.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Starship } from '../starship/entities/starship.entity';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Creates a new film entity based on the provided DTO.
   *
   * @param {CreateFilmDto} dto - Data transfer object containing information about the film to create.
   * @returns {Promise<OperationResult>} - Result of the operation, indicating success or failure.
   * @throws {Error} Throws an error if there is an issue with creating or saving the film.
   */
  async create(dto: CreateFilmDto): Promise<OperationResult> {
    const id: number = await this.commonService.getId(this.filmRepository);
    const date: Date = new Date();

    const [characters, planets, starships, vehicles, species, images] =
      await this.getAllLinks(dto);

    const new_film: Film = this.filmRepository.create({
      id,
      title: dto.title,
      episode_id: dto.episode_id || null,
      opening_crawl: dto.opening_crawl,
      director: dto.director,
      producer: dto.producer,
      release_date: dto.release_date,
      characters,
      planets,
      starships,
      vehicles,
      species,
      images,
      created: date,
      edited: date,
      url: this.commonService.createUrl(id, 'films'),
    });

    await this.filmRepository.save(new_film);
    return { success: true };
  }

  /**
   * Retrieves a paginated list of catalog items (films) with related images.
   *
   * @param {number} numPage - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Film[]>} - A promise that resolves to an array of films with their related images.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getCatalogItems(numPage: number, limit: number): Promise<Film[]> {
    const offset: number = (numPage - 1) * limit;

    return await this.filmRepository.find({
      relations: ['images'],
      skip: offset,
      take: limit,
    });
  }

  /**
   * Retrieves a list of films with only their IDs and names. Necessary to create selections on the client side
   *
   * @returns {Promise<Person[]>} A promise that resolves to an array of `Film` objects, each containing the ID and name of a person.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getNames(): Promise<Film[]> {
    return await this.filmRepository
      .createQueryBuilder('film')
      .select(['film.id', 'film.title'])
      .getMany();
  }

  /**
   * Returns the schema for a form used to create or update a film.
   *
   * @returns {FormSchema} - The schema object with default values for a film form.
   */
  getFormSchema(): FormSchema {
    return {
      title: '',
      episode_id: '',
      opening_crawl: '',
      director: '',
      producer: '',
      release_date: '',
      characters: 'people',
      planets: 'planets',
      starships: 'starships',
      vehicles: 'vehicles',
      species: 'species',
    };
  }

  /**
   * Finds a film by its ID, including related entities.
   *
   * @param {number} id - The ID of the film to find.
   * @param {string[]} relations - Array of related entity names to include in the query.
   * @returns {Promise<Film>} A promise that resolves to the found film, including related entities.
   * @throws {Error} If the film could not be found.
   */
  async findOne(id: number, relations: string[]): Promise<Film> {
    return await this.filmRepository.findOne({
      relations: relations,
      where: { id },
    });
  }

  /**
   * Retrieves detailed information about a film entity by their ID, including related entities such as characters, planets, species, vehicles, starships, and images.
   *
   * @param {number} id - The ID of the film to retrieve.
   * @returns {Promise<Person>} A promise that resolves to a `Film` object containing detailed information, including related entities.
   * @throws {Error} Throws an error if the film with the given ID does not exist or if there is an issue with the query.
   */
  async getEntityInfo(id: number): Promise<Film> {
    return await this.filmRepository
      .createQueryBuilder('film')
      .leftJoin('film.characters', 'person')
      .leftJoin('film.planets', 'planet')
      .leftJoin('film.starships', 'starship')
      .leftJoinAndSelect('film.vehicles', 'vehicle')
      .leftJoin('film.species', 'specie')
      .leftJoin('film.images', 'image')
      .select([
        'film.title',
        'film.episode_id',
        'film.opening_crawl',
        'film.director',
        'film.producer',
        'film.release_date',
        'person.id',
        'person.name',
        'person.url',
        'planet.id',
        'planet.name',
        'planet.url',
        'starship.id',
        'starship.name',
        'starship.url',
        'vehicle.id',
        'vehicle.name',
        'vehicle.url',
        'specie.id',
        'specie.name',
        'specie.url',
        'image.id',
        'image.filename',
        'image.url',
      ])
      .where('film.id = :id', { id })
      .getOne();
  }

  /**
   * Updates a film's information by their ID, including related entities and handling image cleanup.
   *
   * @param {number} id - The ID of the film to update.
   * @param {UpdateFilmDto} dto - The data transfer object containing the updated film information.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the film could not be found or updated.
   */
  async update(id: number, dto: UpdateFilmDto): Promise<OperationResult> {
    const film: Film = await this.findOne(id, ['images']);
    const oldImages: Image[] = film.images;

    const [characters, planets, species, vehicles, starships, images] =
      await this.getAllLinks(dto);

    Object.assign(film, {
      title: dto.title ?? film.title,
      episode_id: dto.episode_id || film.episode_id,
      opening_crawl: dto.opening_crawl ?? film.opening_crawl,
      director: dto.director ?? film.director,
      producer: dto.producer ?? film.producer,
      release_date: dto.release_date ?? film.release_date,
      edited: new Date(),
      characters,
      planets,
      species,
      vehicles,
      starships,
      images,
    });

    await this.filmRepository.save(film);

    if (oldImages.length) {
      await this.commonService.cleanUpUnusedImages(oldImages, film.images);
    }

    return { success: true };
  }

  /**
   * Removes a film by their ID, including cleanup of related entities and images.
   *
   * @param {number} id - The ID of the film to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the film does not exist.
   */
  async remove(id: number): Promise<OperationResult> {
    const film: Film = await this.findOne(id, ['images']);

    if (film.images.length) {
      await this.commonService.cleanUpUnusedImages(film.images, []);
    }
    film.images = [];

    await this.filmRepository.save(film);
    await this.filmRepository.remove(film);

    return { success: true };
  }

  /**
   * Retrieves all related entities for a film.
   *
   * @param {CreateFilmDto | UpdateFilmDto} dto - The data transfer object containing the identifiers for entities
   * to retrieve.
   * @returns {Promise<[Person[], Planet[], Specie[], Vehicle[], Starship[], Image[]]>} A promise that resolves to a
   * tuple containing arrays of entities:
   */
  async getAllLinks(
    dto: CreateFilmDto | UpdateFilmDto,
  ): Promise<[Person[], Planet[], Specie[], Vehicle[], Starship[], Image[]]> {
    return await Promise.all([
      this.commonService.getPeople(dto.characters),
      this.commonService.getPlanets(dto.planets),
      this.commonService.getSpecies(dto.species),
      this.commonService.getVehicles(dto.vehicles),
      this.commonService.getStarships(dto.starships),
      this.commonService.getImages(dto.images),
    ]);
  }
}
