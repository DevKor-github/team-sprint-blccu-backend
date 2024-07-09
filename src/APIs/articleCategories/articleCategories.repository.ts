import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ArticleCategory } from './entities/articleCategory.entity';
import { ArticleCategoriesResponseDto } from './dtos/response/articleCategories-response.dto';

@Injectable()
export class ArticleCategoriesRepository extends Repository<ArticleCategory> {
  constructor(private db_dataSource: DataSource) {
    super(ArticleCategory, db_dataSource.createEntityManager());
  }

  async fetchUserCategory({
    scope,
    userId,
  }): Promise<ArticleCategoriesResponseDto[]> {
    const query = this.createQueryBuilder('ac')
      .select([
        'COALESCE(COUNT(a.id), 0) as articleCount', // postCategory당 posts의 개수를 집계
        'ac.id as categoryId', // postCategory에 대한 그룹화를 위해 id 열을 추가
        'ac.name as categoryName',
      ])
      .leftJoin(
        'ac.articles',
        'a',
        'a.scope IN (:scope) AND a.is_published = true',
        { scope },
      ) // LEFT JOIN으로 연결된 엔티티의 조건을 추가
      .where('ac.userId = :userId', { userId })
      .groupBy('ac.id'); // postCategory.id를 기준으로 그룹화
    console.log('??', userId);

    return await query.getRawMany();
  }
}
