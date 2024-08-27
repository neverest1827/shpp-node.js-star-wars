import { Test, TestingModule } from '@nestjs/testing';
import { SpecieService } from './specie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specie } from './entities/specie.entity';
import { CommonService } from '../common/common.service';
import { CreateSpecieDto } from './dto/create-specie.dto';
import { UpdateSpecieDto } from './dto/update-specie.dto';
import { Image } from '../image/entities/image.entity';
import { FormSchema, OperationResult } from '../common/types/types';

describe('SpecieService', (): void => {
  const mockImage: Image = { id: 1, filename: 'image.jpg' } as Image;
  const mockSpecie: Specie = {
    id: 1,
    name: 'Human',
    images: [mockImage],
  } as Specie;

  let specieService: SpecieService;
  let specieRepository: Repository<Specie>;
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
        SpecieService,
        {
          provide: getRepositoryToken(Specie),
          useValue: mockRepository,
        },
        {
          provide: CommonService,
          useValue: {
            getPlanets: jest.fn(),
            getPeople: jest.fn(),
            getFilms: jest.fn(),
            getImages: jest.fn(),
            createUrl: jest.fn(),
            cleanUpUnusedImages: jest.fn(),
          },
        },
      ],
    }).compile();

    specieService = module.get<SpecieService>(SpecieService);
    specieRepository = module.get<Repository<Specie>>(
      getRepositoryToken(Specie),
    );
    commonService = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(specieService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new specie', async () => {
      const createSpecieDto: CreateSpecieDto = {
        name: 'Human',
        classification: 'Mammal',
        designation: 'Sentient',
        average_height: 170,
        skin_colors: 'Fair, Brown, Black',
        hair_colors: 'Black, Brown, Blond',
        eye_colors: 'Brown, Blue, Green',
        average_lifespan: 80,
        language: 'Common',
        homeworld: [1],
        people: [1],
        films: [1],
        images: ['example.jpg'],
      };

      jest.spyOn(specieRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(specieRepository, 'save')
        .mockResolvedValue(createSpecieDto as any);
      jest.spyOn(commonService, 'getPlanets').mockResolvedValue([]);
      jest.spyOn(commonService, 'getPeople').mockResolvedValue([]);
      jest.spyOn(commonService, 'getFilms').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(commonService, 'createUrl').mockReturnValue('url');

      const result: OperationResult =
        await specieService.create(createSpecieDto);

      expect(result).toEqual({ success: true });
      expect(specieRepository.save).toHaveBeenCalled();
    });
  });

  describe('getCatalogItems', (): void => {
    it('should retrieve paginated catalog items', async (): Promise<void> => {
      const species: Specie[] = [mockSpecie];

      jest.spyOn(specieRepository, 'find').mockResolvedValue(species);

      const result: Specie[] = await specieService.getCatalogItems(1, 10);

      expect(result).toEqual(species);
      expect(specieRepository.find).toHaveBeenCalledWith({
        relations: ['images'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getNames', (): void => {
    it('should retrieve names of all species', async (): Promise<void> => {
      const species: Specie[] = [mockSpecie];

      jest.spyOn(specieRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(species),
      } as any);

      const result: Specie[] = await specieService.getNames();

      expect(result).toEqual(species);
    });
  });

  describe('getFormSchema', (): void => {
    it('should return form schema', (): void => {
      const result: FormSchema = specieService.getFormSchema();

      expect(result).toEqual({
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
      });
    });
  });

  describe('findOne', (): void => {
    it('should find a planet by id', async (): Promise<void> => {
      jest.spyOn(specieRepository, 'findOne').mockResolvedValue(mockSpecie);

      const result: Specie = await specieService.findOne(1, ['images']);

      expect(result).toEqual(mockSpecie);
      expect(specieRepository.findOne).toHaveBeenCalledWith({
        relations: ['images'],
        where: { id: 1 },
      });
    });
  });

  describe('getEntityInfo', (): void => {
    it('should retrieve detailed info of a specie by id', async (): Promise<void> => {
      jest.spyOn(specieRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSpecie),
      } as any);

      const result: Specie = await specieService.getEntityInfo(1);
      expect(result).toEqual(mockSpecie);
    });
  });

  describe('update', (): void => {
    it('should update specie details', async (): Promise<void> => {
      const oldPlanet: Specie = {
        id: 1,
        name: 'Old Name',
        classification: 'Old classification',
        designation: 'Old designation:',
        average_height: 80,
        skin_colors: 'Old skincolors',
        hair_colors: 'Old haircolors',
        eye_colors: 'Old eye_colors',
        average_lifespan: 56,
        homeworld: [],
        language: 'Old language',
        people: [],
        films: [],
        created: new Date(),
        edited: new Date(),
        url: 'old url',
        images: [{ id: 1, filename: 'old.jpg' }] as Image[],
      };

      const updatePlanetDto: UpdateSpecieDto = {
        name: 'New Name',
      };

      const updatedSpecie: Specie = {
        ...updatePlanetDto,
        name: 'New Name',
        homeworld: [],
        people: [],
        films: [],
        edited: expect.any(Date),
        images: [],
      } as Specie;

      jest.spyOn(specieService, 'findOne').mockResolvedValue(oldPlanet);
      jest.spyOn(commonService, 'getPlanets').mockResolvedValue([]);
      jest.spyOn(commonService, 'getPeople').mockResolvedValue([]);
      jest.spyOn(commonService, 'getFilms').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(specieRepository, 'save').mockResolvedValue(updatedSpecie);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();

      const result: OperationResult = await specieService.update(
        1,
        updatePlanetDto,
      );

      expect(result).toEqual({ success: true });
      expect(specieRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedSpecie),
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
      jest.spyOn(specieService, 'findOne').mockResolvedValue(mockSpecie);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();
      jest.spyOn(specieRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(specieRepository, 'remove').mockResolvedValue(undefined);

      const result: OperationResult = await specieService.remove(1);
      expect(result).toEqual({ success: true });
      expect(specieRepository.save).toHaveBeenCalledWith({
        ...mockSpecie,
        images: [],
      });
      expect(specieRepository.remove).toHaveBeenCalledWith(mockSpecie);
    });
  });
});
