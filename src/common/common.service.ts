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

  async getEntitiesByIds(
    ids: number[],
    repository: Repository<EntityType>,
  ): Promise<EntityType[]> {
    if (!ids.length) return [];

    return await Promise.all(
      ids.map(async (id: number): Promise<EntityType | null> => {
        return repository.findOne({ where: { id } });
      }),
    );
  }

  async getPeople(peopleIds: number[]): Promise<Person[]> {
    return (await this.getEntitiesByIds(
      peopleIds,
      this.personRepository,
    )) as Person[];
  }

  async getPlanets(ids: number[]): Promise<Planet[]> {
    return this.getEntitiesByIds(ids, this.planetRepository);
  }

  async getFilms(ids: number[]): Promise<Film[]> {
    return (await this.getEntitiesByIds(ids, this.filmRepository)) as Film[];
  }

  async getSpecies(ids: number[]): Promise<Specie[]> {
    return (await this.getEntitiesByIds(
      ids,
      this.specieRepository,
    )) as Specie[];
  }

  async getVehicles(ids: number[]): Promise<Vehicle[]> {
    return (await this.getEntitiesByIds(
      ids,
      this.vehicleRepository,
    )) as Vehicle[];
  }

  async getStarships(ids: number[]): Promise<Starship[]> {
    return (await this.getEntitiesByIds(
      ids,
      this.starshipRepository,
    )) as Starship[];
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
}
