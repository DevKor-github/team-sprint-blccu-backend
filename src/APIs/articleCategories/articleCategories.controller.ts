import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { ArticleCategoriesService } from './articleCategories.service';
import { ArticleCategoriesResponseDto } from './dtos/response/articleCategories-response.dto';
import { ArticleCategoryDto } from './dtos/common/articleCategory.dto';
import { ArticleCategoryCreateRequestDto } from './dtos/request/articleCategory-create-request.dto';
import { ArticleCategoryPatchRequestDto } from './dtos/request/articleCategory-patch-request.dto';

@ApiTags('유저 API')
@Controller('users')
export class ArticleCategoriesController {
  constructor(
    private readonly svc_articleCategories: ArticleCategoriesService,
  ) {}

  @ApiOperation({
    summary: '특정 유저의 카테고리 전체 조회',
    description:
      '특정 유저가 생성한 카테고리의 이름과 id, 게시글 개수를 조회한다.',
  })
  @ApiOkResponse({
    type: [ArticleCategoriesResponseDto],
  })
  @Get(':userId/categories')
  @HttpCode(200)
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

  @ApiOperation({
    summary: '특정 카테고리 조회',
    description: 'id에 해당하는 카테고리를 조회한다.',
  })
  @ApiOkResponse({ type: ArticleCategoryDto })
  @Get('categories/:articleCategoryId')
  async fetchMyCategory(
    @Req() req: Request,
    @Param('articleCategoryId') articleCategoryId: number,
  ): Promise<ArticleCategoryDto> {
    return await this.svc_articleCategories.findArticleCategoryById({
      articleCategoryId,
    });
  }

  @ApiOperation({
    summary: '게시글 카테고리 생성',
    description: '로그인된 유저와 연결된 카테고리를 생성한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: '카테고리 생성 완료',
    type: ArticleCategoryDto,
  })
  @UseGuards(AuthGuardV2)
  @Post('me/categories')
  @HttpCode(201)
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

  @ApiOperation({ summary: '로그인된 유저의 특정 카테고리 수정' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: ArticleCategoryDto })
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

  @ApiOperation({
    summary: '유저의 지정 카테고리 삭제하기',
    description:
      '로그인된 유저의 카테고리 중 articleCategoryId 일치하는 카테고리를 삭제한다',
  })
  @ApiCookieAuth()
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
