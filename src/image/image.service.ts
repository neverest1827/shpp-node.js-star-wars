import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from '../people/entities/people.entity';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  private uploadDirName: string = 'images';
  private entities = {
    people: this.peopleRepository,
  };
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
  ) {}
  async create(
    entityType: string,
    entityId: number,
    files: Array<Express.Multer.File>,
  ): Promise<string> {
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
    for (const file of files) {
      try {
        const entity = await this.entities[entityType].findOne(entityId);
        const filePath: string = path.join(uploadPath, file.originalname);
        await fs.access(uploadPath);
        await fs.writeFile(filePath, file.buffer);

        const publicPath: string = path.join(
          this.uploadDirName,
          file.originalname,
        );
        const imageEntity = this.imageRepository.create({
          image_path: publicPath,
        });
        imageEntity[entityType] = entity;
        await this.imageRepository.save(imageEntity);
      } catch (err) {
        console.log(`Error saving file: ${err}`);
        failed += `Photo ${file.originalname} has not upload\n`;
      }
    }
    if (failed) return failed;
    return 'All photo upload';
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(
    entityType: string,
    entityId: number,
    imageNumber: number,
    updateImageDto: UpdateImageDto,
  ) {
    return `This action updates a # image`;
  }

  remove(entityType: string, entityId: number, imageNumber: number): string {
    return `This action removes a #${entityType}/${entityId} image`;
  }
}
