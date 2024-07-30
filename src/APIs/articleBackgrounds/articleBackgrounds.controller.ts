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
import { FileInterceptor } from '@nestjs/platform-express';

import { ImageUploadResponseDto } from 'src/modules/images/dtos/image-upload-response.dto';
import { ArticleBackgroundDto } from './dtos/common/articleBackground.dto';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { ArticleBackgroundsDocs } from './docs/articleBackgrounds-docs.decorator';

@ArticleBackgroundsDocs
@Controller()
export class ArticleBackgroundsController {
  constructor(
    private readonly articleBackgroundsService: ArticleBackgroundsService,
  ) {}

  @UseGuards(AuthGuardV2)
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

  @Get('articles/backgrounds')
  async getArticleBackgrounds(): Promise<ArticleBackgroundDto[]> {
    return await this.articleBackgroundsService.findArticleBackgrounds();
  }

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
