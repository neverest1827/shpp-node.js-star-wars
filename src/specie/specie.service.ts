import { Injectable } from '@nestjs/common';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specie } from './entities/specie.entity';
import { CommonService } from '../common/common.service';
import { FormSchema, OperationResult } from '../common/types/types';
import { Image } from '../image/entities/image.entity';

@Injectable()
export class SpecieService {
  constructor(
    @InjectRepository(Specie)
    private specieRepository: Repository<Specie>,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Creates a new specie entity based on the provided DTO.
   *
   * @param {CreateSpecieDto} dto - Data transfer object containing information about the specie to create.
   * @returns {Promise<OperationResult>} - Result of the operation, indicating success or failure.
   * @throws {Error} Throws an error if there is an issue with creating or saving the specie.
   */
  async create(dto: CreateSpecieDto): Promise<OperationResult> {
    const id: number = (await this.specieRepository.count()) + 1;
    const date: Date = new Date();
    const new_specie: Specie = this.specieRepository.create({
      id: id,
      name: dto.name,
      classification: dto.classification,
      designation: dto.designation,
      average_height: dto.average_height || null,
      skin_colors: dto.skin_colors,
      hair_colors: dto.hair_colors,
      eye_colors: dto.eye_colors,
      average_lifespan: dto.average_lifespan || null,
      language: dto.language,
      homeworld: await this.commonService.getPlanets(dto.homeworld),
      people: await this.commonService.getPeople(dto.people),
      films: await this.commonService.getFilms(dto.films),
      images: await this.commonService.getImages(dto.images),
      created: date,
      edited: date,
      url: this.commonService.createUrl(id, 'species'),
    });

    await this.specieRepository.save(new_specie);
    return { success: true };
  }

  /**
   * Retrieves a paginated list of catalog items (species) with related images.
   *
   * @param {number} numPage - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Person[]>} - A promise that resolves to an array of species with their related images.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getCatalogItems(numPage: number, limit: number): Promise<Specie[]> {
    const offset: number = (numPage - 1) * limit;

    return await this.specieRepository.find({
      relations: ['images'],
      skip: offset,
      take: limit,
    });
  }

  /**
   * Retrieves a list of specie with only their IDs and names. Necessary to create selections on the client side
   *
   * @returns {Promise<Specie[]>} A promise that resolves to an array of `Specie` objects, each containing the ID and name of a specie.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getNames(): Promise<Specie[]> {
    return await this.specieRepository
      .createQueryBuilder('specie')
      .select(['specie.id', 'specie.name'])
      .getMany();
  }

  /**
   * Returns the schema for a form used to create or update a person.
   *
   * @returns {FormSchema} - The schema object with default values for a person form.
   */
  getFormSchema(): FormSchema {
    return {
      name: '',
      classification: '',
      designation: '',
      average_height: '',
      skin_colors: '',
      hair_colors: '',
      eye_colors: '',
      average_lifespan: '',
      language: '',
      homeworld: 'planets',
      people: 'people',
      films: 'films',
    };
  }

  /**
   * Finds a specie by their ID, including related entities.
   *
   * @param {number} id - The ID of the person to find.
   * @param {string[]} relations - Array of related entity names to include in the query.
   * @returns {Promise<Specie>} A promise that resolves to the found specie, including related entities.
   * @throws {Error} If the specie could not be found.
   */
  async findOne(id: number, relations: string[]): Promise<Specie> {
    return await this.specieRepository.findOne({
      relations: relations,
      where: { id },
    });
  }

  /**
   * Retrieves detailed information about a specie entity by their ID, including related entities such as homeworld, films, people and images.
   *
   * @param {number} id - The ID of the specie to retrieve.
   * @returns {Promise<Person>} A promise that resolves to a `Specie` object containing detailed information, including related entities.
   * @throws {Error} Throws an error if the specie with the given ID does not exist or if there is an issue with the query.
   */
  async getEntityInfo(id: number): Promise<Specie> {
    return await this.specieRepository
      .createQueryBuilder('specie')
      .leftJoin('specie.homeworld', 'planet')
      .leftJoin('specie.films', 'film')
      .leftJoin('specie.people', 'person')
      .leftJoin('specie.images', 'image')
      .select([
        'specie.name',
        'specie.classification',
        'specie.designation',
        'specie.average_height',
        'specie.skin_colors',
        'specie.hair_colors',
        'specie.eye_colors',
        'specie.average_lifespan',
        'specie.language',
        'planet.id',
        'planet.name',
        'planet.url',
        'film.id',
        'film.title',
        'film.url',
        'person.id',
        'person.name',
        'person.url',
        'image.id',
        'image.filename',
        'image.url',
      ])
      .where('specie.id = :id', { id })
      .getOne();
  }

  /**
   * Updates a specie's information by their ID, including related entities and handling image cleanup.
   *
   * @param {number} id - The ID of the specie to update.
   * @param {UpdatePersonDto} dto - The data transfer object containing the updated specie information.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the specie could not be found or updated.
   */
  async update(id: number, dto: UpdateSpecieDto): Promise<OperationResult> {
    const specie: Specie = await this.findOne(id, ['images']);
    const oldImages: Image[] = specie.images;

    const [homeworld, people, films, images] = await Promise.all([
      this.commonService.getPlanets(dto.homeworld),
      this.commonService.getPeople(dto.people),
      this.commonService.getFilms(dto.films),
      this.commonService.getImages(dto.images),
    ]);

    Object.assign(specie, {
      name: dto.name ?? specie.name,
      classification: dto.classification ?? specie.classification,
      designation: dto.designation ?? specie.designation,
      average_height: dto.average_height || specie.average_height,
      skin_colors: dto.skin_colors ?? specie.skin_colors,
      hair_colors: dto.hair_colors ?? specie.hair_colors,
      eye_colors: dto.eye_colors ?? specie.eye_colors,
      average_lifespan: dto.average_lifespan || specie.average_lifespan,
      language: dto.language ?? specie.language,
      edited: new Date(),
      homeworld,
      films,
      people,
      images,
    });

    await this.specieRepository.save(specie);

    if (oldImages.length) {
      await this.commonService.cleanUpUnusedImages(oldImages, specie.images);
    }

    return { success: true };
  }

  /**
   * Removes a specie by their ID, including cleanup of related entities and images.
   *
   * @param {number} id - The ID of the specie to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the specie does not exist.
   */
  async remove(id: number): Promise<OperationResult> {
    const specie: Specie = await this.findOne(id, ['images']);

    if (specie.images.length) {
      await this.commonService.cleanUpUnusedImages(specie.images, []);
    }
    specie.images = [];

    await this.specieRepository.save(specie);
    await this.specieRepository.remove(specie);

    return { success: true };
  }
}
