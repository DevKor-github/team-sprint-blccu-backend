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
import { User } from '../users/entities/user.entity';
import { ImageUploadResponseDto } from 'src/common/dto/image-upload-response.dto';
import { StickerBlocksService } from '../stickerBlocks/stickerBlocks.service';
import { ArticlesRepository } from './repositories/articles.repository';
import { CustomCursorPageMetaDto } from 'src/utils/cursor-pages/dtos/cursor-page-meta.dto';
import { CustomCursorPageDto } from 'src/utils/cursor-pages/dtos/cursor-page.dto';
import { FollowsService } from '../follows/follows.service';
import { DateOption } from 'src/common/enums/date-option';
import { Follow } from '../follows/entities/follow.entity';
import {
  IArticlesServiceCreate,
  IArticlesServiceCreateCursorResponse,
  IArticlesServiceFetchFriendsArticlesCursor,
  IArticlesServiceFetchArticleForUpdate,
  IArticlesServiceFetchArticlesCursor,
  IArticlesServiceFetchUserArticlesCursor,
  IArticlesServicePatchArticle,
  IArticlesServiceArticleId,
  IArticlesServiceArticleUserIdPair,
} from './interfaces/articles.service.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AwsService } from 'src/modules/aws/aws.service';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UtilsService,
    private readonly dataSource: DataSource,
    private readonly stickerBlocksService: StickerBlocksService,
    private readonly articlesRepository: ArticlesRepository,
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
      1280,
    );

    return { image_url };
  }
  async findArticlesById({ id }: IArticlesServiceArticleId) {
    return await this.articlesRepository.findOne({ where: { id } });
  }

  async existCheck({ id }: IArticlesServiceArticleId) {
    const data = await this.findArticlesById({ id });
    if (!data) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    return data;
  }

  async fkValidCheck({ articles, passNonEssentail }) {
    const pc = await this.dataSource
      .getRepository(ArticleCategory)
      .createQueryBuilder('pc')
      .where('pc.id = :id', { id: articles.articleCategoryId })
      .getOne();
    if (!pc && !passNonEssentail)
      throw new BadRequestException('존재하지 않는 article_category입니다.');
    const pg = await this.dataSource
      .getRepository(ArticleBackground)
      .createQueryBuilder('pg')
      .where('pg.id = :id', { id: articles.articleBackgroundId })
      .getOne();
    if (!pg && articles.articleBackgroundId && !passNonEssentail)
      throw new BadRequestException('존재하지 않는 article_background입니다.');
    const us = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('us')
      .where('us.kakaoId = :id', { id: articles.userKakaoId })
      .getOne();
    if (!us) throw new BadRequestException('존재하지 않는 user입니다.');
  }

  async save(
    createArticleDto: IArticlesServiceCreate,
  ): Promise<PublishArticleDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const article = {};
    try {
      Object.keys(createArticleDto).map((el) => {
        const value = createArticleDto[el];
        if (createArticleDto[el] != null) {
          article[el] = value;
        }
      });
      await this.fkValidCheck({
        articles: article,
        passNonEssentail: !createArticleDto.isPublished,
      });
      const data = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Articles, Object.keys(article))
        .values(article)
        .execute();
      await queryRunner.commitTransaction();
      const articleData = await this.articlesRepository.findOne({
        where: { id: data.identifiers[0].id },
      });
      const stickerBlockData = await this.stickerBlocksService.bulkInsert({
        articlesId: articleData.id,
        kakaoId: createArticleDto.userKakaoId,
        stickerBlocks: createArticleDto.stickerBlocks,
      });
      return { articleData, stickerBlockData };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async patchArticle({
    kakaoId,
    id,
    ...rest
  }: IArticlesServicePatchArticle): Promise<ArticleOnlyResponseDto> {
    const articleData = await this.existCheck({ id });
    if (articleData.userKakaoId != kakaoId)
      throw new ForbiddenException('게시글 작성자가 아닙니다.');
    Object.keys(rest).forEach((value) => {
      if (rest[value] != null) articleData[value] = rest[value];
    });
    await this.fkValidCheck({ articles: articleData, passNonEssentail: false });
    return await this.articlesRepository.save(articleData);
  }

  async fetchArticleForUpdate({
    id,
    kakaoId,
  }: IArticlesServiceFetchArticleForUpdate): Promise<FetchArticleForUpdateDto> {
    const data = await this.existCheck({ id });
    await this.fkValidCheck({ articles: data, passNonEssentail: true });
    if (data.userKakaoId !== kakaoId)
      throw new UnauthorizedException('본인이 아닙니다.');
    const article = await this.articlesRepository.fetchArticleForUpdate(id);
    const stickerBlocks = await this.stickerBlocksService.fetchBlocks({
      articlesId: id,
    });
    return { article, stickerBlocks };
  }

  async fetchTempArticles({
    kakaoId,
  }): Promise<ArticleResponseDtoExceptCategory[]> {
    return await this.articlesRepository.fetchTempArticles(kakaoId);
  }

  async fetchDetail({
    kakaoId,
    id,
  }: IArticlesServiceArticleUserIdPair): Promise<ArticleResponseDto> {
    const data = await this.existCheck({ id });
    await this.fkValidCheck({ articles: data, passNonEssentail: false });
    const scope = await this.followsService.getScope({
      from_user: data.userKakaoId,
      to_user: kakaoId,
    });
    // const comments = await this.commentsService.fetchComments({ articlesId: id });
    const article = await this.articlesRepository.fetchArticleDetail({
      id,
      scope,
    });
    console.log(data, article);
    return article;
  }

  async softDelete({ kakaoId, id }: IArticlesServiceArticleUserIdPair) {
    const data = await this.articlesRepository.findOne({
      where: { user: { kakaoId }, id },
    });
    if (data) {
      await this.awsService.deleteImageFromS3({ url: data.image_url });
      await this.awsService.deleteImageFromS3({ url: data.main_image_url });
      await this.stickerBlocksService.deleteBlocks({ kakaoId, articlesId: id });
    }
    return await this.articlesRepository.softDelete({ user: { kakaoId }, id });
  }

  async hardDelete({ kakaoId, id }: IArticlesServiceArticleUserIdPair) {
    const data = await this.articlesRepository.findOne({
      where: { user: { kakaoId }, id },
    });
    if (data) {
      await this.awsService.deleteImageFromS3({ url: data.image_url });
      await this.awsService.deleteImageFromS3({ url: data.main_image_url });
      await this.stickerBlocksService.deleteBlocks({ kakaoId, articlesId: id });
    }
    return await this.articlesRepository.delete({ user: { kakaoId }, id });
  }

  //cursor
  async createCursorResponse({
    cursorOption,
    articles,
  }: IArticlesServiceCreateCursorResponse): Promise<
    CustomCursorPageDto<ArticleResponseDto>
  > {
    const order = ArticlesOrderOption[cursorOption.order];
    let hasNextData: boolean = true;
    let customCursor: string;

    const takePerPage = cursorOption.take;
    const isLastPage = articles.length <= takePerPage;
    const responseData = articles.slice(0, takePerPage);
    const lastDataPerPage = responseData[responseData.length - 1];

    if (isLastPage) {
      hasNextData = false;
      customCursor = null;
    } else {
      customCursor = await this.createCustomCursor({
        article: lastDataPerPage,
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

  async fetchArticlesCursor({
    cursorOption,
  }: IArticlesServiceFetchArticlesCursor): Promise<
    CustomCursorPageDto<ArticleResponseDto>
  > {
    const cacheKey = `fetchArticlesCursor_${JSON.stringify(cursorOption)}`;

    const cachedArticles =
      await this.cacheManager.get<CustomCursorPageDto<ArticleResponseDto>>(
        cacheKey,
      );
    if (cachedArticles) {
      return cachedArticles;
    }

    let date_filter: Date;
    if (cursorOption.date_created)
      date_filter = this.getDate(cursorOption.date_created);
    const { articles } = await this.articlesRepository.fetchArticlesCursor({
      cursorOption,
      date_filter,
    });
    const result = await this.createCursorResponse({ articles, cursorOption });
    await this.cacheManager.set(cacheKey, result, 180000);
    return result;
  }

  async fetchFriendsArticlesCursor({
    cursorOption,
    kakaoId,
  }: IArticlesServiceFetchFriendsArticlesCursor): Promise<
    CustomCursorPageDto<ArticleResponseDto>
  > {
    let date_filter: Date;
    if (cursorOption.date_created)
      date_filter = this.getDate(cursorOption.date_created);

    const { articles } =
      await this.articlesRepository.fetchFriendsArticlesCursor({
        cursorOption,
        kakaoId,
        date_filter,
      });
    return await this.createCursorResponse({ articles, cursorOption });
  }

  async fetchUserArticlesCursor({
    kakaoId,
    targetKakaoId,
    cursorOption,
  }: IArticlesServiceFetchUserArticlesCursor): Promise<
    CustomCursorPageDto<ArticleResponseDto>
  > {
    let date_filter: Date;
    if (cursorOption.date_created)
      date_filter = this.getDate(cursorOption.date_created);

    const scope = await this.followsService.getScope({
      from_user: targetKakaoId,
      to_user: kakaoId,
    });
    const { articles } = await this.articlesRepository.fetchUserArticles({
      cursorOption,
      date_filter,
      scope,
      userKakaoId: targetKakaoId,
    });
    return await this.createCursorResponse({ articles, cursorOption });
  }

  async createCustomCursor({ article, order }): Promise<string> {
    const id = article.id;
    const _order = article[order];
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
