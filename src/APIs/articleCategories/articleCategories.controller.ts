import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { ArticleCategoriesService } from './articleCategories.service';
import { ArticleCategoriesResponseDto } from './dtos/response/articleCategories-response.dto';
import { ArticleCategoryDto } from './dtos/common/articleCategory.dto';
import { ArticleCategoryCreateRequestDto } from './dtos/request/articleCategory-create-request.dto';
import { ArticleCategoryPatchRequestDto } from './dtos/request/articleCategory-patch-request.dto';
import { ArticleCategoriesDocs } from './docs/articleCategories-docs.decorator';

@ApiTags('유저 API')
@Controller('users')
@ArticleCategoriesDocs
export class ArticleCategoriesController {
  constructor(
    private readonly svc_articleCategories: ArticleCategoriesService,
  ) {}

  @Get(':userId/categories')
  async fetchArticleCategories(
    @Req() req: Request,
    @Param('userId') targetUserId: number,
  ): Promise<ArticleCategoriesResponseDto[]> {
    const userId = req.user.userId;
    return await this.svc_articleCategories.fetchAll({
      userId,
      targetUserId,
    });
  }

  @Get('categories/:articleCategoryId')
  async fetchMyCategory(
    @Req() req: Request,
    @Param('articleCategoryId') articleCategoryId: number,
  ): Promise<ArticleCategoryDto> {
    return await this.svc_articleCategories.findArticleCategoryById({
      articleCategoryId,
    });
  }

  @UseGuards(AuthGuardV2)
  @Post('me/categories')
  async createArticleCategory(
    @Req() req: Request,
    @Body() body: ArticleCategoryCreateRequestDto,
  ): Promise<ArticleCategoryDto> {
    const userId = req.user.userId;
    const name = body.name;
    return await this.svc_articleCategories.createArticleCategory({
      userId,
      name,
    });
  }

  @UseGuards(AuthGuardV2)
  @Patch('me/categories/:articleCategoryId')
  async patchArticleCategory(
    @Req() req: Request,
    @Param('articleCategoryId') articleCategoryId: number,
    @Body() body: ArticleCategoryPatchRequestDto,
  ): Promise<ArticleCategoryDto> {
    const userId = req.user.userId;
    return await this.svc_articleCategories.patchArticleCategory({
      userId,
      articleCategoryId,
      ...body,
    });
  }

  @Delete('me/categories/:articleCategoryId')
  @UseGuards(AuthGuardV2)
  async deleteArticleCategory(
    @Req() req: Request,
    @Param('articleCategoryId') articleCategoryId: number,
  ) {
    const userId = req.user.userId;
    return await this.svc_articleCategories.deleteArticleCategory({
      userId,
      articleCategoryId,
    });
  }
}
