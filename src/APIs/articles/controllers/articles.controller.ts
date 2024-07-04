import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Article,
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
import { ArticlesService } from '../articles.service';
import { FetchArticlesDto } from '../dtos/fetch-posts.dto';
import { PublishArticleDto } from '../dtos/publish-post.dto';
import { PageArticleResponseDto } from '../dtos/page-post-response.dto';
import { CreateArticleInput } from '../dtos/create-post.input';
import { PublishArticleInput } from '../dtos/publish-post.input';
import { ImageUploadDto } from 'src/common/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { FetchUserArticlesInput } from '../dtos/fetch-user-posts.input';
import { AuthGuardV2 } from 'src/common/guards/auth.guard';
import {
  ArticleOnlyResponseDto,
  ArticleResponseDto,
} from '../dtos/post-response.dto';
import {
  FetchArticleForUpdateDto,
  ArticleResponseDtoExceptCategory,
} from '../dtos/fetch-post-for-update.dto';
import { CustomCursorPageDto } from 'src/utils/cursor-pages/dtos/cursor-page.dto';
import { SortOption } from 'src/common/enums/sort-option';
import { CursorFetchArticles } from '../dtos/cursor-fetch-posts.dto';
import { CursorPageArticleResponseDto } from '../dtos/cursor-page-post-response.dto';
import { PatchArticleInput } from '../dtos/patch-post.dto';
import { DeleteArticleInput } from '../dtos/delete-post.dto';

@ApiTags('게시글 API')
@Controller('posts')
export class ArticlesController {
  constructor(private readonly postsService: ArticlesService) {}

  @ApiOperation({
    summary: '게시글 등록',
    description: '게시글을 등록한다.',
  })
  @Article()
  @ApiCookieAuth()
  @ApiCreatedResponse({ description: '등록 성공', type: PublishArticleDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  async publishArticle(@Req() req: Request, @Body() body: PublishArticleInput) {
    const kakaoId = req.user.userId;
    console.log(body);
    const dto = { ...body, userKakaoId: kakaoId, isPublished: true };
    return await this.postsService.save(dto);
  }

  @ApiOperation({
    summary: '게시글 삭제',
    description:
      '로그인 된 유저의 postId에 해당하는 게시글을 삭제한다. isHardDelete(nullable)을 통해 삭제 방식 결정',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Delete(':postId')
  async softDelete(
    @Req() req: Request,
    @Param('postId') id: number,
    @Body() body: DeleteArticleInput,
  ) {
    const kakaoId = req.user.userId;
    if (body.isHardDelete === true) {
      return await this.postsService.hardDelete({ kakaoId, id });
    }
    return await this.postsService.softDelete({ kakaoId, id });
  }

  @ApiOperation({
    summary: '게시글 임시등록',
    description: '게시글을 임시등록한다.',
  })
  @Article('temp')
  @ApiCookieAuth()
  @ApiCreatedResponse({ description: '임시등록 성공', type: PublishArticleDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(201)
  async updateArticle(@Req() req: Request, @Body() body: CreateArticleInput) {
    const kakaoId = req.user.userId;
    const dto = { ...body, userKakaoId: kakaoId, isPublished: false };
    return await this.postsService.save(dto);
  }

  @ApiOperation({ summary: '게시글 patch' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: ArticleOnlyResponseDto })
  @UseGuards(AuthGuardV2)
  @Patch(':postId')
  @HttpCode(200)
  async patchArticle(
    @Req() req: Request,
    @Body() body: PatchArticleInput,
    @Param('postId') id: number,
  ): Promise<ArticleOnlyResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.patchArticle({ ...body, id, kakaoId });
  }

  @ApiOperation({
    summary: '임시작성 게시글 조회',
    description: '로그인된 유저의 임시작성 게시글을 조회한다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: [ArticleResponseDtoExceptCategory] })
  @UseGuards(AuthGuardV2)
  @Get('temp')
  async fetchTempArticles(
    @Req() req: Request,
  ): Promise<ArticleResponseDtoExceptCategory[]> {
    const kakaoId = req.user.userId;
    console.log(kakaoId);
    return await this.postsService.fetchTempArticles({ kakaoId });
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
  @Article('image')
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
  @ApiOkResponse({ type: ArticleResponseDto })
  async fetchArticleDetail(
    @Param('postId') id: number,
    @Req() req: Request,
  ): Promise<ArticleResponseDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchDetail({ kakaoId, id });
  }

  @ApiOperation({
    summary: '[수정용] 게시글 및 스티커 상세 데이터 fetch',
    description:
      '본인 게시글 수정용으로 id에 해당하는 게시글에 조인된 스티커 블록들의 값과 게시글 세부 데이터를 모두 가져온다.',
  })
  @ApiCookieAuth()
  @ApiOkResponse({ type: FetchArticleForUpdateDto })
  @UseGuards(AuthGuardV2)
  @HttpCode(200)
  @Get('update/:postId')
  async fetchArticle(
    @Req() req: Request,
    @Param('postId') id: number,
  ): Promise<FetchArticleForUpdateDto> {
    const kakaoId = req.user.userId;
    return await this.postsService.fetchArticleForUpdate({ id, kakaoId });
  }

  @ApiOperation({
    summary: '[cursor]전체 게시글 조회 API',
    description:
      '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다. PUBLIC 게시글만 조회한다.',
  })
  @Get('cursor')
  @ApiOkResponse({ type: CursorPageArticleResponseDto })
  async fetchCursor(
    @Query() cursorOption: CursorFetchArticles,
  ): Promise<CustomCursorPageDto<ArticleResponseDto>> {
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '0');
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '9');
    }
    return this.postsService.fetchArticlesCursor({ cursorOption });
  }

  @ApiOperation({
    summary: '[cursor]친구 게시글 조회 API',
    description:
      '커서 기반으로 게시글을 조회한다. 최초 조회 시 커서 값을 비워서 요청한다. 쿼리 옵션을 변경할 경우 기존의 커서 값을 쓸 수 없다.',
  })
  @ApiCookieAuth()
  @UseGuards(AuthGuardV2)
  @Get('cursor/friends')
  @ApiOkResponse({ type: CursorPageArticleResponseDto })
  async fetchFriendsCursor(
    @Query() cursorOption: CursorFetchArticles,
    @Req() req: Request,
  ): Promise<CustomCursorPageDto<ArticleResponseDto>> {
    const kakaoId = req.user.userId;
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '0');
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '9');
    }
    return this.postsService.fetchFriendsArticlesCursor({
      cursorOption,
      kakaoId,
    });
  }

  @ApiOperation({
    summary: '[cursor]특정 유저의 게시글 조회',
    description:
      '로그인 된 유저의 경우 private/protected 게시글 조회 권한 체크 후 조회. 카테고리 이름으로 필터링 가능',
  })
  @Get('/cursor/user/:userId')
  @ApiOkResponse({ type: CursorPageArticleResponseDto })
  async fetchUserArticles(
    @Param('userId') targetKakaoId: number,
    @Req() req: Request,
    @Query() cursorOption: FetchUserArticlesInput,
  ): Promise<CursorPageArticleResponseDto> {
    const kakaoId = req.user.userId;
    if (!cursorOption.cursor && cursorOption.sort === SortOption.ASC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '0');
    } else if (!cursorOption.cursor && cursorOption.sort === SortOption.DESC) {
      cursorOption.cursor = this.postsService.createDefaultCursor(7, 7, '9');
    }
    return await this.postsService.fetchUserArticlesCursor({
      kakaoId,
      targetKakaoId,
      cursorOption,
    });
  }
}
