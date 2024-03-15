import { Controller, Post, UploadedFile } from '@nestjs/common';
import { PostBackgroundsService } from './postBackgrounds.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageUploadDto } from './dto/image-upload.dto';

@ApiTags('내지 API')
@Controller('postbg')
export class PostBackgroundsController {
  constructor(
    private readonly postBackgroundsService: PostBackgroundsService,
  ) {}

  @ApiOperation({ summary: '내지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadDto,
  })
  @Post('upload')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.postBackgroundsService.imageUpload(file);
    return url;
  }
}
