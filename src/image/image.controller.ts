import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  Get,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateImageDto } from './dto/create-image.dto';
import { Response } from 'express';
import { Roles } from '../role/role.decorator';
import { UserRole } from '../role/role.enum';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/v1/images')
@ApiBearerAuth('access-token')
@ApiTags('Image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateImageDto })
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<OperationResult> {
    return await this.imageService.create(file);
  }

  @Get(':entityType/:entityId')
  @Public()
  async findAll(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
  ): Promise<string[]> {
    return await this.imageService.findAll(entityType, entityId);
  }

  @Get(':imageName')
  @Public()
  async findOne(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ): Promise<Response> {
    const { buffer, contentType } = await this.imageService.findOne(imageName);
    res.setHeader('Content-Type', contentType);
    return res.send(buffer);
  }

  @Delete(':imageName')
  @Roles(UserRole.Admin)
  async remove(
    @Param('imageName') imageName: string,
  ): Promise<OperationResult> {
    return await this.imageService.remove(imageName);
  }
}
