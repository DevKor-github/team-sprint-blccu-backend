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
import {
  FetchArticleCategoriesResponse,
  FetchArticleCategoryResponse,
} from './dtos/fetch-articleCategory.dto';
import {
  CreateArticleCategoryInput,
  CreateArticleCategoryResponse,
} from './dtos/create-articleCategory.dto';
import { ArticleCategoriesService } from './articleCategories.service';
import { PatchArticleCategoryInput } from './dtos/patch-articleCategory.dto';

@ApiTags('유저 API')
@Controller('users')
export class ArticleCategoriesController {
  constructor(
    private readonly articleCategoriesService: ArticleCategoriesService,
  ) {}

  @ApiOperation({
    summary: '특정 유저의 카테고리 전체 조회',
    description:
      '특정 유저가 생성한 카테고리의 이름과 id, 게시글 개수를 조회한다.',
  })
  @ApiOkResponse({
    type: [FetchArticleCategoriesResponse],
  })
  @Get(':userId/categories')
  @HttpCode(200)
  async fetchArticleCategories(
    @Req() req: Request,
    @Param('userId') targetKakaoId: number,
  ): Promise<FetchArticleCategoriesResponse[]> {
    const kakaoId = req.user.userId;
    return await this.articleCategoriesService.fetchAll({
      kakaoId,
      targetKakaoId,
    });
  }

  @ApiOperation({
    summary: '특정 카테고리 조회',
    description: 'id에 해당하는 카테고리를 조회한다.',
  })
  @ApiOkResponse({ type: FetchArticleCategoryResponse })
  @Get('categories/:categoryId')
  async fetchMyCategory(
    @Req() req: Request,
    @Param('categoryId') id: string,
  ): Promise<FetchArticleCategoryResponse> {
    return await this.articleCategoriesService.findWithId({ id });
  }

  @ApiOperation({
    summary: '게시글 카테고리 생성',
    description: '로그인된 유저와 연결된 카테고리를 생성한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: '카테고리 생성 완료',
    type: CreateArticleCategoryResponse,
  })
  @UseGuards(AuthGuardV2)
  @Post('me/categories')
  @HttpCode(201)
  async createArticleCategory(
    @Req() req: Request,
    @Body() body: CreateArticleCategoryInput,
  ): Promise<CreateArticleCategoryResponse> {
    const kakaoId = req.user.userId;
    const name = body.name;
    return await this.articleCategoriesService.create({ kakaoId, name });
  }

  @ApiOperation({ summary: '로그인된 유저의 특정 카테고리 수정' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: FetchArticleCategoryResponse })
  @UseGuards(AuthGuardV2)
  @Patch('me/categories/:categoryId')
  async patchArticleCategory(
    @Req() req: Request,
    @Param('categoryId') id: string,
    @Body() body: PatchArticleCategoryInput,
  ): Promise<FetchArticleCategoryResponse> {
    const kakaoId = req.user.userId;
    return await this.articleCategoriesService.patch({
      kakaoId,
      id,
      ...body,
    });
  }

  @ApiOperation({
    summary: '유저의 지정 카테고리 삭제하기',
    description:
      '로그인된 유저의 카테고리 중 categoryId 일치하는 카테고리를 삭제한다',
  })
  @ApiCookieAuth()
  @Delete('me/categories/:categoryId')
  @UseGuards(AuthGuardV2)
  async deleteArticleCategory(
    @Req() req: Request,
    @Param('categoryId') id: string,
  ) {
    const kakaoId = req.user.userId;
    return await this.articleCategoriesService.delete({ kakaoId, id });
  }
}
