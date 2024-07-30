import { Injectable } from '@nestjs/common';
import { FollowsService } from '../follows/follows.service';
import { ArticleCategoriesRepository } from './articleCategories.repository';
import { ArticleCategoryDto } from './dtos/common/articleCategory.dto';
import { ArticleCategoriesResponseDto } from './dtos/response/articleCategories-response.dto';
import { BlccuException, EXCEPTIONS } from '@/common/blccu-exception';
import { ExceptionMetadata } from '@/common/decorators/exception-metadata.decorator';
import { MergeExceptionMetadata } from '@/common/decorators/merge-exception-metadata.decorator';

@Injectable()
export class ArticleCategoriesService {
  constructor(
    private readonly svc_follows: FollowsService,
    private readonly repo_articleCategories: ArticleCategoriesRepository,
  ) {}

  async findArticleCategoryByName({
    userId,
    name,
  }): Promise<ArticleCategoryDto> {
    return await this.repo_articleCategories.findOne({
      where: { user: { id: userId }, name },
    });
  }

  @ExceptionMetadata([EXCEPTIONS.CATEGORY_CONFLICT])
  async createArticleCategory({ userId, name }): Promise<ArticleCategoryDto> {
    const articleData = await this.findArticleCategoryByName({ userId, name });
    if (articleData) {
      throw new BlccuException('CATEGORY_CONFLICT');
    }
    const result = await this.repo_articleCategories.save({
      userId,
      name,
    });
    return result;
  }

  @MergeExceptionMetadata([
    {
      service: ArticleCategoriesService,
      methodName: 'findArticleCategoryByName',
    },
  ])
  @ExceptionMetadata([
    EXCEPTIONS.ARTICLE_CATEGORY_NOT_FOUND,
    EXCEPTIONS.NOT_THE_OWNER,
  ])
  async patchArticleCategory({
    userId,
    articleCategoryId,
    name,
  }): Promise<ArticleCategoryDto> {
    const data = await this.findArticleCategoryById({ articleCategoryId });
    if (!data) throw new BlccuException('ARTICLE_CATEGORY_NOT_FOUND');
    if (data.userId != userId) throw new BlccuException('NOT_THE_OWNER');
    data.name = name;
    return await this.repo_articleCategories.save(data);
  }

  async findArticleCategoryById({
    articleCategoryId,
  }): Promise<ArticleCategoryDto> {
    return await this.repo_articleCategories.findOne({
      where: { id: articleCategoryId },
    });
  }

  @MergeExceptionMetadata([{ service: FollowsService, methodName: 'getScope' }])
  async fetchAll({
    userId,
    targetUserId,
  }): Promise<ArticleCategoriesResponseDto[]> {
    const scope = await this.svc_follows.getScope({
      fromUser: targetUserId,
      toUser: userId,
    });
    return await this.repo_articleCategories.fetchUserCategory({
      userId: targetUserId,
      scope,
    });
  }

  @ExceptionMetadata([
    EXCEPTIONS.ARTICLE_CATEGORY_NOT_FOUND,
    EXCEPTIONS.NOT_THE_OWNER,
  ])
  async deleteArticleCategory({ userId, articleCategoryId }) {
    const data = await this.findArticleCategoryById({ articleCategoryId });
    if (!data) throw new BlccuException('ARTICLE_CATEGORY_NOT_FOUND');
    if (data.userId != userId) throw new BlccuException('NOT_THE_OWNER');
    return await this.repo_articleCategories.delete({
      id: data.id,
      user: { id: userId },
    });
  }
}
