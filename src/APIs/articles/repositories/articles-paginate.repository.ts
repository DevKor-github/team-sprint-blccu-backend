import { Brackets, DataSource, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { SortOption } from 'src/common/enums/sort-option';
import { ArticleOrderOption } from 'src/common/enums/article-order-option';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import {
  IArticlesRepoFetchArticlesCursor,
  IArticlesRepoFetchFriendsArticlesCursor,
  IArticlesRepoFetchUserArticlesCursor,
  IArticlesRepoGetCursorQuery,
} from '../interfaces/articles.repository.interface';
import { Follow } from 'src/APIs/follows/entities/follow.entity';
import { Injectable } from '@nestjs/common';
import { transformKeysToArgsFormat } from 'src/utils/classUtils';
import { USER_PRIMARY_RESPONSE_DTO_KEYS } from 'src/APIs/users/dtos/response/user-primary-response.dto';

@Injectable()
export class ArticlesPaginateRepository extends Repository<Article> {
  constructor(private db_dataSource: DataSource) {
    super(Article, db_dataSource.createEntityManager());
  }
  getCursorQuery({ order, sort, take, cursor }: IArticlesRepoGetCursorQuery) {
    const _order = ArticleOrderOption[order];

    const queryBuilder = this.createQueryBuilder('p');
    const queryByOrderSort =
      sort === SortOption.ASC
        ? `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) > :customCursor`
        : `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) < :customCursor`;
    console.log(`p.${_order}`, sort as any);
    queryBuilder
      .take(take + 1)
      .innerJoin('p.user', 'user')
      // .leftJoinAndSelect('p.articleBackground', 'article_background')
      // .leftJoinAndSelect('p.articleCategory', 'article_category')
      .addSelect(
        transformKeysToArgsFormat({
          args: 'user',
          keys: USER_PRIMARY_RESPONSE_DTO_KEYS,
        }),
      )
      .where('p.isPublished = true')
      .andWhere(queryByOrderSort, {
        customCursor: cursor,
      })
      .andWhere('p.dateDeleted IS NULL')
      // .orderBy('p.commentCount', sort as 'ASC' | 'DESC')
      .orderBy(`p.${_order}`, sort as 'ASC' | 'DESC')
      .addOrderBy('p.id', 'DESC');

    return queryBuilder;
  }

  async fetchArticlesCursor({
    cursorOption,
    dateFilter,
  }: IArticlesRepoFetchArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    queryBuilder.andWhere('p.scope IN (:...scopes)', {
      scopes: [OpenScope.PUBLIC],
    });

    if (dateFilter) {
      queryBuilder.andWhere('p.dateCreated > :dateFilter', {
        dateFilter,
      });
    }

    const articles: Article[] = await queryBuilder.getMany();

    return { articles };
  }

  async fetchFriendsArticlesCursor({
    cursorOption,
    userId,
    dateFilter,
  }: IArticlesRepoFetchFriendsArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    const mutualFollows = await this.db_dataSource
      .createQueryBuilder(Follow, 'f1')
      .select('f1.fromUserId', 'user1')
      .addSelect('f1.toUserId', 'user2')
      .innerJoin(
        Follow,
        'f2',
        'f1.fromUserId = f2.toUserId AND f1.toUserId = f2.fromUserId',
      );

    queryBuilder
      .innerJoin(Follow, 'f', 'p.userId = f.toUserId')
      .leftJoin(
        `(${mutualFollows.getQuery()})`,
        'mf',
        'p.userId = mf.user1 AND f.fromUserId = mf.user2',
      )
      .where('f.fromUserId = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('mf.user1 IS NOT NULL AND p.scope IN (:...scopes)', {
            scopes: ['PUBLIC', 'PROTECTED'],
          }).orWhere('mf.user1 IS NULL AND p.scope = :publicScope', {
            publicScope: 'PUBLIC',
          });
        }),
      );

    if (dateFilter) {
      queryBuilder.andWhere('p.dateCreated > :dateFilter', {
        dateFilter,
      });
    }

    const articles: Article[] = await queryBuilder.getMany();

    return { articles };
  }

  async fetchUserArticles({
    cursorOption,
    scope,
    userId,
    dateFilter,
  }: IArticlesRepoFetchUserArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    if (cursorOption.categoryId) {
      queryBuilder.andWhere('articleCategory.id = :categoryId', {
        categoryId: cursorOption.categoryId,
      });
    }
    queryBuilder
      .andWhere('p.userId = :userId', {
        userId,
      })
      .andWhere('p.scope IN (:scope)', { scope });

    if (dateFilter) {
      queryBuilder.andWhere('p.dateCreated > :date_filter', {
        date_filter: dateFilter,
      });
    }

    const articles: Article[] = await queryBuilder.getMany();

    return { articles };
  }
}
