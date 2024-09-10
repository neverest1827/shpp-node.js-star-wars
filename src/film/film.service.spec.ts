import { Test, TestingModule } from '@nestjs/testing';
import { FilmService } from './film.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { CommonService } from '../common/common.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Image } from '../image/entities/image.entity';
import { Person } from '../person/entities/person.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Specie } from '../specie/entities/specie.entity';

describe('FilmService', () => {
  const mockImage: Image = { id: 1, filename: 'image.jpg' } as Image;
  const mockFilm: Film = {
    id: 1,
    title: 'A New Hope',
    images: [mockImage],
  } as Film;

  let filmService: FilmService;
  let filmRepository: Repository<Film>;
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
        FilmService,
        {
          provide: getRepositoryToken(Film),
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

    filmService = module.get<FilmService>(FilmService);
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film));
    commonService = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(filmService).toBeDefined();
  });

  describe('create', (): void => {
    it('should create and save a film', async (): Promise<void> => {
      const dto: CreateFilmDto = {
        title: 'A New Hope',
        episode_id: 1,
        opening_crawl: 'It is a period of civil war...',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        release_date: '1977-05-25',
        characters: [1],
        planets: [1],
        starships: [1],
        vehicles: [1],
        species: [1],
        images: ['image.jpg'],
      };

      jest.spyOn(filmRepository, 'count').mockResolvedValue(1);
      jest.spyOn(filmRepository, 'save').mockResolvedValue(dto as any);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(commonService, 'createUrl').mockReturnValue('url');

      const result: OperationResult = await filmService.create(dto);

      expect(result).toEqual({ success: true });
      expect(filmRepository.save).toHaveBeenCalled();
    });
  });

  describe('getCatalogItems', () => {
    it('should retrieve paginated catalog items', async () => {
      const films: Film[] = [mockFilm] as Film[];
      jest.spyOn(filmRepository, 'find').mockResolvedValue(films);

      const result: Film[] = await filmService.getCatalogItems(1, 10);

      expect(result).toEqual(films);
      expect(filmRepository.find).toHaveBeenCalledWith({
        relations: ['images'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getNames', (): void => {
    it('should retrieve film names', async (): Promise<void> => {
      const films: Film[] = [mockFilm];
      jest.spyOn(filmRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(films),
      } as any);

      const result: Film[] = await filmService.getNames();

      expect(result).toEqual(films);
    });
  });

  describe('getFormSchema', (): void => {
    it('should return form schema', (): void => {
      const result: FormSchema = filmService.getFormSchema();

      expect(result).toEqual({
        title: '',
        episode_id: '',
        opening_crawl: '',
        director: '',
        producer: '',
        release_date: '',
        characters: 'people',
        planets: 'planets',
        starships: 'starships',
        vehicles: 'vehicles',
        species: 'species',
      });
    });
  });

  describe('findOne', (): void => {
    it('should find a film by ID with relations', async (): Promise<void> => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(mockFilm);

      const result: Film = await filmService.findOne(1, ['images']);

      expect(result).toEqual(mockFilm);
      expect(filmRepository.findOne).toHaveBeenCalledWith({
        relations: ['images'],
        where: { id: 1 },
      });
    });
  });

  describe('getEntityInfo', (): void => {
    it('should retrieve detailed film information', async (): Promise<void> => {
      jest.spyOn(filmRepository, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockFilm),
      } as any);

      const result: Film = await filmService.getEntityInfo(1);

      expect(result).toEqual(mockFilm);
    });
  });

  describe('update', (): void => {
    it('should update a film and clean up unused images', async (): Promise<void> => {
      const oldFilm: Film = {
        id: 1,
        title: 'Old Title',
        episode_id: 1,
        opening_crawl: 'Old Crawl',
        director: 'Old Director',
        producer: 'Old Producer',
        release_date: '1977-05-25',
        characters: [{ id: 1, name: 'Old Character' }] as Person[],
        planets: [{ id: 1, name: 'Old Planet' }] as Planet[],
        starships: [{ id: 1, name: 'Old Starship' }] as Starship[],
        vehicles: [{ id: 1, name: 'Old Vehicle' }] as Vehicle[],
        species: [{ id: 1, name: 'Old Specie' }] as Specie[],
        images: [{ id: 1, filename: 'old.jpg' }] as Image[],
        created: new Date(),
        edited: new Date(),
        url: 'http://example.com/old',
      } as Film;

      const dto: UpdateFilmDto = { title: 'Updated Title' };

      const updatedFilm: Film = {
        ...oldFilm,
        title: 'Updated Title',
        edited: expect.any(Date),
        images: [],
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
      } as Film;

      jest.spyOn(filmService, 'findOne').mockResolvedValue(oldFilm);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getEntitiesByIds').mockResolvedValue([]);
      jest.spyOn(commonService, 'getImages').mockResolvedValue([]);
      jest.spyOn(filmRepository, 'save').mockResolvedValue(updatedFilm);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();

      const result: OperationResult = await filmService.update(1, dto);

      expect(result).toEqual({ success: true });
      expect(filmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedFilm),
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
    it('should remove a film and clean up images', async (): Promise<void> => {
      jest.spyOn(filmService, 'findOne').mockResolvedValue(mockFilm);
      jest.spyOn(commonService, 'cleanUpUnusedImages').mockResolvedValue();
      jest.spyOn(filmRepository, 'save').mockResolvedValue(mockFilm);
      jest.spyOn(filmRepository, 'remove').mockResolvedValue(mockFilm);

      const result: OperationResult = await filmService.remove(1);

      expect(result).toEqual({ success: true });
      expect(filmRepository.save).toHaveBeenCalledWith({
        ...mockFilm,
        images: [],
      });
      expect(filmRepository.remove).toHaveBeenCalledWith(mockFilm);
    });
  });
});
