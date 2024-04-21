import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
import { PostCategoriesService } from './PostCategories.service';
import { Request } from 'express';
import { CreatePostCategoryDto } from './dtos/create-post-category.dto';
import { CreatePostCategoryResponseDto } from './dtos/create-post-category-response.dto';
import { AuthGuardV2 } from 'src/commons/guards/auth.guard';
import { FetchPostCategoryDto } from './dtos/fetch-post-category.dto';

@ApiTags('카테고리 API')
@Controller('postcg')
export class PostCategoriesController {
  constructor(private readonly postCategoriesService: PostCategoriesService) {}

  @ApiOperation({
    summary: '카테고리 생성',
    description: '로그인된 유저와 연결된 카테고리를 생성한다.',
  })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: '카테고리 생성 완료',
    type: CreatePostCategoryResponseDto,
  })
  @UseGuards(AuthGuardV2)
  @Post()
  @HttpCode(201)
  async createPostCategory(
    @Req() req: Request,
    @Body() body: CreatePostCategoryDto,
  ): Promise<CreatePostCategoryResponseDto> {
    const kakaoId = req.user.userId;
    const name = body.name;
    return await this.postCategoriesService.create({ kakaoId, name });
  }

  @ApiOperation({
    summary: '특정 유저의 카테고리 정보 조회',
    description:
      '특정 유저가 생성한 카테고리의 이름과 id, 게시글 개수를 조회한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({
    description: '',
    type: [FetchPostCategoryDto],
  })
  @Get(':kakaoId')
  @HttpCode(200)
  async fetchPostCategories(
    @Req() req: Request,
    @Param('kakaoId') targetKakaoId: number,
  ): Promise<FetchPostCategoryDto[]> {
    const kakaoId = req.user.userId;
    return await this.postCategoriesService.fetchAll({
      kakaoId,
      targetKakaoId,
    });
  }

  @ApiOperation({
    summary: '유저의 지정 카테고리 삭제하기',
    description:
      '로그인된 유저의 카테고리 중 param:id와 일치하는 카테고리를 삭제한다',
  })
  @ApiCookieAuth()
  @Delete(':id')
  @UseGuards(AuthGuardV2)
  async deletePostCategory(@Req() req: Request, @Param('id') id: string) {
    const kakaoId = req.user.userId;
    return await this.postCategoriesService.delete({ kakaoId, id });
  }
}
