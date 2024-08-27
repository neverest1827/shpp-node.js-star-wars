import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Image } from '../image/entities/image.entity';
import { FormSchema, OperationResult } from '../common/types/types';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

describe('VehicleService', (): void => {
  const mockImage: Image = { id: 1, filename: 'image.jpg' } as Image;
  const mockVehicle: Vehicle = {
    id: 1,
    name: 'Millennium Falcon',
    images: [mockImage],
  } as Vehicle;

  let vehicleService: VehicleService;
  let vehicleRepository: Repository<Vehicle>;
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
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockRepository,
        },
        {
          provide: CommonService,
          useValue: {
            getPeople: jest.fn(),
            getFilms: jest.fn(),
            getImages: jest.fn(),
            createUrl: jest.fn(),
            cleanUpUnusedImages: jest.fn(),
          },
        },
      ],
    }).compile();

    vehicleService = module.get<VehicleService>(VehicleService);
    vehicleRepository = module.get<Repository<Vehicle>>(
      getRepositoryToken(Vehicle),
    );
    commonService = module.get<CommonService>(CommonService);
  });

  describe('create', (): void => {
    it('should create a new vehicle', async (): Promise<void> => {
      const createVehicleDto: CreateVehicleDto = {
        name: 'Speeder Bike',
        model: 'Speeder',
        manufacturer: 'Sienar Fleet Systems',
        cost_in_credits: 15000,
        length: 3.4,
        max_atmosphering_speed: 400,
        crew: 1,
        passengers: 1,
        cargo_capacity: 500,
        consumables: 'None',
        vehicle_class: 'Speeder',
        pilots: [1, 2],
        films: [1, 2],
        images: ['example.jpg'],
      };

      jest.spyOn(vehicleRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(vehicleRepository, 'save')
        .mockResolvedValue(createVehicleDto as any);
      jest.spyOn(commonService, 'getPeople').mockResolvedValue([]);
      jest.spyOn(commonService, 'getFilms').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(commonService, 'createUrl').mockReturnValue('url');

      const result: OperationResult =
        await vehicleService.create(createVehicleDto);

      expect(result).toEqual({ success: true });
      expect(vehicleRepository.save).toHaveBeenCalled();
    });
  });

  describe('getCatalogItems', (): void => {
    it('should retrieve paginated catalog items', async (): Promise<void> => {
      const vehicles: Vehicle[] = [mockVehicle];

      jest.spyOn(vehicleRepository, 'find').mockResolvedValue(vehicles);

      const result: Vehicle[] = await vehicleService.getCatalogItems(1, 10);

      expect(result).toEqual(vehicles);
      expect(vehicleRepository.find).toHaveBeenCalledWith({
        relations: ['images'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getNames', (): void => {
    it('should retrieve names of all vehicles', async (): Promise<void> => {
      const species: Vehicle[] = [mockVehicle];

      jest.spyOn(vehicleRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(species),
      } as any);

      const result: Vehicle[] = await vehicleService.getNames();

      expect(result).toEqual(species);
    });
  });

  describe('getFormSchema', (): void => {
    it('should return the form schema for vehicle creation or update', (): void => {
      const schema: FormSchema = vehicleService.getFormSchema();

      expect(schema).toEqual({
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
      });
    });
  });

  describe('findOne', (): void => {
    it('should return a vehicle by ID', async (): Promise<void> => {
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(mockVehicle);

      const result: Vehicle = await vehicleService.findOne(1, ['images']);

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.findOne).toHaveBeenCalledWith({
        relations: ['images'],
        where: { id: 1 },
      });
    });
  });

  describe('getEntityInfo', (): void => {
    it('should retrieve detailed info of a vehicle by id', async (): Promise<void> => {
      jest.spyOn(vehicleRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockVehicle),
      } as any);

      const result: Vehicle = await vehicleService.getEntityInfo(1);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('update', () => {
    it('should update a vehicle by ID', async () => {
      const oldVehicle: Vehicle = {
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
        vehicle_class: 'Old vehicle class',
        pilots: [],
        films: [],
        images: [{ id: 1, filename: 'old.jpg' }] as Image[],
      } as Vehicle;

      const updateStarshipDto: UpdateVehicleDto = {
        name: 'New Name',
      };

      const updatedVehicle: Vehicle = {
        ...updateStarshipDto,
        name: 'New Name',
        pilots: [],
        films: [],
        edited: expect.any(Date),
        images: [],
      } as Vehicle;

      jest.spyOn(vehicleService, 'findOne').mockResolvedValue(oldVehicle);
      jest.spyOn(commonService, 'getPeople').mockResolvedValue([]);
      jest.spyOn(commonService, 'getFilms').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(vehicleRepository, 'save').mockResolvedValue(updatedVehicle);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();

      const result: OperationResult = await vehicleService.update(
        1,
        updateStarshipDto,
      );

      expect(result).toEqual({ success: true });
      expect(vehicleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedVehicle),
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
    it('should remove a vehicle and clean up images', async (): Promise<void> => {
      jest.spyOn(vehicleService, 'findOne').mockResolvedValue(mockVehicle);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();
      jest.spyOn(vehicleRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(vehicleRepository, 'remove').mockResolvedValue(undefined);

      const result: OperationResult = await vehicleService.remove(1);
      expect(result).toEqual({ success: true });
      expect(vehicleRepository.save).toHaveBeenCalledWith({
        ...mockVehicle,
        images: [],
      });
      expect(vehicleRepository.remove).toHaveBeenCalledWith(mockVehicle);
    });
  });
});
