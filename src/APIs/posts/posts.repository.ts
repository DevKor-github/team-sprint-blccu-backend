import { DataSource, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { Injectable } from '@nestjs/common';
import { OpenScope } from 'src/commons/enums/open-scope.enum';
@Injectable()
export class PostsRepository extends Repository<Posts> {
  constructor(private dataSource: DataSource) {
    super(Posts, dataSource.manager);
  }
  async upsertPost(post) {
    return await this.createQueryBuilder()
      .insert()
      .into(Posts, Object.keys(post))
      .values(post)
      .orUpdate(Object.keys(post), ['id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
  }

  async fetchPosts(page) {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .innerJoinAndSelect('p.postBackground', 'postBackground')
      .innerJoinAndSelect('p.postCategory', 'postCategory')
      .addSelect([
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where('p.isPublished = true')
      .andWhere('p.scope IN (:...scopes)', { scopes: [OpenScope.PUBLIC] })
      .orderBy('p.id', 'DESC')
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();
  }

  async fetchPostForUpdate(id) {
    return (
      this.createQueryBuilder('p')
        .innerJoin('p.user', 'user')
        .innerJoinAndSelect('p.postBackground', 'postBackground')
        // .innerJoinAndSelect('p.postCategory', 'postCategory')
        .addSelect([
          'user.kakaoId',
          'user.description',
          'user.profile_image',
          'user.username',
        ])
        .where('p.id = :id', { id })
        .getOne()
    );
  }

  async fetchFriendsPosts(subQuery, page) {
    return this.createQueryBuilder('p')
      .innerJoin('p.user', 'user')
      .innerJoinAndSelect('p.postBackground', 'postBackground')
      .innerJoinAndSelect('p.postCategory', 'postCategory')
      .addSelect([
        'user.kakaoId',
        'user.description',
        'user.profile_image',
        'user.username',
      ])
      .where(`p.userKakaoId = any(${subQuery})`)
      .andWhere('p.scope IN (:...scopes)', {
        scopes: [OpenScope.PUBLIC, OpenScope.PROTECTED],
      })
      .andWhere('p.isPublished = true')
      .orderBy('p.id', 'DESC')
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();
  }

  async fetchTempPosts(kakaoId) {
    return this.createQueryBuilder('p')
      .where('p.userKakaoId = :kakaoId', { kakaoId })
      .andWhere(`p.isPublished = false`)
      .getMany();
  }
}
