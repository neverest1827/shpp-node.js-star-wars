import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { People } from '../people/entities/people.entity';
import { Film } from '../film/entities/film.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Specie } from '../specie/entities/specie.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';

@Injectable()
export class ImageService {
  private uploadDirName: string = 'images';
  private repositories: Rep = {
    people: this.peopleRepository,
    film: this.filmRepository,
    planet: this.planetRepository,
    specie: this.specieRepository,
    starship: this.starshipRepository,
    vehicle: this.vehicleRepository,
  };
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Film)
    private readonly filmRepository: Repository<People>,
    @InjectRepository(Planet)
    private readonly planetRepository: Repository<People>,
    @InjectRepository(Specie)
    private readonly specieRepository: Repository<People>,
    @InjectRepository(Starship)
    private readonly starshipRepository: Repository<People>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<People>,
  ) {}
  async create(
    entityType: string,
    entityId: number,
    files: Express.Multer.File[],
  ): Promise<string> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No file uploaded');
    }

    let failed: string;

    try {
      await fs.access(this.uploadDirName);
    } catch (err) {
      await fs.mkdir(this.uploadDirName);
    }

    const uploadPath: string = path.join(
      __dirname,
      '..',
      '..',
      this.uploadDirName,
    );

    const repository = this.repositories[entityType];

    if (!repository) {
      throw new BadRequestException('Invalid entityType');
    }

    for (const file of files) {
      const imageName: string = `${uuidv4()}_${file.originalname}`;
      try {
        const entity = await repository.findOne({
          where: { id: entityId },
        });
        const filePath: string = path.join(uploadPath, imageName);
        await fs.access(uploadPath);
        await fs.writeFile(filePath, file.buffer);

        const publicPath: string = `/images/${imageName}`; // Создаем символическую ссылку для доступа к изображению
        const imageEntity: Image = this.imageRepository.create({
          filename: file.originalname,
          imagePath: publicPath,
          [entityType.toLowerCase()]: entity,
        });
        await this.imageRepository.save(imageEntity);
      } catch (err) {
        console.log(`Error saving file: ${err}`);
        failed += `Photo ${file.originalname} has not uploaded\n`;
      }
    }

    if (failed) return failed;
    return 'All photo upload';
  }

  async findAll(entityType: string, entityId: number): Promise<Image[]> {
    return await this.imageRepository.find({
      where: { [entityType.toLowerCase()]: entityId },
    });
  }

  async findOne(fineName: string): Promise<Image> {
    return await this.imageRepository.findOne({
      where: { filename: fineName },
    });
  }

  async remove(imageName: string): Promise<string> {
    try {
      const imageEntity: Image = await this.imageRepository.findOne({
        where: { filename: imageName },
      });

      if (!imageEntity) {
        throw new BadRequestException('Image not found');
      }

      const imagePath: string = path.join(
        __dirname,
        '..',
        '..',
        this.uploadDirName,
        imageName,
      );
      await fs.unlink(imagePath);
      await this.imageRepository.remove(imageEntity);
      return `Image ${imageName} removed successfully`;
    } catch (err) {
      console.log(`Error removing image: ${err}`);
      throw new BadRequestException('Failed to remove image');
    }
  }
}
