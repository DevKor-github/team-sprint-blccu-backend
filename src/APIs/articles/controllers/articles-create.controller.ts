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
import { ApiTags } from '@nestjs/swagger';
import { ArticlesCreateService } from '../services/articles-create.service';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { ArticleCreateRequestDto } from '../dtos/request/article-create-request.dto';
import { ArticleCreateDraftRequestDto } from '../dtos/request/article-create-draft-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { ArticlesCreateDocs } from '../docs/articles-create-docs.decorator';

@ArticlesCreateDocs
@ApiTags('게시글 API')
@Controller('articles')
export class ArticlesCreateController {
  constructor(private readonly svc_articlesCreate: ArticlesCreateService) {}

  @Post()
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

  @Post('temp')
  @UseGuards(AuthGuardV2)
  async createDraft(
    @Req() req: Request,
    @Body() body: ArticleCreateDraftRequestDto,
  ) {
    const userId = req.user.userId;
    const dto = { ...body, userId, isPublished: false };
    return await this.svc_articlesCreate.createDraft(dto);
  }

  @UseGuards(AuthGuardV2)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    return await this.svc_articlesCreate.imageUpload(file);
  }
}
