import { Brackets, DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { Injectable } from '@nestjs/common';
import { OpenScope } from 'src/common/enums/open-scope.enum';
import { PostResponseDto } from './dtos/post-response.dto';
import { PostResponseDtoExceptCategory } from './dtos/fetch-post-for-update.dto';
import { PostsOrderOption } from 'src/common/enums/posts-order-option';
import { PostsFilterOption } from 'src/common/enums/posts-filter-option';
import { SortOption } from 'src/common/enums/sort-option';
import {
  IPostsRepoFetchFriendsPostsCursor,
  IPostsRepoFetchPostsCursor,
  IPostsRepoFetchUserPostsCursor,
  IPostsRepoGetCursorQuery,
} from './interfaces/posts.repository.interface';
import { Follow } from '../follows/entities/follow.entity';
@Injectable()
export class PostsRepository extends Repository<Posts> {
  constructor(private dataSource: DataSource) {
    super(Posts, dataSource.createEntityManager());
  }
  async upsertPost(post) {
    return await this.createQueryBuilder()
      .insert()
      .into(Posts, Object.keys(post))
      .values(post)
      .execute();
  }

  async fetchPosts(page) {
    return (
      this.createQueryBuilder('p')
        .innerJoin('p.user', 'user')
        .leftJoinAndSelect('p.postBackground', 'postBackground')
        .leftJoinAndSelect('p.postCategory', 'postCategory')
        .addSelect([
          'user.handle',
          'user.kakaoId',
          'user.description',
          'user.profile_image',
          'user.username',
        ])
        .where('p.isPublished = true')
        .andWhere('p.scope IN (:...scopes)', { scopes: [OpenScope.PUBLIC] })
        .andWhere('p.date_deleted IS NULL')
        //sql injection 방지를 위해 반드시 enum 거칠 것
        .andWhere(`${PostsFilterOption[page.filter]} LIKE :search`, {
          search: `%${page.search}%`,
        })
        .orderBy(`p.${PostsOrderOption[page.order]}`, 'DESC')
        .take(page.getLimit())
        .skip(page.getOffset())
        .getManyAndCount()
    );
  }

  async fetchPostDetail({ id, scope }): Promise<PostResponseDto> {
    await this.update(id, {
      view_count: () => 'view_count +1',
    });
    return await this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.postBackground', 'postBackground')
      .leftJoinAndSelect('p.postCategory', 'postCategory')
      .addSelect([
        'user.handle',
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.id = :id', { id })
      .andWhere('p.scope IN (:scope)', { scope })
      .andWhere('p.date_deleted IS NULL')
      .getOne();
  }
  async fetchPostForUpdate(id) {
    return await this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.postBackground', 'postBackground')
      .leftJoinAndSelect('p.postCategory', 'postCategory')
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

  async fetchFriendsPosts(subQuery, page) {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.postBackground', 'postBackground')
      .leftJoinAndSelect('p.postCategory', 'postCategory')
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
      .andWhere(`${PostsFilterOption[page.filter]} LIKE :search`, {
        search: `%${page.search}%`,
      })
      .orderBy(`p.${PostsOrderOption[page.order]}`, 'DESC')
      .andWhere('p.isPublished = true')
      .orderBy('p.id', 'DESC')
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();
  }

  async fetchTempPosts(
    kakaoId: number,
  ): Promise<PostResponseDtoExceptCategory[]> {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.postBackground', 'postBackground')
      .leftJoinAndSelect('p.postCategory', 'postCategory')
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

  getCursorQuery({ order, sort, take, cursor }: IPostsRepoGetCursorQuery) {
    const _order = PostsOrderOption[order];

    const queryBuilder = this.createQueryBuilder('p');
    const queryByOrderSort =
      sort === SortOption.ASC
        ? `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) > :customCursor`
        : `CONCAT(LPAD(p.${_order}, 7, '0'), LPAD(p.id, 7, '0')) < :customCursor`;

    queryBuilder
      .take(take + 1)
      .innerJoin('p.user', 'user')
      .leftJoinAndSelect('p.postBackground', 'postBackground')
      .leftJoinAndSelect('p.postCategory', 'postCategory')
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

  async fetchPostsCursor({
    cursorOption,
    date_filter,
  }: IPostsRepoFetchPostsCursor) {
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

    const posts: Posts[] = await queryBuilder.getMany();

    return { posts };
  }

  async fetchFriendsPostsCursor({
    cursorOption,
    kakaoId,
    date_filter,
  }: IPostsRepoFetchFriendsPostsCursor) {
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

    const posts: Posts[] = await queryBuilder.getMany();

    return { posts };
  }

  async fetchUserPosts({
    cursorOption,
    scope,
    userKakaoId,
    date_filter,
  }: IPostsRepoFetchUserPostsCursor) {
    const { order, cursor, take, sort } = cursorOption;
    const queryBuilder = this.getCursorQuery({ order, cursor, take, sort });

    if (cursorOption.categoryId) {
      queryBuilder.andWhere('postCategory.id = :categoryId', {
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

    const posts: Posts[] = await queryBuilder.getMany();

    return { posts };
  }
}
