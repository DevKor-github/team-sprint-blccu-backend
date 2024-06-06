import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UtilsService } from 'src/utils/utils.service';
import { DataSource } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { Page } from '../../utils/pages/page';
import { FetchPostsDto } from './dtos/fetch-posts.dto';
import { PagePostResponseDto } from './dtos/page-post-response.dto';
import { FetchFriendsPostsDto } from './dtos/fetch-friends-posts.dto';
import { PostCategory } from '../postCategories/entities/postCategory.entity';
import { User } from '../users/entities/user.entity';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { StickerBlocksService } from '../stickerBlocks/stickerBlocks.service';
import { PostsRepository } from './posts.repository';
import { PostOnlyResponseDto, PostResponseDto } from './dtos/post-response.dto';
import {
  FetchPostForUpdateDto,
  PostResponseDtoExceptCategory,
} from './dtos/fetch-post-for-update.dto';
import { CustomCursorPageMetaDto } from 'src/utils/cursor-pages/dtos/cursor-page-meta.dto';
import { CustomCursorPageDto } from 'src/utils/cursor-pages/dtos/cursor-page.dto';
import { PostsOrderOption } from 'src/common/enums/posts-order-option';
import { FollowsService } from '../follows/follows.service';
import { DateOption } from 'src/common/enums/date-option';
import { Follow } from '../follows/entities/follow.entity';
import {
  IPostsServiceCreate,
  IPostsServiceCreateCursorResponse,
  IPostsServiceFetchFriendsPostsCursor,
  IPostsServiceFetchPostForUpdate,
  IPostsServiceFetchPostsCursor,
  IPostsServiceFetchUserPostsCursor,
  IPostsServicePatchPost,
  IPostsServicePostId,
  IPostsServicePostUserIdPair,
} from './interfaces/posts.service.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AwsService } from 'src/modules/aws/aws.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly stickerBlocksService: StickerBlocksService,
    private readonly postsRepository: PostsRepository,
    private readonly followsService: FollowsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async imageUpload(
    file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const image_url = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
      2000,
    );

    return { image_url };
  }
  async findPostsById({ id }: IPostsServicePostId) {
    return await this.postsRepository.findOne({ where: { id } });
  }

  async existCheck({ id }: IPostsServicePostId) {
    const data = await this.findPostsById({ id });
    if (!data) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    return data;
  }

  async fkValidCheck({ posts, passNonEssentail }) {
    const pc = await this.dataSource
      .getRepository(PostCategory)
      .createQueryBuilder('pc')
      .where('pc.id = :id', { id: posts.postCategoryId })
      .getOne();
    if (!pc && !passNonEssentail)
      throw new BadRequestException('존재하지 않는 post_category입니다.');
    // const pg = await this.dataSource
    //   .getRepository(PostBackground)
    //   .createQueryBuilder('pg')
    //   .where('pg.id = :id', { id: posts.postBackgroundId })
    //   .getOne();
    // if (!pg && !passNonEssentail)
    //   throw new BadRequestException('존재하지 않는 post_background입니다.');
    const us = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('us')
      .where('us.kakaoId = :id', { id: posts.userKakaoId })
      .getOne();
    if (!us) throw new BadRequestException('존재하지 않는 user입니다.');
  }

  async save(createPostDto: IPostsServiceCreate) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const post = {};
    try {
      Object.keys(createPostDto).map((el) => {
        const value = createPostDto[el];
        if (createPostDto[el] != null) {
          post[el] = value;
        }
      });
      await this.fkValidCheck({
        posts: post,
        passNonEssentail: !createPostDto.isPublished,
      });
      const data = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Posts, Object.keys(post))
        .values(post)
        .execute();
      await queryRunner.commitTransaction();
      const result = this.postsRepository.findOne({
        where: { id: data.identifiers[0].id },
      });
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async patchPost({
    kakaoId,
    id,
    ...rest
  }: IPostsServicePatchPost): Promise<PostOnlyResponseDto> {
    const postData = await this.existCheck({ id });
    if (postData.userKakaoId != kakaoId)
      throw new ForbiddenException('게시글 작성자가 아닙니다.');
    Object.keys(rest).forEach((value) => {
      if (rest[value] != null) postData[value] = rest[value];
    });
    await this.fkValidCheck({ posts: postData, passNonEssentail: false });
    return await this.postsRepository.save(postData);
  }

  async fetchPosts(page: FetchPostsDto): Promise<PagePostResponseDto> {
    const postsAndCounts = await this.postsRepository.fetchPosts(page);
    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchPostForUpdate({
    id,
    kakaoId,
  }: IPostsServiceFetchPostForUpdate): Promise<FetchPostForUpdateDto> {
    const data = await this.existCheck({ id });
    await this.fkValidCheck({ posts: data, passNonEssentail: true });
    if (data.userKakaoId !== kakaoId)
      throw new UnauthorizedException('본인이 아닙니다.');
    const post = await this.postsRepository.fetchPostForUpdate(id);
    const stickerBlocks = await this.stickerBlocksService.fetchBlocks({
      postsId: id,
    });
    return { post, stickerBlocks };
  }

  async fetchFriendsPosts({
    kakaoId,
    page,
  }: FetchFriendsPostsDto): Promise<PagePostResponseDto> {
    const subQuery = await this.dataSource
      .createQueryBuilder(Follow, 'n')
      .select('n.toUserKakaoId')
      .where(`n.fromUserKakaoId = ${kakaoId}`)
      .getQuery();
    const postsAndCounts = await this.postsRepository.fetchFriendsPosts(
      subQuery,
      page,
    );

    return new Page<Posts>(postsAndCounts[1], page.pageSize, postsAndCounts[0]);
  }

  async fetchTempPosts({ kakaoId }): Promise<PostResponseDtoExceptCategory[]> {
    return await this.postsRepository.fetchTempPosts(kakaoId);
  }

  async fetchDetail({
    kakaoId,
    id,
  }: IPostsServicePostUserIdPair): Promise<PostResponseDto> {
    const data = await this.existCheck({ id });
    await this.fkValidCheck({ posts: data, passNonEssentail: false });
    const scope = await this.followsService.getScope({
      from_user: data.userKakaoId,
      to_user: kakaoId,
    });
    // const comments = await this.commentsService.fetchComments({ postsId: id });
    const post = await this.postsRepository.fetchPostDetail({ id, scope });
    console.log(data, post);
    return post;
  }

  async softDelete({ kakaoId, id }: IPostsServicePostUserIdPair) {
    const data = await this.postsRepository.findOne({
      where: { user: { kakaoId }, id },
    });
    if (data) {
      await this.awsService.deleteImageFromS3({ url: data.image_url });
      await this.awsService.deleteImageFromS3({ url: data.main_image_url });
      await this.stickerBlocksService.deleteBlocks({ kakaoId, postsId: id });
    }
    return await this.postsRepository.softDelete({ user: { kakaoId }, id });
  }

  async hardDelete({ kakaoId, id }: IPostsServicePostUserIdPair) {
    const data = await this.postsRepository.findOne({
      where: { user: { kakaoId }, id },
    });
    if (data) {
      await this.awsService.deleteImageFromS3({ url: data.image_url });
      await this.awsService.deleteImageFromS3({ url: data.main_image_url });
      await this.stickerBlocksService.deleteBlocks({ kakaoId, postsId: id });
    }
    return await this.postsRepository.delete({ user: { kakaoId }, id });
  }

  //cursor
  async createCursorResponse({
    cursorOption,
    posts,
  }: IPostsServiceCreateCursorResponse): Promise<
    CustomCursorPageDto<PostResponseDto>
  > {
    const order = PostsOrderOption[cursorOption.order];
    let hasNextData: boolean = true;
    let customCursor: string;

    const takePerPage = cursorOption.take;
    const isLastPage = posts.length <= takePerPage;
    const responseData = posts.slice(0, takePerPage);
    const lastDataPerPage = responseData[responseData.length - 1];

    if (isLastPage) {
      hasNextData = false;
      customCursor = null;
    } else {
      customCursor = await this.createCustomCursor({
        post: lastDataPerPage,
        order,
      });
    }

    const customCursorPageMetaDto = new CustomCursorPageMetaDto({
      customCursorPageOptionsDto: cursorOption,
      hasNextData,
      customCursor,
    });

    return new CustomCursorPageDto(responseData, customCursorPageMetaDto);
  }

  async fetchPostsCursor({
    cursorOption,
  }: IPostsServiceFetchPostsCursor): Promise<
    CustomCursorPageDto<PostResponseDto>
  > {
    const cacheKey = `fetchPostsCursor_${JSON.stringify(cursorOption)}`;

    const cachedPosts =
      await this.cacheManager.get<CustomCursorPageDto<PostResponseDto>>(
        cacheKey,
      );
    if (cachedPosts) {
      return cachedPosts;
    }

    let date_filter: Date;
    if (cursorOption.date_created)
      date_filter = this.getDate(cursorOption.date_created);
    const { posts } = await this.postsRepository.fetchPostsCursor({
      cursorOption,
      date_filter,
    });
    const result = await this.createCursorResponse({ posts, cursorOption });
    await this.cacheManager.set(cacheKey, result, 180000);
    return result;
  }

  async fetchFriendsPostsCursor({
    cursorOption,
    kakaoId,
  }: IPostsServiceFetchFriendsPostsCursor): Promise<
    CustomCursorPageDto<PostResponseDto>
  > {
    let date_filter: Date;
    if (cursorOption.date_created)
      date_filter = this.getDate(cursorOption.date_created);
    const subQuery = await this.dataSource
      .createQueryBuilder(Follow, 'n')
      .select('n.toUserKakaoId')
      .where(`n.fromUserKakaoId = ${kakaoId}`)
      .getQuery();
    const { posts } = await this.postsRepository.fetchFriendsPostsCursor({
      cursorOption,
      subQuery,
      date_filter,
    });
    return await this.createCursorResponse({ posts, cursorOption });
  }

  async fetchUserPostsCursor({
    kakaoId,
    targetKakaoId,
    cursorOption,
  }: IPostsServiceFetchUserPostsCursor): Promise<
    CustomCursorPageDto<PostResponseDto>
  > {
    let date_filter: Date;
    if (cursorOption.date_created)
      date_filter = this.getDate(cursorOption.date_created);

    const scope = await this.followsService.getScope({
      from_user: targetKakaoId,
      to_user: kakaoId,
    });
    const { posts } = await this.postsRepository.fetchUserPosts({
      cursorOption,
      date_filter,
      scope,
      userKakaoId: targetKakaoId,
    });
    return await this.createCursorResponse({ posts, cursorOption });
  }

  async createCustomCursor({ post, order }): Promise<string> {
    const id = post.id;
    const _order = post[order];
    const customCursor: string =
      String(_order).padStart(7, '0') + String(id).padStart(7, '0');

    return customCursor;
  }

  createDefaultCursor(
    digitById: number,
    digitByTargetColumn: number,
    initialValue: string,
  ) {
    const defaultCustomCursor: string =
      String().padStart(digitByTargetColumn, `${initialValue}`) +
      String().padStart(digitById, `${initialValue}`);
    return defaultCustomCursor;
  }

  getDate(date_created: DateOption): Date {
    let currentDate = new Date();
    switch (date_created) {
      case DateOption.WEEK:
        currentDate.setDate(currentDate.getDate() - 7);
        break;
      case DateOption.MONTH:
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case DateOption.YEAR:
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        currentDate = null;
    }
    return currentDate;
  }
}
