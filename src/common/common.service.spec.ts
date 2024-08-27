import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from './common.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ImageService } from '../image/image.service';
import { Repository } from 'typeorm';
import { Person } from '../people/entities/person.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Film } from '../film/entities/film.entity';
import { Specie } from '../specie/entities/specie.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Image } from '../image/entities/image.entity';

const mockPerson1: Person = {
  id: 1,
  name: 'Luke Skywalker',
  height: 172,
  mass: 77,
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: [],
  films: [],
  species: [],
  starships: [],
  vehicles: [],
  created: new Date(),
  edited: new Date(),
  url: 'http://localhost:3000/people/1',
  images: [],
};

const mockPerson2: Person = {
  id: 2,
  name: 'Darth Vader',
  height: 202,
  mass: 136,
  hair_color: 'none',
  skin_color: 'white',
  eye_color: 'yellow',
  birth_year: '41.9BBY',
  gender: 'male',
  homeworld: [],
  films: [],
  species: [],
  starships: [],
  vehicles: [],
  created: new Date(),
  edited: new Date(),
  url: 'http://localhost:3000/people/4',
  images: [],
};

describe('CommonService', () => {
  let service: CommonService;
  let personRepository: Repository<Person>;
  let imageService: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService,
        {
          provide: getRepositoryToken(Person),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Film),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Specie),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Image),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3000),
          },
        },
        {
          provide: ImageService,
          useValue: {
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommonService>(CommonService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    imageService = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUrl', () => {
    it('should return a correct URL', () => {
      const url = service.createUrl(1, 'person');
      expect(url).toBe('http://localhost:3000/person/1');
    });
  });

  describe('getEntitiesByIds', () => {
    it('should return entities by their IDs', async () => {
      const mockEntities = [mockPerson1, mockPerson2];
      jest
        .spyOn(personRepository, 'findOne')
        .mockResolvedValueOnce(mockEntities[0]);
      jest
        .spyOn(personRepository, 'findOne')
        .mockResolvedValueOnce(mockEntities[1]);

      const result = await service.getEntitiesByIds([1, 2], personRepository);
      expect(result).toEqual(mockEntities);
    });
  });

  describe('getPeople', () => {
    it('should return people by their IDs', async () => {
      const mockPeople = [mockPerson1, mockPerson2];
      jest
        .spyOn(personRepository, 'findOne')
        .mockResolvedValueOnce(mockPeople[0]);
      jest
        .spyOn(personRepository, 'findOne')
        .mockResolvedValueOnce(mockPeople[1]);

      const result = await service.getPeople([1, 2]);
      expect(result).toEqual(mockPeople);
    });
  });

  describe('cleanUpUnusedImages', () => {
    it('should call imageService.remove for old images if new images are empty', async () => {
      const mockOldImages = [{ id: 1, filename: 'old1.jpg' }];
      await service.cleanUpUnusedImages(mockOldImages as Image[], []);

      expect(imageService.remove).toHaveBeenCalledWith('old1.jpg');
    });

    it('should call imageService.remove for unused images', async () => {
      const mockOldImages = [
        { id: 1, filename: 'old1.jpg' },
        { id: 2, filename: 'old2.jpg' },
      ];
      const mockNewImages = [{ id: 1, filename: 'new1.jpg' }];
      await service.cleanUpUnusedImages(
        mockOldImages as Image[],
        mockNewImages as Image[],
      );

      expect(imageService.remove).toHaveBeenCalledWith('old2.jpg');
    });
  });
});
