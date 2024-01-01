import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleEntity } from '../people/entities/people.entity';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ImageService {
  private uploadDirName: string = 'images';
  private entities = {
    people: this.peopleRepository,
  };
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @InjectRepository(PeopleEntity)
    private peopleRepository: Repository<PeopleEntity>,
  ) {}
  async upload(
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

  remove(entityType: string, entityId: number): string {
    return `This action removes a #${entityType}/${entityId} image`;
  }
}
