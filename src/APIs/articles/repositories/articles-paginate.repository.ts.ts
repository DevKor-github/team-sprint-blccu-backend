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

export class ArticlesPaginateRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
  getCursorQuery({ order, sort, take, cursor }: IArticlesRepoGetCursorQuery) {
    const _order = ArticleOrderOption[order];

    const queryBuilder = this.createQueryBuilder('p');
    const queryByOrderSort =
      sort === SortOption.ASC
        ? `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) > :customCursor`
        : `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) < :customCursor`;

    queryBuilder
      .take(take + 1)
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.article_background', 'article_background')
      .leftJoinAndSelect('p.article_category', 'article_category')
      .addSelect([
        'user.handle',
        'user.id',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.is_published = true')
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
    userId,
    date_filter,
  }: IArticlesRepoFetchFriendsArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    const mutualFollows = await this.dataSource
      .createQueryBuilder(Follow, 'f1')
      .select('f1.from_user_id', 'user1')
      .addSelect('f1.to_user_id', 'user2')
      .innerJoin(
        Follow,
        'f2',
        'f1.from_user_id = f2.to_user_id AND f1.to_user_id = f2.from_user_id',
      );

    queryBuilder
      .innerJoin(Follow, 'f', 'p.user_id = f.to_user_id')
      .leftJoin(
        `(${mutualFollows.getQuery()})`,
        'mf',
        'p.user_id = mf.user1 AND f.from_user_id = mf.user2',
      )
      .where('f.from_user_id = :userId', { userId })
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

    const articles: Article[] = await queryBuilder.getMany();

    return { articles };
  }

  async fetchUserArticles({
    cursorOption,
    scope,
    userId,
    date_filter,
  }: IArticlesRepoFetchUserArticlesCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    if (cursorOption.categoryId) {
      queryBuilder.andWhere('article_category.id = :categoryId', {
        categoryId: cursorOption.categoryId,
      });
    }
    queryBuilder
      .andWhere('p.user_id = :user_id', {
        userId,
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
