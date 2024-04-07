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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { CreatePostCategoryResponseDto } from './dto/create-post-category-response.dto';
import { PostCategory } from './entities/postCategory.entity';

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
  @UseGuards(AuthGuard('jwt'))
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
    summary: '유저의 모든 카테고리 불러오기',
    description: '로그인된 유저가 생성한 카테고리를 모두 불러온다',
  })
  @ApiCookieAuth()
  @ApiOkResponse({
    description: '',
    type: [PostCategory],
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async fetchPostCategories(@Req() req: Request): Promise<PostCategory[]> {
    const kakaoId = req.user.userId;
    return await this.postCategoriesService.fetchAll({ kakaoId });
  }

  @ApiOperation({
    summary: '유저의 지정 카테고리 삭제하기',
    description:
      '로그인된 유저의 카테고리 중 param:id와 일치하는 카테고리를 삭제한다',
  })
  @ApiCookieAuth()
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletePostCategory(@Req() req: Request, @Param('id') id: string) {
    const kakaoId = req.user.userId;
    return await this.postCategoriesService.delete({ kakaoId, id });
  }
}
