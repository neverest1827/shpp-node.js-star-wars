import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { Person } from '../person/entities/person.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Film } from '../film/entities/film.entity';
import { Specie } from '../specie/entities/specie.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Image } from '../image/entities/image.entity';
import { ConfigService } from '@nestjs/config';
import { ImageService } from '../image/image.service';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Planet)
    private readonly planetRepository: Repository<Planet>,
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Specie)
    private readonly specieRepository: Repository<Specie>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Starship)
    private readonly starshipRepository: Repository<Starship>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly configService: ConfigService,
    private readonly imageService: ImageService,
  ) {}
  createUrl(id: number, entity: string): string {
    const port: number = this.configService.get<number>('PORT', 3000);
    return `http://localhost:${port}/${entity}/${id}`;
  }

  async getEntitiesByIds<T>(ids: number[], entity: string): Promise<T[]> {
    if (!ids.length) return [];
    const repository: Repository<EntityType> =
      this.getRepositoryByEntityName(entity);

    return await Promise.all(
      ids.map(async (id: number): Promise<EntityType | null> => {
        return repository.findOne({ where: { id } });
      }),
    );
  }

  async getImages(imageNames: string[]): Promise<Image[]> {
    if (!imageNames.length) return [];

    const imagePromises: Promise<Image>[] = imageNames.map(
      async (filename: string): Promise<Image | null> => {
        return await this.imageRepository.findOne({ where: { filename } });
      },
    );

    return await Promise.all(imagePromises);
  }

  async cleanUpUnusedImages(
    oldImages: Image[],
    newImages: Image[],
  ): Promise<void> {
    if (newImages.length === 0 && oldImages.length > 0) {
      for (const image of oldImages) {
        await this.imageService.remove(image.filename);
      }
    } else {
      const newImageIds: Set<number> = new Set(
        newImages.map((img: Image) => img.id),
      );

      const unusedImages: Image[] = oldImages.filter(
        (img: Image) => !newImageIds.has(img.id),
      );

      for (const image of unusedImages) {
        await this.imageService.remove(image.filename);
      }
    }
  }

  /**
   * Retrieves the ID of the last record in the specified repository and returns the next available ID.
   * If the repository is empty, returns 1.
   *
   * @template T - The entity type, which must have an `id` property of type number.
   * @param {Repository<T>} repository - The TypeORM repository to search for the record.
   * @returns {Promise<number>} - The next ID that can be used for a new record.
   */
  async getId<T extends { id: number }>(
    repository: Repository<T>,
  ): Promise<number> {
    const lastEntity: T[] = await repository.find({
      order: { id: 'DESC' } as FindOptionsOrder<T>,
      take: 1,
    });

    return lastEntity.length > 0 ? ++lastEntity[0].id : 1;
  }

  /**
   * Generates pagination links for navigating through paginated results.
   *
   * @param {string} entity - The entity name to be included in the URL path.
   * @param {number} page - The current page number.
   * @param {number} limit - The number of items per page.
   * @param {number} total - The total number of items.
   * @returns {IPaginationLinks} An object containing the URLs for the first, previous, next, and last pages.
   */
  getPaginationLinks(
    entity: string,
    page: number,
    limit: number,
    total: number,
  ): IPaginationLinks {
    return {
      first: `api/v1/${entity}?page=1&limit=${limit}`,
      previous:
        page > 1 ? `api/v1/people?page=${page - 1}&limit=${limit}` : null,
      next:
        page < Math.ceil(total / limit)
          ? `api/v1/people?page=${page + 1}&limit=${limit}`
          : null,
      last: `api/v1/people?page=${Math.ceil(total / limit)}&limit=${limit}`,
    };
  }

  /**
   * Generates pagination metadata for a paginated response.
   *
   * @param {number} total - The total number of items across all pages.
   * @param {number} count - The number of items on the current page.
   * @param {number} limit - The number of items per page.
   * @param {number} page - The current page number.
   * @returns {IPaginationMeta} An object containing pagination metadata such as total items, item count, items per
   * page, total pages, and the current page.
   */
  getPaginationMeta(
    total: number,
    count: number,
    limit: number,
    page: number,
  ): IPaginationMeta {
    return {
      totalItems: total,
      itemCount: count,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  /**
   * Retrieves ids of related entities for a specific entity and its relation.
   *
   * @template T - The type of the entities being retrieved.
   * @param {string} entity - The name of the entity for which relations are being fetched (e.g., 'person', 'planet', 'starship').
   * @param {string} relation - The name of the relation that links to the entity (e.g., 'films' if fetching related films).
   * @param {number} id - The ID of the entity for which related entities are being fetched.
   * @returns {Promise<T[]>} A promise that resolves to an array of related entities, each containing only the id field.
   */
  async getRelationIds<T>(
    entity: string,
    relation: string,
    id: number,
  ): Promise<T[]> {
    const repository: Repository<EntityType> =
      this.getRepositoryByEntityName(entity);

    const alias: string = `${entity}_relation`;

    return await repository
      .createQueryBuilder(entity)
      .innerJoin(`${entity}.${relation}`, alias, `${alias}.id = :id`, { id })
      .select([`${entity}.id`])
      .getMany();
  }

  /**
   * Returns the TypeORM repository for a given entity name.
   *
   * @param {string} entity - The name of the entity for which to retrieve the repository.
   * @returns {Repository<any>} The repository corresponding to the given entity name.
   * @throws {Error} If the entity name is unknown or not supported.
   */
  private getRepositoryByEntityName(entity: string): Repository<any> {
    switch (entity) {
      case 'person':
        return this.personRepository;
      case 'planet':
        return this.planetRepository;
      case 'film':
        return this.filmRepository;
      case 'starship':
        return this.starshipRepository;
      case 'vehicle':
        return this.vehicleRepository;
      case 'specie':
        return this.specieRepository;
      default:
        throw new Error(`Unknown entity: ${entity}`);
    }
  }
}
