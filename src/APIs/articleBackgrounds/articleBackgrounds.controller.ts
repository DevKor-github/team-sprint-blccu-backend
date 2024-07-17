import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleBackgroundsService } from './articleBackgrounds.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadRequestDto } from 'src/modules/images/dtos/image-upload-request.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { ArticleBackgroundDto } from './dtos/common/articleBackground.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';

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
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Post('users/admin/article/background')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createArticleBackground(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const userId = req.user.userId;
    const url = await this.articleBackgroundsService.createArticleBackground(
      userId,
      file,
    );
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

  @ApiCookieAuth()
  @ApiTags('어드민 API')
  @ApiOperation({ summary: '내지 삭제하기' })
  @UseGuards(AuthGuardV2)
  @Delete('users/admin/articles/background/:articleBackgroundId')
  async delete(
    @Req() req: Request,
    @Param('articleBackgroundId') articleBackgroundId: string,
  ) {
    const userId = req.user.userId;

    return await this.articleBackgroundsService.deleteArticleBackground({
      userId,
      articleBackgroundId,
    });
  }
}
