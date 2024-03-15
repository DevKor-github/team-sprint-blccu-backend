import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostCategoriesService } from './PostCategories.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';

@ApiTags('카테고리 API')
@Controller('postcg')
export class PostCategoriesController {
  constructor(private readonly postCategoriesService: PostCategoriesService) {}

  @ApiOperation({
    summary: '카테고리 생성',
    description: '로그인된 유저와 연결된 카테고리를 생성한다.',
  })
  @ApiCookieAuth('refreshToken')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPostCategory(
    @Req() req: Request,
    @Body('name') name: CreatePostCategoryDto,
  ) {
    const kakaoId = req.user.userId;
    return await this.postCategoriesService.create({ kakaoId, name });
  }

  @ApiOperation({
    summary: '유저의 모든 카테고리 불러오기',
    description: '로그인된 유저가 생성한 카테고리를 모두 불러온다',
  })
  @ApiCookieAuth('refreshToken')
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async fetchPostCategories(@Req() req: Request) {
    const kakaoId = req.user.userId;
    return await this.postCategoriesService.fetchAll({ kakaoId });
  }

  @ApiOperation({
    summary: '유저의 지정 카테고리 삭제하기',
    description: '로그인된 유저의 id값과 일치하는 카테고리를 삭제한다',
  })
  @ApiCookieAuth('refreshToken')
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletePostCategory(@Req() req: Request, @Param('id') id: string) {
    const kakaoId = req.user.userId;
    return await this.postCategoriesService.delete({ kakaoId, id });
  }
}
