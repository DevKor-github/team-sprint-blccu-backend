import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowsService } from '../follows/follows.service';
import { ArticleCategoriesRepository } from './articleCategories.repository';
import { ArticleCategoryDto } from './dtos/common/articleCategory.dto';
import { ArticleCategoriesResponseDto } from './dtos/response/articleCategories-response.dto';

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

  async createArticleCategory({ userId, name }): Promise<ArticleCategoryDto> {
    const articleData = await this.findArticleCategoryByName({ userId, name });
    if (articleData) {
      throw new BadRequestException('이미 동명의 카테고리가 존재합니다.');
    }
    const result = await this.repo_articleCategories.save({
      user: { id: userId },
      name,
    });
    return result;
  }

  async patchArticleCategory({
    userId,
    articleCategoryId,
    name,
  }): Promise<ArticleCategoryDto> {
    const data = await this.findArticleCategoryById({ articleCategoryId });
    if (!data) throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    if (data.userId != userId)
      throw new ForbiddenException('카테고리를 수정할 권한이 없습니다.');
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

  deleteArticleCategory({ userId, articleCategoryId }) {
    return this.repo_articleCategories.delete({
      id: articleCategoryId,
      user: { id: userId },
    });
  }
}
