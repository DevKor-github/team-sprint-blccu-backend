import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleBackgroundsService } from './articleBackgrounds.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ImageUploadDto } from '../../common/dto/image-upload.dto';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { ArticleBackground } from './entities/articleBackground.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('')
export class ArticleBackgroundsController {
  constructor(
    private readonly articleBackgroundsService: ArticleBackgroundsService,
  ) {}

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '내지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: ImageUploadResponseDto,
  })
  @Post('users/admin/article/background')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const url = await this.articleBackgroundsService.imageUpload(file);
    return url;
  }

  @ApiTags('게시글 API')
  @ApiOperation({ summary: '내지 모두 불러오기' })
  @ApiOkResponse({
    description: '모든 내지 fetch 완료',
    type: [ArticleBackground],
  })
  @Get('article/backgrounds')
  async fetchAll(): Promise<ArticleBackground[]> {
    return await this.articleBackgroundsService.fetchAll();
  }

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '내지 삭제하기' })
  @Delete('users/admin/article/background/:id')
  async delete(@Param('id') id: string) {
    return await this.articleBackgroundsService.delete({ id });
  }
}
