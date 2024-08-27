import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';

@Injectable()
export class ImageService {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {
    this.s3Client = this.getS3Client();
  }

  /**
   * Uploads an image to S3 and saves the image metadata in the repository.
   *
   * @param {Express.Multer.File} file - The image file to be uploaded.
   * @returns {Promise<OperationResult>} The result of the operation, including the name of the uploaded file.
   * @throws {Error} If the image upload to S3 fails.
   */
  async create(file: Express.Multer.File): Promise<OperationResult> {
    this.validateFile(file);

    const bucketName: string = this.configService.get<string>('BUCKET');
    const newFileName: string = `${uuidv4()}_${file.originalname}`;
    const imageKey: string = `images/${newFileName}`;

    const uploadParams: UploadParams = {
      Bucket: bucketName,
      Key: imageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command: PutObjectCommand = new PutObjectCommand(uploadParams);
    const response: PutObjectCommandOutput = await this.s3Client.send(command);

    if (!response.ETag)
      throw new Error(
        `Image upload to S3 failed. No ETag returned. Response: ${JSON.stringify(
          response,
        )}`,
      );

    const imageEntity: Image = this.imageRepository.create({
      filename: newFileName,
      url: `https://${bucketName}.s3.amazonaws.com/${imageKey}`,
    });
    await this.imageRepository.save(imageEntity);

    return {
      success: true,
      name: newFileName,
    };
  }

  /**
   * Creates and returns a configured instance of the S3 client.
   *
   * @returns {S3Client} The configured S3 client instance.
   */
  getS3Client(): S3Client {
    const region: string = this.configService.get<string>('REGION');
    const credentials: Credentials = {
      accessKeyId: this.configService.get<string>('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('SECRET_ACCESS_KEY'),
    };

    return new S3Client({ region, credentials });
  }

  /**
   * Finds all image filenames associated with a given entity type and entity ID.
   *
   * @param {string} entityType - The type of the entity (e.g., 'person', 'planet').
   * @param {number} id - The ID of the entity to search for.
   * @returns {Promise<string[]>} A promise that resolves to an array of filenames associated with the specified entity.
   * @throws {Error} If the entity type is invalid or if an error occurs during the database query.
   */
  async findAll(entityType: string, id: number): Promise<string[]> {
    const entity: string = entityType.toLowerCase();
    const images: Image[] = await this.imageRepository.find({
      where: { [entity]: { id: id } },
    });
    return images.map((images) => images.filename);
  }

  /**
   * Retrieves an image by its filename and returns it as a Buffer.
   *
   * @param {string} fineName - The filename of the image to retrieve.
   * @returns {Promise<Buffer>} A promise that resolves to the image data as a Buffer.
   * @throws {NotFoundException} If the image is not found in the repository or if the file stream is not found in S3.
   */
  async findOne(
    fineName: string,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    const image: Image = await this.imageRepository.findOne({
      where: { filename: fineName },
    });

    if (!image) {
      throw new NotFoundException(`Image with filename ${fineName} not found`);
    }

    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: this.configService.get<string>('BUCKET'),
      Key: `images/${fineName}`,
    });

    const { Body, ContentType } = await this.s3Client.send(command);

    if (!Body) {
      throw new NotFoundException(`File stream for ${fineName} not found`);
    }

    const buffer: Buffer = await streamToBuffer(Body as any);

    return { buffer, contentType: ContentType };
  }

  /**
   * Removes an image by its filename from both the S3 bucket and the image repository.
   *
   * @param {string} imageName - The filename of the image to remove.
   * @returns {Promise<OperationResult>} A promise that resolves to an object indicating the success of the operation.
   * @throws {NotFoundException} If the image is not found in the repository.
   */
  async remove(imageName: string): Promise<OperationResult> {
    const image: Image = await this.imageRepository.findOne({
      where: { filename: imageName },
    });

    if (!image) throw new NotFoundException(`Image ${imageName} not found`);

    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('BUCKET'),
      Key: `images/${imageName}`,
    });

    await this.s3Client.send(command);
    await this.imageRepository.remove(image);
    return { success: true };
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('File must be provided');
    }

    const allowedMimeTypes: string[] = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'File must be a valid image type (jpeg, png)',
      );
    }

    const maxSize: number = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }
  }
}
