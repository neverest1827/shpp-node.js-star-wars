import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { Image } from '../image/entities/image.entity';
import { Person } from '../person/entities/person.entity';
import { Film } from '../film/entities/film.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private readonly commonService: CommonService,
  ) {}
  /**
   * Creates a new vehicle entity based on the provided DTO.
   *
   * @param {CreateVehicleDto} dto - Data transfer object containing information about the vehicle to create.
   * @returns {Promise<OperationResult>} - Result of the operation, indicating success or failure.
   * @throws {Error} Throws an error if there is an issue with creating or saving the vehicle.
   */
  async create(dto: CreateVehicleDto): Promise<OperationResult> {
    const id: number = await this.commonService.getId(this.vehicleRepository);
    const date: Date = new Date();

    const [pilots, films, images] = await this.getAllLinks(dto);

    const new_vehicle: Vehicle = this.vehicleRepository.create({
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
      vehicle_class: dto.vehicle_class,
      pilots,
      films,
      images,
      created: date,
      edited: date,
      url: this.commonService.createUrl(id, 'vehicles'),
    });

    await this.vehicleRepository.save(new_vehicle);
    return { success: true };
  }

  /**
   * Retrieves a paginated list of catalog items (vehicles) with related images.
   *
   * @param {number} numPage - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Person[]>} - A promise that resolves to an array of vehicles with their related images.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getCatalogItems(numPage: number, limit: number): Promise<Vehicle[]> {
    const offset: number = (numPage - 1) * limit;

    return await this.vehicleRepository.find({
      relations: ['images'],
      skip: offset,
      take: limit,
    });
  }

  /**
   * Retrieves a list of vehicles with only their IDs and names. Necessary to create selections on the client side
   *
   * @returns {Promise<Vehicle[]>} A promise that resolves to an array of `Vehicle` objects, each containing the ID and name of a person.
   * @throws {Error} Throws an error if there is an issue with the query execution.
   */
  async getNames(): Promise<Vehicle[]> {
    return await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select(['vehicle.id', 'vehicle.name'])
      .getMany();
  }

  /**
   * Returns the schema for a form used to create or update a vehicle.
   *
   * @returns {FormSchema} - The schema object with default values for a person form.
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
      vehicle_class: '',
      pilots: 'people',
      films: 'films',
    };
  }

  /**
   * Finds a vehicle by their ID, including related entities.
   *
   * @param {number} id - The ID of the vehicle to find.
   * @param {string[]} relations - Array of related entity names to include in the query.
   * @returns {Promise<Vehicle>} A promise that resolves to the found vehicle, including related entities.
   * @throws {Error} If the vehicle could not be found.
   */
  async findOne(id: number, relations: string[]): Promise<Vehicle> {
    return await this.vehicleRepository.findOne({
      relations: relations,
      where: { id },
    });
  }

  /**
   * Retrieves detailed information about a vehicle entity by their ID, including related entities such as pilots, films and images.
   *
   * @param {number} id - The ID of the person to retrieve.
   * @returns {Promise<Vehicle>} A promise that resolves to a `Vehicle` object containing detailed information, including related entities.
   * @throws {Error} Throws an error if the vehicle with the given ID does not exist or if there is an issue with the query.
   */
  async getEntityInfo(id: number): Promise<Vehicle> {
    return await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoin('vehicle.pilots', 'person')
      .leftJoin('vehicle.films', 'film')
      .leftJoin('vehicle.images', 'image')
      .select([
        'vehicle.name',
        'vehicle.model',
        'vehicle.manufacturer',
        'vehicle.cost_in_credits',
        'vehicle.length',
        'vehicle.max_atmosphering_speed',
        'vehicle.crew',
        'vehicle.passengers',
        'vehicle.cargo_capacity',
        'vehicle.consumables',
        'vehicle.vehicle_class',
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
      .where('vehicle.id = :id', { id })
      .getOne();
  }

  /**
   * Updates a vehicle's information by their ID, including related entities and handling image cleanup.
   *
   * @param {number} id - The ID of the vehicle to update.
   * @param {UpdatePersonDto} dto - The data transfer object containing the updated vehicle information.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the vehicle could not be found or updated.
   */
  async update(id: number, dto: UpdateVehicleDto): Promise<OperationResult> {
    const vehicle: Vehicle = await this.findOne(id, ['images']);
    const oldImages: Image[] = vehicle.images;

    const [pilots, films, images] = await this.getAllLinks(dto);

    Object.assign(vehicle, {
      name: dto.name ?? vehicle.name,
      model: dto.model ?? vehicle.model,
      manufacturer: dto.manufacturer ?? vehicle.manufacturer,
      cost_in_credits: dto.cost_in_credits || vehicle.cost_in_credits,
      length: dto.length || vehicle.length,
      max_atmosphering_speed:
        dto.max_atmosphering_speed || vehicle.max_atmosphering_speed,
      crew: dto.crew || vehicle.crew,
      passengers: dto.passengers || vehicle.passengers,
      cargo_capacity: dto.cargo_capacity || vehicle.cargo_capacity,
      consumables: dto.consumables ?? vehicle,
      vehicle_class: dto.vehicle_class ?? vehicle.vehicle_class,
      edited: new Date(),
      pilots,
      films,
      images,
    });

    await this.vehicleRepository.save(vehicle);

    if (oldImages.length) {
      await this.commonService.cleanUpUnusedImages(oldImages, vehicle.images);
    }

    return { success: true };
  }

  /**
   * Removes a vehicle by their ID, including cleanup of related entities and images.
   *
   * @param {number} id - The ID of the vehicle to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to the operation result indicating success.
   * @throws {Error} If the vehicle does not exist.
   */
  async remove(id: number): Promise<OperationResult> {
    const vehicle: Vehicle = await this.findOne(id, ['images']);

    if (vehicle.images.length) {
      await this.commonService.cleanUpUnusedImages(vehicle.images, []);
    }
    vehicle.images = [];

    await this.vehicleRepository.save(vehicle);
    await this.vehicleRepository.remove(vehicle);

    return { success: true };
  }

  /**
   * Retrieves all related entities for a vehicle.
   *
   * @param { CreateStarshipDto | UpdateStarshipDto } dto - The data transfer object containing the identifiers for
   * entities to retrieve.
   * @returns { Promise<[Person[], Film[], Image[]]> } A promise that resolves to a tuple containing arrays
   * of entities:
   */
  async getAllLinks(
    dto: CreateVehicleDto | UpdateVehicleDto,
  ): Promise<[Person[], Film[], Image[]]> {
    return await Promise.all([
      this.commonService.getPeople(dto.pilots),
      this.commonService.getFilms(dto.films),
      this.commonService.getImages(dto.images),
    ]);
  }
}
