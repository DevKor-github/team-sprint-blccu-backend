import { Brackets, DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import { PostResponseDto } from './dtos/article-response.dto';
import { PostResponseDtoExceptCategory } from './dtos/fetch-article-for-update.dto';
import { ArticlesOrderOption } from 'src/common/enums/articles-order-option';
import { ArticlesFilterOption } from 'src/common/enums/articles-filter-option';
import { SortOption } from 'src/common/enums/sort-option';
import {
  IArticlesRepoFetchFriendsArticlesCursor,
  IArticlesRepoFetchArticlesCursor,
  IArticlesRepoFetchUserArticlesCursor,
  IArticlesRepoGetCursorQuery,
} from '../interfaces/articles.repository.interface';
import { Follow } from '../../follows/entities/follow.entity';
@Injectable()
export class ArticlesRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }

  async fetchPostForUpdate(id) {
    return await this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'articleBackground')
      .leftJoinAndSelect('p.articleCategory', 'articleCategory')
      .addSelect([
        'user.handle',
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.id = :id', { id })
      .andWhere('p.date_deleted IS NULL')
      .getOne();
  }

  async fetchFriendsArticles(subQuery, page) {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'articleBackground')
      .leftJoinAndSelect('p.articleCategory', 'articleCategory')
      .addSelect([
        'user.handle',
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where(`p.userKakaoId = any(${subQuery})`)
      .andWhere('p.date_deleted IS NULL')
      .andWhere('p.scope IN (:...scopes)', {
        scopes: [OpenScope.PUBLIC],
      }) //sql injection 방지를 위해 만드시 enum 거칠 것
      .andWhere(`${ArticlesFilterOption[page.filter]} LIKE :search`, {
        search: `%${page.search}%`,
      })
      .orderBy(`p.${ArticlesOrderOption[page.order]}`, 'DESC')
      .andWhere('p.isPublished = true')
      .orderBy('p.id', 'DESC')
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();
  }

  async fetchTempArticles(
    kakaoId: number,
  ): Promise<PostResponseDtoExceptCategory[]> {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'articleBackground')
      .leftJoinAndSelect('p.articleCategory', 'articleCategory')
      .addSelect([
        'user.handle',
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.userKakaoId = :kakaoId', { kakaoId })
      .andWhere(`p.isPublished = false`)
      .andWhere('p.date_deleted IS NULL')
      .orderBy('p.id', 'DESC')
      .getMany();
  }

  getCursorQuery({ order, sort, take, cursor }: IArticlesRepoGetCursorQuery) {
    const _order = ArticlesOrderOption[order];

    const queryBuilder = this.createQueryBuilder('p');
    const queryByOrderSort =
      sort === SortOption.ASC
        ? `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) > :customCursor`
        : `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) < :customCursor`;

    queryBuilder
      .take(take + 1)
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.articleBackground', 'articleBackground')
      .leftJoinAndSelect('p.articleCategory', 'articleCategory')
      .addSelect([
        'user.handle',
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.isPublished = true')
      .andWhere(queryByOrderSort, {
        customCursor: cursor,
      })
      .andWhere('p.date_deleted IS NULL')
      .orderBy(`p.${_order}`, sort as any)
      .addOrderBy('p.id', sort as any);

    return queryBuilder;
  }

  async fetchArticlesCursor({
    cursorOption,
    date_filter,
  }: IArticlesRepoFetchArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    queryBuilder.andWhere('p.scope IN (:...scopes)', {
      scopes: [OpenScope.PUBLIC],
    });

    if (date_filter) {
      queryBuilder.andWhere('p.date_created > :date_filter', {
        date_filter: date_filter,
      });
    }

    const articles: Article[] = await queryBuilder.getMany();

    return { articles };
  }

  async fetchFriendsArticlesCursor({
    cursorOption,
    kakaoId,
    date_filter,
  }: IArticlesRepoFetchFriendsArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    // const subQuery = await this.dataSource
    //   .createQueryBuilder(Follow, 'n')
    //   .select('n.toUserKakaoId')
    //   .where('n.fromUserKakaoId = :kakaoId', { kakaoId })
    //   .getQuery();

    const mutualFollows = await this.dataSource
      .createQueryBuilder(Follow, 'f1')
      .select('f1.fromUserKakaoId', 'user1')
      .addSelect('f1.toUserKakaoId', 'user2')
      .innerJoin(
        Follow,
        'f2',
        'f1.fromUserKakaoId = f2.toUserKakaoId AND f1.toUserKakaoId = f2.fromUserKakaoId',
      );

    queryBuilder
      .innerJoin(Follow, 'f', 'p.userKakaoId = f.toUserKakaoId')
      .leftJoin(
        `(${mutualFollows.getQuery()})`,
        'mf',
        'p.userKakaoId = mf.user1 AND f.fromUserKakaoId = mf.user2',
      )
      .where('f.fromUserKakaoId = :kakaoId', { kakaoId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('mf.user1 IS NOT NULL AND p.scope IN (:...scopes)', {
            scopes: ['PUBLIC', 'PROTECTED'],
          }).orWhere('mf.user1 IS NULL AND p.scope = :publicScope', {
            publicScope: 'PUBLIC',
          });
        }),
      );

    if (date_filter) {
      queryBuilder.andWhere('p.date_created > :date_filter', {
        date_filter: date_filter,
      });
    }

    // queryBuilder
    //   .andWhere(`p.userKakaoId = any(${subQuery})`) // 만약 서로이웃으로 scope하려면, 정반대 옵션으로 subQuery2를 만들고 andWhere()하나 추가하면 될듯
    //   .andWhere('p.scope IN (:...scopes)', {
    //     scopes: [OpenScope.PUBLIC],
    //   }); //sql injection 방지를 위해 만드시 enum 거칠 것

    // if (date_filter) {
    //   queryBuilder.andWhere('p.date_created > :date_filter', {
    //     date_filter: date_filter,
    //   });
    // }

    const articles: Article[] = await queryBuilder.getMany();

    return { articles };
  }

  async fetchUserArticles({
    cursorOption,
    scope,
    userKakaoId,
    date_filter,
  }: IArticlesRepoFetchUserArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    if (cursorOption.categoryId) {
      queryBuilder.andWhere('articleCategory.id = :categoryId', {
        categoryId: cursorOption.categoryId,
      });
    }
    queryBuilder
      .andWhere('p.userKakaoId = :userKakaoId', {
        userKakaoId,
      })
      .andWhere('p.scope IN (:scope)', { scope });

    if (date_filter) {
      queryBuilder.andWhere('p.date_created > :date_filter', {
        date_filter: date_filter,
      });
    }

    const articles: Article[] = await queryBuilder.getMany();

    return { articles };
  }
}
