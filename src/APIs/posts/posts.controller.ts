import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { Posts } from './entities/posts.entity';
import { CreatePostInput } from './dto/create-post.input';
import { FetchPostsDto } from './dto/fetch-posts.dto';
import { CreatePostResponseDto } from './dto/create-post-response.dto';

@ApiTags('게시글 API')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '게시글 등록',
    description:
      '게시글을 db에 등록한다.기본적으로 임시저장 상태이며 저장 api를 호출하면 발행된다',
  })
  @Post()
  @ApiCreatedResponse({ description: '생성 성공', type: CreatePostResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async createPost(@Req() req: Request): Promise<CreatePostResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.create({ kakaoId });
  }

  @ApiOperation({
    summary: '게시글 발행',
    description:
      '게시글을 발행한다. 빈 값을 매핑하고 조회 가능 상태로 변경한다.',
  })
  @Post('publish')
  @ApiCreatedResponse({ description: '발행 성공', type: Posts })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async publishPost(
    @Req() req: Request,
    @Body() body: CreatePostInput,
  ): Promise<Posts> {
    const kakaoId = req.user.userId;
    const dto = { ...body, user: kakaoId };
    return await this.postsService.publish(dto);
  }

  @ApiOperation({
    summary: '전체 게시글 조회 API',
    description:
      'Query를 통해 페이지네이션 가능. default) pageNo: 1, pageSize: 10',
  })
  @Get()
  fetchPosts(@Query() post: FetchPostsDto) {
    return this.postsService.fetchPosts(post);
  }
}
