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
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadRequestDto } from 'src/modules/images/dtos/image-upload-request.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { ArticleBackgroundDto } from './dtos/common/articleBackground.dto';

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
    type: ImageUploadRequestDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: ImageUploadResponseDto,
  })
  @Post('users/admin/articles/background')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createArticleBackground(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const url =
      await this.articleBackgroundsService.createArticleBackground(file);
    return url;
  }

  @ApiTags('게시글 API')
  @ApiOperation({ summary: '내지 모두 불러오기' })
  @ApiOkResponse({
    description: '모든 내지 fetch 완료',
    type: [ArticleBackgroundDto],
  })
  @Get('articles/backgrounds')
  async getArticleBackgrounds(): Promise<ArticleBackgroundDto[]> {
    return await this.articleBackgroundsService.findArticleBackgrounds();
  }

  @ApiTags('어드민 API')
  @ApiOperation({ summary: '내지 삭제하기' })
  @Delete('users/admin/articles/background/:articleBackgroundId')
  async delete(@Param('articleBackgroundId') articleBackgroundId: string) {
    return await this.articleBackgroundsService.deleteArticleBackground({
      articleBackgroundId,
    });
  }
}
