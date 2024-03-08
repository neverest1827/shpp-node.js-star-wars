import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  Patch,
  Body, Res
} from "@nestjs/common";
import { ImageService } from './image.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './entities/image.entity';
import { Response } from "express";

@Controller('api/v1/image')
@ApiTags('Image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post(':entityType/:entityId')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateImageDto,
  })
  async create(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1048576 }), //1Mb
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<string> {
    return await this.imageService.create(entityType, +entityId, files);
  }

  @Get()
  findAll(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
  ): Promise<Image[]> {
    return this.imageService.findAll(entityType, entityId);
  }

  @Get(':imageName')
  async findOne(@Param('imageName') imageName: string, @Res() res: Response) {
    const image: Image = await this.imageService.findOne(imageName);
    return res.sendFile(image.imagePath);
  }

  @Delete(':imageName')
  async remove(@Param('imageName') imageName: string): Promise<string> {
    return await this.imageService.remove(imageName);
  }
}
