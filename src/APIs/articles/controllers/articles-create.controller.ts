import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticlesCreateService } from '../services/articles-create.service';
import { ArticleCreateResponseDto } from '../dtos/response/article-create-response.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { ArticleCreateRequestDto } from '../dtos/request/article-create-request.dto';
import { ArticleCreateDraftRequestDto } from '../dtos/request/article-create-draft-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadRequestDto } from 'src/modules/images/dtos/image-upload-request.dto';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';

@ApiTags('게시글 API')
@Controller('articles')
export class ArticlesCreateController {
  constructor(private readonly svc_articlesCreate: ArticlesCreateService) {}

  @ApiOperation({
    summary: '게시글 등록',
    description: '게시글을 등록한다.',
  })
  @Post()
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: '등록 성공',
    type: ArticleCreateResponseDto,
  })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  async publishArticle(
    @Req() req: Request,
    @Body() body: ArticleCreateRequestDto,
  ) {
    const userId = req.user.userId;
    const dto = { ...body, userId, isPublished: true };
    return await this.svc_articlesCreate.save(dto);
  }

  @ApiOperation({
    summary: '게시글 임시등록',
    description: '게시글을 임시등록한다.',
  })
  @Post('temp')
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: '임시등록 성공',
    type: ArticleCreateResponseDto,
  })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  async updateArticle(
    @Req() req: Request,
    @Body() body: ArticleCreateDraftRequestDto,
  ) {
    const userId = req.user.userId;
    const dto = { ...body, userId, isPublished: false };
    return await this.svc_articlesCreate.save(dto);
  }

  @ApiOperation({
    summary: '이미지 업로드',
    description:
      '이미지를 서버에 업로드한다. url을 반환 받는다. 게시글 내부 이미지 업로드 및 캡처 이미지 업로드용. max_width=1280px',
  })
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
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createPrivateSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    return await this.svc_articlesCreate.imageUpload(file);
  }
}
