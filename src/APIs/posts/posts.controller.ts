import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { FetchPostsDto } from './dto/fetch-posts.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { Posts } from './entities/posts.entity';
import { PagePostResponseDto } from './dto/page-post-response.dto';
import { CreatePostInput } from './dto/create-post.input';
import { PublishPostInput } from './dto/publish-post.input';
import { ImageUploadDto } from 'src/commons/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadResponseDto } from 'src/commons/dto/image-upload-response.dto';

@ApiTags('게시글 API')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '게시글 임시등록',
    description: `게시글을 임시등록한다.
    id를 입력하지 않으면 생성하고 있는 아이디를 치면 update하는 로직으로 
    바로 게시글 생성에 사용해도 되고, 수정용으로 사용해도 된다.`,
  })
  @Post('temp')
  @ApiCreatedResponse({ description: '임시등록 성공', type: PublishPostDto })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async updatePost(@Req() req: Request, @Body() body: CreatePostInput) {
    const kakaoId = req.user.userId;
    const dto = { ...body, userKakaoId: kakaoId, isPublished: false };
    return await this.postsService.save(dto);
  }

  @ApiOperation({
    summary: '게시글 등록',
    description: `게시글을 등록한다.
    id를 입력하지 않으면 생성하고 있는 아이디를 치면 update하는 로직으로 
    바로 게시글 생성에 사용해도 되고, 수정용으로 사용해도 된다.`,
  })
  @Post()
  @ApiCreatedResponse({ description: '등록 성공', type: PublishPostDto })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async publishPost(@Req() req: Request, @Body() body: PublishPostInput) {
    const kakaoId = req.user.userId;
    const dto = { ...body, userKakaoId: kakaoId, isPublished: true };
    return await this.postsService.save(dto);
  }
  @ApiOperation({
    summary: '전체 게시글 조회 API',
    description:
      'Query를 통해 페이지네이션 가능. default) pageNo: 1, pageSize: 10',
  })
  @ApiCreatedResponse({ description: '조회 성공', type: PagePostResponseDto })
  @HttpCode(200)
  @Get()
  async fetchPosts(@Query() post: FetchPostsDto): Promise<PagePostResponseDto> {
    return await this.postsService.fetchPosts(post);
  }

  @ApiOperation({
    summary: '[수정용] 게시글 및 스티커 상세 데이터 fetch',
    description:
      '본인 게시글 수정용으로 id에 해당하는 게시글에 조인된 스티커 블록들의 값과 게시글 세부 데이터를 모두 가져온다.',
  })
  @HttpCode(200)
  @Get(':id')
  async fetchPost(@Param('id') id: number) {
    return await this.postsService.fetchPostForUpdate({ id });
  }

  @ApiOperation({
    summary: '이미지 업로드',
    description: '이미지를 서버에 업로드한다. url을 반환 받는다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드 할 파일',
    type: ImageUploadDto,
  })
  @ApiCreatedResponse({
    description: '이미지 서버에 파일 업로드 완료',
    type: ImageUploadResponseDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('refreshToken')
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createPrivateSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    return await this.postsService.saveImage(file);
  }
  @ApiOperation({
    summary: '친구 게시글 조회',
    description:
      '친구의 게시글을 조회한다. Query를 통해 페이지네이션 가능. default) pageNo: 1, pageSize: 10',
  })
  @ApiCreatedResponse({ description: '조회 성공', type: PagePostResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @ApiCookieAuth('refreshToken')
  @Get('friends')
  async fetchFriendsPosts(
    @Query() page: FetchPostsDto,
    @Req() req: Request,
  ): Promise<PagePostResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchFriendsPosts({ kakaoId, page });
  }

  @ApiOperation({
    summary: '임시작성 게시글 조회',
    description: '로그인된 유저의 임시작성 게시글을 조회한다.',
  })
  @ApiCookieAuth('refeshToken')
  @UseGuards(AuthGuard('jwt'))
  @Get('temp')
  async fetchTempPosts(@Req() req: Request): Promise<Posts[]> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchTempPosts({ kakaoId });
  }

  @ApiOperation({
    summary: '게시글 soft delete',
    description:
      '로그인 된 유저의 {id}에 해당하는 게시글을 논리삭제한다. 발행된 게시글에 사용을 권장',
  })
  @ApiCookieAuth('refreshToken')
  @UseGuards(AuthGuard('jwt'))
  @Delete('soft/:id')
  async softDelete(@Req() req: Request, @Param('id') id: number) {
    const kakaoId = req.user.userId;
    return await this.postsService.softDelete({ kakaoId, id });
  }

  @ApiOperation({
    summary: '게시글 hard delete',
    description:
      '로그인 된 유저의 {id}에 해당하는 게시글을 물리삭제한다. 임시 저장된 게시글에 사용을 권장',
  })
  @ApiCookieAuth('refreshToken')
  @UseGuards(AuthGuard('jwt'))
  @Delete('hard/:id')
  async hardDelete(@Req() req: Request, @Param('id') id: number) {
    const kakaoId = req.user.userId;
    return await this.postsService.hardDelete({ kakaoId, id });
  }
}
