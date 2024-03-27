import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { People } from '../people/entities/people.entity';
import { Film } from '../film/entities/film.entity';
import { Planet } from '../planet/entities/planet.entity';
import { Specie } from '../specie/entities/specie.entity';
import { Starship } from '../starship/entities/starship.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { NodeJsClient } from '@smithy/types';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class ImageService {
  private repositories: Rep = {
    people: this.peopleRepository,
    film: this.filmRepository,
    planet: this.planetRepository,
    specie: this.specieRepository,
    starship: this.starshipRepository,
    vehicle: this.vehicleRepository,
  };
  private s3Client: NodeJsClient<S3Client> =
    this.getS3Client() as NodeJsClient<S3Client>;
  constructor(
    private readonly configService: ConfigService,
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

        const imagePath: string = `images/${imageName}`;

        const uploadParams = {
          Bucket: this.configService.get<string>('BUCKET'),
          Key: imagePath,
          Body: file.buffer,
        };

        const command = new PutObjectCommand(uploadParams);
        const response = await this.s3Client.send(command);

        console.log('File uploaded successfully. ETag:', response.ETag);

        const imageEntity: Image = this.imageRepository.create({
          filename: file.originalname,
          imagePath: imagePath,
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
  getS3Client(): S3Client {
    const region: string = this.configService.get<string>('REGION');
    const credentials = {
      accessKeyId: this.configService.get<string>('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('SECRET_ACCESS_KEY'),
    };

    return new S3Client({ region, credentials });
  }

  async findAll(entityType: string, entityId: number): Promise<string[]> {
    const entity = entityType.toLowerCase();
    try {
      const images: Image[] = await this.imageRepository.find({
        where: { [entity]: { id: entityId } },
      });
      return images.map((images) => images.filename);
    } catch (err) {
      return [];
    }
  }

  async findOne(fineName: string): Promise<Buffer> {
    const image: Image = await this.imageRepository.findOne({
      where: { filename: fineName },
    });
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('BUCKET'),
      Key: image.imagePath,
    });
    const { Body } = await this.s3Client.send(command);
    const chunks: Uint8Array[] = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async remove(imageName: string): Promise<string> {
    try {
      const image: Image = await this.imageRepository.findOne({
        where: { filename: imageName },
      });

      if (!image) return `Image ${imageName} not found`;

      const command = new DeleteObjectCommand({
        Bucket: this.configService.get<string>('BUCKET'),
        Key: image.imagePath,
      });

      await this.s3Client.send(command);
      await this.imageRepository.remove(image);
      return `Image ${imageName} removed successfully`;
    } catch (err) {
      console.log(`Error removing image: ${err}`);
      return 'Failed to remove image';
    }
  }
}
