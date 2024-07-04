import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ArticleCategory } from './entities/articleCategory.entity';

@Injectable()
export class ArticleCategoriesRepository extends Repository<ArticleCategory> {
  constructor(private dataSource: DataSource) {
    super(ArticleCategory, dataSource.createEntityManager());
  }

  async fetchUserCategory({ scope, userKakaoId }) {
    const query = this.createQueryBuilder('pc')
      .select([
        'COALESCE(COUNT(p.id), 0) as postCount', // postCategory당 posts의 개수를 집계
        'pc.id as categoryId', // postCategory에 대한 그룹화를 위해 id 열을 추가
        'pc.name as categoryName',
      ])
      .leftJoin(
        'pc.posts',
        'p',
        'p.scope IN (:scope) AND p.isPublished = true',
        { scope },
      ) // LEFT JOIN으로 연결된 엔티티의 조건을 추가
      .where('pc.userKakaoId = :userKakaoId', { userKakaoId })
      .groupBy('pc.id'); // postCategory.id를 기준으로 그룹화
    console.log('??', userKakaoId);

    return await query.getRawMany();
  }
}
