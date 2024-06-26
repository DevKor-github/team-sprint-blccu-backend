import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { FetchPostsDto } from './dtos/fetch-posts.dto';
import { PublishPostDto } from './dtos/publish-post.dto';
import { PagePostResponseDto } from './dtos/page-post-response.dto';
import { CreatePostInput } from './dtos/create-post.input';
import { PublishPostInput } from './dtos/publish-post.input';
import { ImageUploadDto } from 'src/common/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { FetchUserPostsInput } from './dtos/fetch-user-posts.input';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import { PostOnlyResponseDto, PostResponseDto } from './dtos/post-response.dto';
import {
  FetchPostForUpdateDto,
  PostResponseDtoExceptCategory,
} from './dtos/fetch-post-for-update.dto';
import { CustomCursorPageDto } from 'src/utils/cursor-pages/dtos/cursor-page.dto';
import { SortOption } from 'src/common/enums/sort-option';
import { CursorFetchPosts } from './dtos/cursor-fetch-posts.dto';
import { CursorPagePostResponseDto } from './dtos/cursor-page-post-response.dto';
import { PatchPostInput } from './dtos/patch-post.dto';

@ApiTags('게시글 API')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '게시글 등록',
    description: '게시글을 등록한다.',
  })
  @Post()
  @ApiCookieAuth()
  @ApiCreatedResponse({ description: '등록 성공', type: PublishPostDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  async publishPost(@Req() req: Request, @Body() body: PublishPostInput) {
    const kakaoId = req.user.userId;
    console.log(body);
    const dto = { ...body, userKakaoId: kakaoId, isPublished: true };
    return await this.postsService.save(dto);
  }

  @ApiOperation({
    summary: '게시글 논리 삭제',
    description: '로그인 된 유저의 postId에 해당하는 게시글을 논리삭제한다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Delete(':postId')
  async softDelete(@Req() req: Request, @Param('postId') id: number) {
    const kakaoId = req.user.userId;
    return await this.postsService.softDelete({ kakaoId, id });
  }

  @ApiOperation({
    summary: '게시글 임시등록',
    description: '게시글을 임시등록한다.',
  })
  @Post('temp')
  @ApiCookieAuth()
  @ApiCreatedResponse({ description: '임시등록 성공', type: PublishPostDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  async updatePost(@Req() req: Request, @Body() body: CreatePostInput) {
    const kakaoId = req.user.userId;
    const dto = { ...body, userKakaoId: kakaoId, isPublished: false };
    return await this.postsService.save(dto);
  }

  @ApiOperation({ summary: '게시글 patch' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: PostOnlyResponseDto })
  @UseGuards(AuthGuardV2)
  @Patch(':postId')
  @HttpCode(200)
  async patchPost(
    @Req() req: Request,
    @Body() body: PatchPostInput,
    @Param('postId') id: number,
  ): Promise<PostOnlyResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.patchPost({ ...body, id, kakaoId });
  }

  @ApiOperation({
    summary: '임시작성 게시글 조회',
    description: '로그인된 유저의 임시작성 게시글을 조회한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [PostResponseDtoExceptCategory] })
  @UseGuards(AuthGuardV2)
  @Get('temp')
  async fetchTempPosts(
    @Req() req: Request,
  ): Promise<PostResponseDtoExceptCategory[]> {
    const kakaoId = req.user.userId;
    console.log(kakaoId);
    return await this.postsService.fetchTempPosts({ kakaoId });
  }

  @ApiOperation({
    summary: '이미지 업로드',
    description:
      '이미지를 서버에 업로드한다. url을 반환 받는다. 게시글 내부 이미지 업로드 및 캡처 이미지 업로드용. max_width=1280px',
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
  @UseGuards(AuthGuardV2)
  @ApiCookieAuth()
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createPrivateSticker(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    return await this.postsService.imageUpload(file);
  }

  // @ApiOperation({
  //   summary: '게시글 hard delete',
  //   description:
  //     '로그인 된 유저의 {id}에 해당하는 게시글을 물리삭제한다. 임시 저장된 게시글에 사용을 권장',
  // })
  // @ApiCookieAuth()
  // @UseGuards(AuthGuardV2)
  // @Delete('hard/:id')
  // async hardDelete(@Req() req: Request, @Param('id') id: number) {
  //   const kakaoId = req.user.userId;
  //   return await this.postsService.hardDelete({ kakaoId, id });
  // }

  @ApiOperation({
    summary: '게시글 디테일 뷰 fetch',
    description:
      'id에 해당하는 게시글을 가져온다. 조회수를 올린다. 보호된 게시글은 권한이 있는 사용자만 접근 가능하다.',
  })
  @Get('detail/:postId')
  @ApiOkResponse({ type: PostResponseDto })
  async fetchPostDetail(
    @Param('postId') id: number,
    @Req() req: Request,
  ): Promise<PostResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchDetail({ kakaoId, id });
  }

  @ApiOperation({
    summary: '[수정용] 게시글 및 스티커 상세 데이터 fetch',
    description:
      '본인 게시글 수정용으로 id에 해당하는 게시글에 조인된 스티커 블록들의 값과 게시글 세부 데이터를 모두 가져온다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: FetchPostForUpdateDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  @Get('update/:postId')
  async fetchPost(
    @Req() req: Request,
    @Param('postId') id: number,
  ): Promise<FetchPostForUpdateDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchPostForUpdate({ id, kakaoId });
  }

  @ApiOperation({
    summary: '[offset]전체 게시글 조회 API',
    description:
      'Query를 통해 오프셋 페이지네이션 가능. default) pageNo: 1, pageSize: 10',
  })
  @ApiCreatedResponse({ description: '조회 성공', type: PagePostResponseDto })
  @HttpCode(200)
  @Get('offset')
  async fetchPosts(@Query() post: FetchPostsDto): Promise<PagePostResponseDto> {
    return await this.postsService.fetchPosts(post);
  }

  @ApiOperation({
    summary: '[offset]친구 게시글 조회',
    description:
      '친구의 게시글을 조회한다. Query를 통해 오프셋 페이지네이션 가능. default) pageNo: 1, pageSize: 10',
  })
  @ApiCreatedResponse({ description: '조회 성공', type: PagePostResponseDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  @ApiCookieAuth()
  @Get('offset/friends')
  async fetchFriendsPosts(
    @Query() page: FetchPostsDto,
    @Req() req: Request,
  ): Promise<PagePostResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchFriendsPosts({ kakaoId, page });
  }

  @ApiOperation({
    summary: '[cursor]전체 게시글 조회 API',
    description:
      '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다. PUBLIC 게시글만 조회한다.',
  })
  @Get('cursor')
  @ApiOkResponse({ type: CursorPagePostResponseDto })
  async fetchCursor(
    @Query() cursorOption: CursorFetchPosts,
  ): Promise<CustomCursorPageDto<PostResponseDto>> {
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '0');
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '9');
    }
    return this.postsService.fetchPostsCursor({ cursorOption });
  }

  @ApiOperation({
    summary: '[cursor]친구 게시글 조회 API',
    description:
      '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Get('cursor/friends')
  @ApiOkResponse({ type: CursorPagePostResponseDto })
  async fetchFriendsCursor(
    @Query() cursorOption: CursorFetchPosts,
    @Req() req: Request,
  ): Promise<CustomCursorPageDto<PostResponseDto>> {
    const kakaoId = req.user.userId;
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '0');
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '9');
    }
    return this.postsService.fetchFriendsPostsCursor({ cursorOption, kakaoId });
  }

  @ApiOperation({
    summary: '[cursor]특정 유저의 게시글 조회',
    description:
      '로그인 된 유저의 경우 private/protected 게시글 조회 권한 체크 후 조회. 카테고리 이름으로 필터링 가능',
  })
  @Get('/cursor/user/:userId')
  @ApiOkResponse({ type: CursorPagePostResponseDto })
  async fetchUserPosts(
    @Param('userId') targetKakaoId: number,
    @Req() req: Request,
    @Query() cursorOption: FetchUserPostsInput,
  ): Promise<CursorPagePostResponseDto> {
    const kakaoId = req.user.userId;
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '0');
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '9');
    }
    return await this.postsService.fetchUserPostsCursor({
      kakaoId,
      targetKakaoId,
      cursorOption,
    });
  }
}
