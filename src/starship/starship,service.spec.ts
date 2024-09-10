import { Test, TestingModule } from '@nestjs/testing';
import { StarshipService } from './starship.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { Image } from '../image/entities/image.entity';

describe('StarshipService', (): void => {
  const mockImage: Image = { id: 1, filename: 'image.jpg' } as Image;
  const mockStarship: Starship = {
    id: 1,
    name: 'Millennium Falcon',
    images: [mockImage],
  } as Starship;

  let starshipService: StarshipService;
  let starshipRepository: Repository<Starship>;
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
        StarshipService,
        {
          provide: getRepositoryToken(Starship),
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

    starshipService = module.get<StarshipService>(StarshipService);
    starshipRepository = module.get<Repository<Starship>>(
      getRepositoryToken(Starship),
    );
    commonService = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(starshipService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new starship', async () => {
      const createStarshipDto: CreateStarshipDto = {
        name: 'Millennium Falcon',
        model: 'YT-1300 light freighter',
        manufacturer: 'Corellian Engineering Corporation',
        cost_in_credits: 100000,
        length: 34.75,
        max_atmosphering_speed: 1050,
        crew: 4,
        passengers: 6,
        cargo_capacity: 100000,
        consumables: '2 months',
        hyperdrive_rating: 0.5,
        MGLT: 75,
        starship_class: 'Light freighter',
        pilots: [1],
        films: [1],
        images: ['example.jpg'],
      };

      jest.spyOn(starshipRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(starshipRepository, 'save')
        .mockResolvedValue(createStarshipDto as any);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(commonService, 'createUrl').mockReturnValue('url');
      jest.spyOn(commonService, 'getId').mockResolvedValue(1);

      const result: OperationResult =
        await starshipService.create(createStarshipDto);

      expect(result).toEqual({ success: true });
      expect(starshipRepository.save).toHaveBeenCalled();
    });
  });

  describe('getCatalogItems', (): void => {
    it('should retrieve paginated catalog items', async (): Promise<void> => {
      const species: Starship[] = [mockStarship];

      jest.spyOn(starshipRepository, 'find').mockResolvedValue(species);

      const result: Starship[] = await starshipService.getCatalogItems(1, 10);

      expect(result).toEqual(species);
      expect(starshipRepository.find).toHaveBeenCalledWith({
        relations: ['images'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getNames', (): void => {
    it('should retrieve names of all starships', async (): Promise<void> => {
      const species: Starship[] = [mockStarship];

      jest.spyOn(starshipRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(species),
      } as any);

      const result: Starship[] = await starshipService.getNames();

      expect(result).toEqual(species);
    });
  });

  describe('getFormSchema', (): void => {
    it('should return the form schema for starships', (): void => {
      const result: FormSchema = starshipService.getFormSchema();

      expect(result).toEqual({
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
      });
    });
  });

  describe('findOne', (): void => {
    it('should return a starship by ID', async (): Promise<void> => {
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(mockStarship);

      const result: Starship = await starshipService.findOne(1, ['images']);

      expect(result).toEqual(mockStarship);
      expect(starshipRepository.findOne).toHaveBeenCalledWith({
        relations: ['images'],
        where: { id: 1 },
      });
    });
  });

  describe('getEntityInfo', (): void => {
    it('should retrieve detailed info of a starship by id', async (): Promise<void> => {
      jest.spyOn(starshipRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockStarship),
      } as any);

      const result: Starship = await starshipService.getEntityInfo(1);
      expect(result).toEqual(mockStarship);
    });
  });

  describe('update', () => {
    it('should update a starship by ID', async () => {
      const oldStarship: Starship = {
        name: 'Old name',
        model: 'Old model',
        manufacturer: 'Old manufacturer',
        cost_in_credits: 100000,
        length: 34.75,
        max_atmosphering_speed: 1050,
        crew: 4,
        passengers: 6,
        cargo_capacity: 100000,
        consumables: 'Old consumables',
        hyperdrive_rating: 0.5,
        MGLT: 75,
        starship_class: 'Old starship class',
        pilots: [],
        films: [],
        images: [{ id: 1, filename: 'old.jpg' }] as Image[],
      } as Starship;

      const updateStarshipDto: UpdateStarshipDto = {
        name: 'New Name',
      };

      const updatedStarship: Starship = {
        ...updateStarshipDto,
        name: 'New Name',
        pilots: [],
        films: [],
        edited: expect.any(Date),
        images: [],
      } as Starship;

      jest.spyOn(starshipService, 'findOne').mockResolvedValue(oldStarship);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(starshipRepository, 'save').mockResolvedValue(updatedStarship);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();

      const result: OperationResult = await starshipService.update(
        1,
        updateStarshipDto,
      );

      expect(result).toEqual({ success: true });
      expect(starshipRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedStarship),
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
    it('should remove a starship and clean up images', async (): Promise<void> => {
      jest.spyOn(starshipService, 'findOne').mockResolvedValue(mockStarship);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();
      jest.spyOn(starshipRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(starshipRepository, 'remove').mockResolvedValue(undefined);

      const result: OperationResult = await starshipService.remove(1);
      expect(result).toEqual({ success: true });
      expect(starshipRepository.save).toHaveBeenCalledWith({
        ...mockStarship,
        images: [],
      });
      expect(starshipRepository.remove).toHaveBeenCalledWith(mockStarship);
    });
  });
});
