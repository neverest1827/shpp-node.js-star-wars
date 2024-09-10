import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Image } from '../image/entities/image.entity';
import { Film } from '../film/entities/film.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Specie } from '../specie/entities/specie.entity';

describe('PersonService', (): void => {
  const mockImage: Image = { id: 1, filename: 'image.jpg' } as Image;
  const mockPerson: Person = {
    id: 1,
    name: 'John Doe',
    images: [mockImage],
  } as Person;

  let personService: PersonService;
  let personRepository: Repository<Person>;
  let commonService: CommonService;

  beforeEach(async (): Promise<void> => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockRepository,
        },
        {
          provide: CommonService,
          useValue: {
            getEntitiesByIds: jest.fn(),
            getId: jest.fn(),
            getImages: jest.fn(),
            createUrl: jest.fn(),
            cleanUpUnusedImages: jest.fn(),
          },
        },
      ],
    }).compile();

    personService = module.get<PersonService>(PersonService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    commonService = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(personService).toBeDefined();
  });

  describe('create', (): void => {
    it('should successfully create a new person', async (): Promise<void> => {
      const createPersonDto: CreatePersonDto = {
        name: 'John Doe',
        height: 180,
        mass: 80,
        hair_color: 'brown',
        skin_color: 'white',
        eye_color: 'blue',
        birth_year: '2000',
        gender: 'male',
        homeworld: [1],
        films: [1],
        species: [1],
        vehicles: [1],
        starships: [1],
        images: ['image.jpg'],
      };

      jest.spyOn(personRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(personRepository, 'save')
        .mockResolvedValue(createPersonDto as any);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(commonService, 'createUrl').mockReturnValue('url');
      jest.spyOn(commonService, 'getId').mockResolvedValue(1);

      const result: OperationResult =
        await personService.create(createPersonDto);

      expect(result).toEqual({ success: true });
      expect(personRepository.save).toHaveBeenCalled();
    });
  });

  describe('getCatalogItems', (): void => {
    it('should retrieve paginated catalog items', async (): Promise<void> => {
      const people: Person[] = [mockPerson];

      jest.spyOn(personRepository, 'find').mockResolvedValue(people);

      const result: Person[] = await personService.getCatalogItems(1, 10);

      expect(result).toEqual(people);
      expect(personRepository.find).toHaveBeenCalledWith({
        relations: ['images'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getNames', (): void => {
    it('should retrieve person names', async (): Promise<void> => {
      const people: Person[] = [mockPerson];

      jest.spyOn(personRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(people),
      } as any);

      const result: Person[] = await personService.getNames();

      expect(result).toEqual(people);
    });
  });

  describe('getFormSchema', (): void => {
    it('should return form schema', (): void => {
      const result: FormSchema = personService.getFormSchema();

      expect(result).toEqual({
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
      });
    });
  });

  describe('findOne', (): void => {
    it('should find a person by ID with relations', async (): Promise<void> => {
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(mockPerson);

      const result: Person = await personService.findOne(1, ['images']);

      expect(result).toEqual(mockPerson);
      expect(personRepository.findOne).toHaveBeenCalledWith({
        relations: ['images'],
        where: { id: 1 },
      });
    });
  });

  describe('getEntityInfo', (): void => {
    it('should retrieve detailed person information', async (): Promise<void> => {
      jest.spyOn(personRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPerson),
      } as any);

      const result: Person = await personService.getEntityInfo(1);
      expect(result).toEqual(mockPerson);
    });
  });

  describe('update', (): void => {
    it('should update a person and clean up unused images', async (): Promise<void> => {
      const oldPerson: Person = {
        id: 1,
        name: 'Old Name',
        height: 170,
        mass: 75,
        hair_color: 'Old hair color',
        skin_color: 'Old skin color',
        eye_color: 'Old eye color',
        birth_year: '45BBN',
        gender: 'Old gender',
        homeworld: [{ id: 1, name: 'Old Planet' }] as Planet[],
        films: [{ id: 1, title: 'Old Film' }] as Film[],
        species: [{ id: 1, name: 'Old Specie' }] as Specie[],
        starships: [{ id: 1, name: 'Old Starship' }] as Starship[],
        vehicles: [{ id: 1, name: 'Old Vehicle' }] as Vehicle[],
        images: [{ id: 1, filename: 'old.jpg' }] as Image[],
        created: new Date(),
        edited: new Date(),
        url: 'http://example.com/old',
      };

      const dto: UpdatePersonDto = { name: 'Updated Name' };

      const updatedPerson: Person = {
        ...oldPerson,
        name: 'Updated Name',
        homeworld: [],
        films: [],
        species: [],
        starships: [],
        vehicles: [],
        edited: expect.any(Date),
        images: [],
      };

      jest.spyOn(personService, 'findOne').mockResolvedValue(oldPerson);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(personRepository, 'save').mockResolvedValue(updatedPerson);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();

      const result: OperationResult = await personService.update(1, dto);

      expect(result).toEqual({ success: true });
      expect(personRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedPerson),
      );
      expect(commonService.cleanUpUnusedImages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ filename: 'old.jpg' }),
        ]),
        [],
      );
    });
  });

  describe('remove', (): void => {
    it('should remove a person and clean up images', async (): Promise<void> => {
      jest.spyOn(personService, 'findOne').mockResolvedValue(mockPerson);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();
      jest.spyOn(personRepository, 'save').mockResolvedValue(mockPerson);
      jest.spyOn(personRepository, 'remove').mockResolvedValue(mockPerson);

      const result: OperationResult = await personService.remove(1);

      expect(result).toEqual({ success: true });
      expect(personRepository.save).toHaveBeenCalledWith({
        ...mockPerson,
        images: [],
      });
      expect(personRepository.remove).toHaveBeenCalledWith(mockPerson);
    });
  });
});
