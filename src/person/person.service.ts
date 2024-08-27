import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Image } from '../image/entities/image.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Creates a new person entity based on the provided DTO.
   *
   * @param {CreatePersonDto} dto - Data transfer object containing information about the person to create.
   * @returns {Promise<OperationResult>} - Result of the operation, indicating success or failure.
   * @throws {Error} Throws an error if there is an issue with creating or saving the person.
   */
  async create(dto: CreatePersonDto): Promise<OperationResult> {
    const id: number = (await this.personRepository.count()) + 1;
    const date: Date = new Date();

    const new_people: Person = this.personRepository.create({
      id: id,
      name: dto.name,
      height: dto.height || null,
      mass: dto.mass || null,
      hair_color: dto.hair_color,
      skin_color: dto.skin_color,
      eye_color: dto.eye_color,
      birth_year: dto.birth_year,
      gender: dto.gender,
      homeworld: await this.commonService.getPlanets(dto.homeworld),
      films: await this.commonService.getFilms(dto.films),
      species: await this.commonService.getSpecies(dto.species),
      vehicles: await this.commonService.getVehicles(dto.vehicles),
      starships: await this.commonService.getStarships(dto.starships),
      images: await this.commonService.getImages(dto.images),
      created: date,
      edited: date,
      url: this.commonService.createUrl(id, 'people'),
    });

    await this.personRepository.save(new_people);
    return { success: true };
  }

  /**
   * Retrieves a paginated list of catalog items (persons) with related images.
   *
   * @param {number} numPage - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Person[]>} - A promise that resolves to an array of persons with their related images.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getCatalogItems(numPage: number, limit: number): Promise<Person[]> {
    const offset: number = (numPage - 1) * limit;

    return await this.personRepository.find({
      relations: ['images'],
      skip: offset,
      take: limit,
    });
  }

  /**
   * Retrieves a list of persons with only their IDs and names. Necessary to create selections on the client side
   *
   * @returns {Promise<Person[]>} A promise that resolves to an array of `Person` objects, each containing the ID and name of a person.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getNames(): Promise<Person[]> {
    return await this.personRepository
      .createQueryBuilder('people')
      .select(['people.id', 'people.name'])
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
      height: '',
      mass: '',
      hair_color: '',
      skin_color: '',
      eye_color: '',
      birth_year: '',
      gender: '',
      homeworld: 'planets',
      films: 'films',
      species: 'species',
      vehicles: 'vehicles',
      starships: 'starships',
    };
  }

  /**
   * Finds a person by their ID, including related entities.
   *
   * @param {number} id - The ID of the person to find.
   * @param {string[]} relations - Array of related entity names to include in the query.
   * @returns {Promise<Person>} A promise that resolves to the found person, including related entities.
   * @throws {Error} If the person could not be found.
   */
  async findOne(id: number, relations: string[]): Promise<Person> {
    return await this.personRepository.findOne({
      relations: relations,
      where: { id },
    });
  }

  /**
   * Retrieves detailed information about a person entity by their ID, including related entities such as homeworld, films, species, vehicles, starships, and images.
   *
   * @param {number} id - The ID of the person to retrieve.
   * @returns {Promise<Person>} A promise that resolves to a `Person` object containing detailed information, including related entities.
   * @throws {Error} Throws an error if the person with the given ID does not exist or if there is an issue with the query.
   */
  async getEntityInfo(id: number): Promise<Person> {
    return await this.personRepository
      .createQueryBuilder('person')
      .leftJoin('person.homeworld', 'planet')
      .leftJoin('person.films', 'film')
      .leftJoin('person.species', 'specie')
      .leftJoin('person.vehicles', 'vehicle')
      .leftJoin('person.starships', 'starship')
      .leftJoin('person.images', 'image')
      .select([
        'person.name',
        'person.height',
        'person.mass',
        'person.birth_year',
        'person.hair_color',
        'person.skin_color',
        'person.eye_color',
        'person.gender',
        'planet.id',
        'planet.name',
        'planet.url',
        'film.id',
        'film.title',
        'film.url',
        'specie.id',
        'specie.name',
        'specie.url',
        'vehicle.id',
        'vehicle.name',
        'vehicle.url',
        'starship.id',
        'starship.name',
        'starship.url',
        'image.id',
        'image.filename',
        'image.url',
      ])
      .where('person.id = :id', { id })
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
  async update(id: number, dto: UpdatePersonDto): Promise<OperationResult> {
    const person: Person = await this.findOne(id, ['images']);
    const oldImages: Image[] = person.images;

    const [homeworld, films, species, vehicles, starships, images] =
      await Promise.all([
        this.commonService.getPlanets(dto.homeworld),
        this.commonService.getFilms(dto.films),
        this.commonService.getSpecies(dto.species),
        this.commonService.getVehicles(dto.vehicles),
        this.commonService.getStarships(dto.starships),
        this.commonService.getImages(dto.images),
      ]);

    Object.assign(person, {
      name: dto.name ?? person.name,
      height: dto.height || person.height,
      mass: dto.mass || person.mass,
      hair_color: dto.hair_color ?? person.hair_color,
      skin_color: dto.skin_color ?? person.skin_color,
      eye_color: dto.eye_color ?? person.eye_color,
      birth_year: dto.birth_year ?? person.birth_year,
      gender: dto.gender ?? person.gender,
      edited: new Date(),
      homeworld,
      films,
      species,
      vehicles,
      starships,
      images,
    });

    await this.personRepository.save(person);

    if (oldImages.length) {
      await this.commonService.cleanUpUnusedImages(oldImages, person.images);
    }

    return { success: true };
  }

  /**
   * Removes a person by their ID, including cleanup of related entities and images.
   *
   * @param {number} id - The ID of the person to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the person does not exist.
   */
  async remove(id: number): Promise<OperationResult> {
    const person: Person = await this.findOne(id, ['images']);

    if (person.images.length) {
      await this.commonService.cleanUpUnusedImages(person.images, []);
    }
    person.images = [];

    await this.personRepository.save(person);
    await this.personRepository.remove(person);

    return { success: true };
  }
}
