import { Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CommonService } from '../common/common.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    private readonly commonService: CommonService,
  ) {}
  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    const id: number = (await this.filmRepository.count()) + 1;
    const new_film: Film = await this.filmRepository.create({
      id: id,
      title: createFilmDto.title,
      episode_id: createFilmDto.episode_id,
      opening_crawl: createFilmDto.opening_crawl,
      director: createFilmDto.director,
      producer: createFilmDto.producer,
      release_date: createFilmDto.release_date,
      characters: [],
      planets: [],
      starships: [],
      vehicles: [],
      species: [],
      created: createFilmDto.created,
      edited: createFilmDto.edited,
      url: this.commonService.createUrl(id, 'films'),
      images: [],
    });
    return this.filmRepository.save(new_film);
  }

  async findAll(): Promise<Film[]> {
    return await this.filmRepository.find();
  }

  async findOne(id: number): Promise<Film> {
    return await this.filmRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updateFilmDto: UpdateFilmDto,
  ): Promise<UpdateResult> {
    const filmToUpdate: Film = await this.findOne(id);

    if (!filmToUpdate) return null;

    Object.assign(filmToUpdate, updateFilmDto);

    return await this.filmRepository.update(id, filmToUpdate);
  }

  async remove(id: number): Promise<DeleteResult> {
    const filmToUpdate: Film = await this.findOne(id);

    if (!filmToUpdate) return null;

    return await this.filmRepository.delete(id);
  }
}
