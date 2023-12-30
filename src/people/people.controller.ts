import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseFilePipe,
  UploadedFiles,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesUploadDto } from './dto/files-upload.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post('api/v1/')
  create(@Body() createPersonDto: CreatePeopleDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get('api/v1/')
  findAll() {
    return this.peopleService.findAll();
  }

  @Get('api/v1/:id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }

  @Patch('api/v1/:id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePeopleDto) {
    return this.peopleService.update(+id, updatePersonDto);
  }

  @Delete('api/v1/:id')
  remove(@Param('id') id: string) {
    return this.peopleService.remove(+id);
  }

  @Post('api/v1/upload')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
  })
  uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1048576 }), //1Mb
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ): void {
    return this.peopleService.uploadImages(files);
  }
}
