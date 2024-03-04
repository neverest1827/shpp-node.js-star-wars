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
  Body,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('api/v1/image')
@ApiTags('Image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
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
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch()
  update(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Param('imgNumber') imageNumber: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imageService.update(
      entityType,
      +entityId,
      +imageNumber,
      updateImageDto,
    );
  }

  @Delete()
  remove(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Param('imgNumber') imageNumber: string,
  ): string {
    return this.imageService.remove(entityType, +entityId, +imageNumber);
  }
}
