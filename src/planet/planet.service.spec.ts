import { Test, TestingModule } from '@nestjs/testing';
import { PlanetService } from './planet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { Image } from '../image/entities/image.entity';

describe('PlanetService', (): void => {
  const mockImage: Image = { id: 1, filename: 'image.jpg' } as Image;
  const mockPlanet: Planet = {
    id: 1,
    name: 'Earth',
    images: [mockImage],
  } as Planet;

  let planetService: PlanetService;
  let planetRepository: Repository<Planet>;
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
        PlanetService,
        {
          provide: getRepositoryToken(Planet),
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

    planetService = module.get<PlanetService>(PlanetService);
    planetRepository = module.get<Repository<Planet>>(
      getRepositoryToken(Planet),
    );
    commonService = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(planetService).toBeDefined();
  });

  describe('create', (): void => {
    it('should successfully create a new planet', async (): Promise<void> => {
      const createPlanetDto: CreatePlanetDto = {
        name: 'Earth',
        rotation_period: 24,
        orbital_period: 365,
        diameter: 12742,
        climate: 'Temperate',
        gravity: '1 standard',
        terrain: 'Forests, mountains, oceans',
        surface_water: 71,
        population: 7000000000,
        residents: [1],
        films: [1, 2],
        images: ['example.jpg'],
      };

      jest.spyOn(planetRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(planetRepository, 'save')
        .mockResolvedValue(createPlanetDto as any);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(commonService, 'createUrl').mockReturnValue('url');
      jest.spyOn(commonService, 'getId').mockResolvedValue(1);

      const result: OperationResult =
        await planetService.create(createPlanetDto);

      expect(result).toEqual({ success: true });
      expect(planetRepository.save).toHaveBeenCalled();
    });
  });

  describe('getCatalogItems', (): void => {
    it('should retrieve paginated catalog items', async (): Promise<void> => {
      const planets: Planet[] = [mockPlanet];

      jest.spyOn(planetRepository, 'find').mockResolvedValue(planets);

      const result: Planet[] = await planetService.getCatalogItems(1, 10);

      expect(result).toEqual(planets);
      expect(planetRepository.find).toHaveBeenCalledWith({
        relations: ['images'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getNames', (): void => {
    it('should retrieve names of all planets', async (): Promise<void> => {
      const planets: Planet[] = [mockPlanet];

      jest.spyOn(planetRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(planets),
      } as any);

      const result: Planet[] = await planetService.getNames();

      expect(result).toEqual(planets);
    });
  });

  describe('getFormSchema', (): void => {
    it('should return form schema', (): void => {
      const result: FormSchema = planetService.getFormSchema();

      expect(result).toEqual({
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
      });
    });
  });

  describe('findOne', (): void => {
    it('should find a planet by id', async (): Promise<void> => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(mockPlanet);

      const result: Planet = await planetService.findOne(1, ['images']);

      expect(result).toEqual(mockPlanet);
      expect(planetRepository.findOne).toHaveBeenCalledWith({
        relations: ['images'],
        where: { id: 1 },
      });
    });
  });

  describe('getEntityInfo', (): void => {
    it('should retrieve detailed info of a planet by id', async (): Promise<void> => {
      jest.spyOn(planetRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPlanet),
      } as any);

      const result: Planet = await planetService.getEntityInfo(1);
      expect(result).toEqual(mockPlanet);
    });
  });

  describe('update', (): void => {
    it('should update planet details', async (): Promise<void> => {
      const oldPlanet: Planet = {
        id: 1,
        name: 'Old Name',
        rotation_period: 365,
        orbital_period: 24,
        diameter: 12345,
        climate: 'Old Climate',
        gravity: '1 standard',
        terrain: 'Old Terian',
        surface_water: 75,
        population: 123456,
        residents: [],
        species: [],
        films: [],
        created: new Date(),
        edited: new Date(),
        url: 'old url',
        images: [{ id: 1, filename: 'old.jpg' }] as Image[],
      };

      const updatePlanetDto: UpdatePlanetDto = {
        name: 'New Name',
      };

      const updatedPlanet: Planet = {
        ...updatePlanetDto,
        name: 'New Name',
        residents: [],
        species: [],
        films: [],
        edited: expect.any(Date),
        images: [],
      } as Planet;

      jest.spyOn(planetService, 'findOne').mockResolvedValue(oldPlanet);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(planetRepository, 'save').mockResolvedValue(updatedPlanet);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();

      const result: OperationResult = await planetService.update(
        1,
        updatePlanetDto,
      );

      expect(result).toEqual({ success: true });
      expect(planetRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedPlanet),
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
    it('should remove a planet and clean up images', async (): Promise<void> => {
      jest.spyOn(planetService, 'findOne').mockResolvedValue(mockPlanet);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();
      jest.spyOn(planetRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(planetRepository, 'remove').mockResolvedValue(undefined);

      const result: OperationResult = await planetService.remove(1);
      expect(result).toEqual({ success: true });
      expect(planetRepository.save).toHaveBeenCalledWith({
        ...mockPlanet,
        images: [],
      });
      expect(planetRepository.remove).toHaveBeenCalledWith(mockPlanet);
    });
  });
});
