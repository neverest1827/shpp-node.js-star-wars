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
} from '@nestjs/common';
import { ImageService } from './image.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('api/v1/image')
@ApiTags('Image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadImageDto,
  })
  async upload(
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
    return await this.imageService.upload(entityType, +entityId, files);
  }

  @Delete()
  remove(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ): string {
    return this.imageService.remove(entityType, +entityId);
  }
}
