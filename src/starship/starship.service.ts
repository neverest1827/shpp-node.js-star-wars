import { Injectable } from '@nestjs/common';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Starship } from './entities/starship.entity';
import { Image } from '../image/entities/image.entity';
import { Person } from '../person/entities/person.entity';
import { Film } from '../film/entities/film.entity';
import {
  IPaginationLinks,
  IPaginationMeta,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class StarshipService {
  constructor(
    @InjectRepository(Starship)
    private starshipRepository: Repository<Starship>,
    private readonly commonService: CommonService,
  ) {}
  /**
   * Creates a new starship entity based on the provided DTO.
   *
   * @param {CreateStarshipDto} dto - Data transfer object containing information about the starship to create.
   * @returns {Promise<OperationResult>} - Result of the operation, indicating success or failure.
   * @throws {Error} Throws an error if there is an issue with creating or saving the starship.
   */
  async create(dto: CreateStarshipDto): Promise<OperationResult> {
    const id: number = await this.commonService.getId(this.starshipRepository);
    const date: Date = new Date();

    const [pilots, films, images] = await this.getAllLinks(dto);

    const new_starship: Starship = this.starshipRepository.create({
      id,
      name: dto.name,
      model: dto.model,
      manufacturer: dto.manufacturer,
      cost_in_credits: dto.cost_in_credits || null,
      length: dto.length || null,
      max_atmosphering_speed: dto.max_atmosphering_speed || null,
      crew: dto.crew || null,
      passengers: dto.passengers || null,
      cargo_capacity: dto.cargo_capacity || null,
      consumables: dto.consumables,
      hyperdrive_rating: dto.hyperdrive_rating || null,
      MGLT: dto.MGLT || null,
      starship_class: dto.starship_class,
      pilots,
      films,
      images,
      created: date,
      edited: date,
      url: this.commonService.createUrl(id, 'starships'),
    });

    await this.starshipRepository.save(new_starship);
    return { success: true };
  }

  /**
   * Retrieves a paginated list of catalog items (starships) with related images.
   *
   * @param {number} numPage - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Starship[]>} - A promise that resolves to an array of starships with their related images.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getCatalogItems(numPage: number, limit: number): Promise<Starship[]> {
    const offset: number = (numPage - 1) * limit;

    return await this.starshipRepository.find({
      relations: ['images'],
      skip: offset,
      take: limit,
    });
  }

  /**
   * Retrieves a list of starships with only their IDs and names. Necessary to create selections on the client side
   *
   * @returns {Promise<Person[]>} A promise that resolves to an array of `Starship` objects, each containing the ID and name of a starship.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getNames(): Promise<Starship[]> {
    return await this.starshipRepository
      .createQueryBuilder('starship')
      .select(['starship.id', 'starship.name'])
      .getMany();
  }

  /**
   * Returns the schema for a form used to create or update a starship.
   *
   * @returns {FormSchema} - The schema object with default values for a starship form.
   */
  getFormSchema(): FormSchema {
    return {
      name: '',
      model: '',
      manufacturer: '',
      cost_in_credits: '',
      length: '',
      max_atmosphering_speed: '',
      crew: '',
      passengers: '',
      cargo_capacity: '',
      consumables: '',
      hyperdrive_rating: '',
      MGLT: '',
      starship_class: '',
      pilots: 'people',
      films: 'films',
    };
  }

  /**
   * Retrieves a paginated list of starships from the database.
   *
   * @param {number} page - The current page number for pagination.
   * @param {number} limit - The maximum number of starships to return per page.
   * @returns {Promise<Pagination<Vehicle>>} A promise that resolves to a `Pagination` object containing the starships,
   * pagination metadata, and links.
   */
  async findAll(page: number, limit: number): Promise<Pagination<Starship>> {
    const [starships, total] = await this.starshipRepository
      .createQueryBuilder('starship')
      .orderBy('starship.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    for (const starship of starships) {
      const [pilots, films] = await Promise.all([
        this.commonService.getRelationIds<Person>(
          'person',
          'starships',
          starship.id,
        ),
        this.commonService.getRelationIds<Film>(
          'film',
          'starships',
          starship.id,
        ),
      ]);

      starship.pilots = pilots;
      starship.films = films;
    }

    const meta: IPaginationMeta = this.commonService.getPaginationMeta(
      total,
      starships.length,
      limit,
      page,
    );

    const links: IPaginationLinks = this.commonService.getPaginationLinks(
      'starships',
      page,
      limit,
      total,
    );

    return new Pagination<Starship>(starships, meta, links);
  }

  /**
   * Finds a starship by their ID, including related entities.
   *
   * @param {number} id - The ID of the starship to find.
   * @param {string[]} relations - Array of related entity names to include in the query.
   * @returns {Promise<Starship>} A promise that resolves to the found starship, including related entities.
   * @throws {Error} If the starship could not be found.
   */
  async findOne(id: number, relations: string[]): Promise<Starship> {
    return await this.starshipRepository.findOne({
      relations: relations,
      where: { id },
    });
  }

  /**
   * Retrieves detailed information about a starship entity by their ID, including related entities such as pilots, films and images.
   *
   * @param {number} id - The ID of the starship to retrieve.
   * @returns {Promise<Person>} A promise that resolves to a `Starship` object containing detailed information, including related entities.
   * @throws {Error} Throws an error if the starship with the given ID does not exist or if there is an issue with the query.
   */
  async getEntityInfo(id: number): Promise<Starship> {
    return await this.starshipRepository
      .createQueryBuilder('starship')
      .leftJoin('starship.pilots', 'person')
      .leftJoin('starship.films', 'film')
      .leftJoin('starship.images', 'image')
      .select([
        'starship.name',
        'starship.model',
        'starship.manufacturer',
        'starship.cost_in_credits',
        'starship.length',
        'starship.max_atmosphering_speed',
        'starship.crew',
        'starship.passengers',
        'starship.cargo_capacity',
        'starship.consumables',
        'starship.hyperdrive_rating',
        'starship.MGLT',
        'starship.starship_class',
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
      .where('starship.id = :id', { id })
      .getOne();
  }

  /**
   * Updates a starship's information by their ID, including related entities and handling image cleanup.
   *
   * @param {number} id - The ID of the starship to update.
   * @param {UpdateStarshipDto} dto - The data transfer object containing the updated starship information.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the starship could not be found or updated.
   */
  async update(id: number, dto: UpdateStarshipDto): Promise<OperationResult> {
    const starship: Starship = await this.findOne(id, ['iamges']);
    const oldImages: Image[] = starship.images;

    const [pilots, films, images] = await this.getAllLinks(dto);

    Object.assign(starship, {
      name: dto.name ?? starship.name,
      model: dto.model ?? starship.model,
      manufacturer: dto.manufacturer ?? starship.manufacturer,
      cost_in_credits: dto.cost_in_credits || starship.cost_in_credits,
      length: dto.length || starship.length,
      max_atmosphering_speed:
        dto.max_atmosphering_speed || starship.max_atmosphering_speed,
      crew: dto.crew || starship.crew,
      passengers: dto.passengers || starship.passengers,
      cargo_capacity: dto.cargo_capacity || starship.cargo_capacity,
      consumables: dto.consumables ?? starship.starship_class,
      hyperdrive_rating: dto.hyperdrive_rating || starship.hyperdrive_rating,
      MGLT: dto.MGLT || starship.MGLT,
      starship_class: dto.starship_class ?? starship.starship_class,
      edited: new Date(),
      pilots,
      films,
      images,
    });

    await this.starshipRepository.save(starship);

    if (oldImages.length) {
      await this.commonService.cleanUpUnusedImages(oldImages, starship.images);
    }

    return { success: true };
  }

  /**
   * Removes a starship by their ID, including cleanup of related entities and images.
   *
   * @param {number} id - The ID of the starship to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the starship does not exist.
   */
  async remove(id: number): Promise<OperationResult> {
    const starship: Starship = await this.findOne(id, ['images']);

    if (starship.images.length) {
      await this.commonService.cleanUpUnusedImages(starship.images, []);
    }
    starship.images = [];

    await this.starshipRepository.save(starship);
    await this.starshipRepository.remove(starship);

    return { success: true };
  }

  /**
   * Retrieves all related entities for a starship.
   *
   * @param { CreateStarshipDto | UpdateStarshipDto } dto - The data transfer object containing the identifiers for
   * entities to retrieve.
   * @returns { Promise<[Person[], Film[], Image[]]> } A promise that resolves to a tuple containing arrays
   * of entities:
   */
  async getAllLinks(
    dto: CreateStarshipDto | UpdateStarshipDto,
  ): Promise<[Person[], Film[], Image[]]> {
    return await Promise.all([
      this.commonService.getEntitiesByIds<Person>(dto.pilots, 'person'),
      this.commonService.getEntitiesByIds<Film>(dto.films, 'film'),
      this.commonService.getImages(dto.images),
    ]);
  }
}
